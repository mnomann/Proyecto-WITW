package WITW.demo.Jwt;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.core.context.SecurityContextHolder;










class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private UserDetails userDetails;

    private AutoCloseable mocks;
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
        filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
    }

    @AfterEach
    void tearDown() throws Exception {
        SecurityContextHolder.clearContext();
        mocks.close();
    }

    @Test
    void doFilterInternal_noAuthorizationHeader_callsChainAndDoesNotAuthenticate() throws ServletException, IOException {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verifyNoInteractions(jwtService, userDetailsService);
    }

    @Test
    void doFilterInternal_tokenPresent_butUsernameIsNull_callsChainAndDoesNotAuthenticate() throws ServletException, IOException {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer sometoken");
        when(jwtService.getUsernameFromToken("sometoken")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(jwtService, times(1)).getUsernameFromToken("sometoken");
        verify(filterChain, times(1)).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verifyNoMoreInteractions(userDetailsService);
    }

    @Test
    void doFilterInternal_tokenPresent_usernamePresent_butAlreadyAuthenticated_skipsAuthentication() throws ServletException, IOException {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer token123");
        when(jwtService.getUsernameFromToken("token123")).thenReturn("user");
        // Put an existing authentication in the context
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("existing", null, null));

        filter.doFilterInternal(request, response, filterChain);

        // Should not attempt to load UserDetails or validate token because authentication is non-null
        verifyNoInteractions(userDetailsService, jwtService); // getUsernameFromToken already stubbed but will not be called due to early check
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void doFilterInternal_tokenValid_setsAuthenticationAndCallsChain() throws ServletException, IOException {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer validtoken");
        when(jwtService.getUsernameFromToken("validtoken")).thenReturn("alice");
        when(userDetailsService.loadUserByUsername("alice")).thenReturn(userDetails);
        when(jwtService.isTokenValid("validtoken", userDetails)).thenReturn(true);

        // Provide some values used by WebAuthenticationDetailsSource (optional)
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getHeader("User-Agent")).thenReturn("JUnit");

        filter.doFilterInternal(request, response, filterChain);

        verify(jwtService, times(1)).getUsernameFromToken("validtoken");
        verify(userDetailsService, times(1)).loadUserByUsername("alice");
        verify(jwtService, times(1)).isTokenValid("validtoken", userDetails);
        verify(filterChain, times(1)).doFilter(request, response);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(auth, "Authentication should be set in SecurityContext");
        assertTrue(auth instanceof UsernamePasswordAuthenticationToken);
        assertEquals(userDetails, auth.getPrincipal());
        assertNull(auth.getCredentials());
        // authorities equality is handled by UserDetails mock if needed; at least ensure it's present (not null)
        assertNotNull(auth.getAuthorities());
    }

    @Test
    void shouldNotFilter_pathStartsWithAuth_returnsTrue() throws ServletException {
        when(request.getServletPath()).thenReturn("/auth/login");
        assertTrue(filter.shouldNotFilter(request));
    }

    @Test
    void shouldNotFilter_pathDoesNotStartWithAuth_returnsFalse() throws ServletException {
        when(request.getServletPath()).thenReturn("/api/resource");
        assertFalse(filter.shouldNotFilter(request));
    }

}
