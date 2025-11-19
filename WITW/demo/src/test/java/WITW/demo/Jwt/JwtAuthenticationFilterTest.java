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

package WITW.demo.Jwt;

class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private HttpServletRequest solicitud; // solicitud HTTP

    @Mock
    private HttpServletResponse respuesta; // respuesta HTTP

    @Mock
    private FilterChain cadenaFiltros; // filterChain

    @Mock
    private UserDetails detallesUsuario; // userDetails

    private AutoCloseable mocks;
    private JwtAuthenticationFilter filtro; // filter

    @BeforeEach
    void setUp() {
        mocks = MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext(); // Limpiar el contexto antes de cada prueba
        filtro = new JwtAuthenticationFilter(jwtService, userDetailsService);
    }

    @AfterEach
    void tearDown() throws Exception {
        SecurityContextHolder.clearContext(); // Limpiar el contexto después de cada prueba
        mocks.close();
    }

    @Test
    void doFilterInternal_sinCabeceraAuthorization_llamaCadenaYNoAutentica() throws ServletException, IOException {
        // Arrange
        when(solicitud.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

        // Act
        filtro.doFilterInternal(solicitud, respuesta, cadenaFiltros);

        // Assert
        // Verificar que la cadena de filtros fue llamada
        verify(cadenaFiltros, times(1)).doFilter(solicitud, respuesta);
        // Verificar que no hay autenticación
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        // Verificar que los servicios clave no fueron interactuados
        verifyNoInteractions(jwtService, userDetailsService);
    }

    @Test
    void doFilterInternal_tokenPresente_peroUsernameEsNulo_llamaCadenaYNoAutentica() throws ServletException, IOException {
        // Arrange
        final String token = "sometoken";
        when(solicitud.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + token);
        // Simular que el token no contiene un nombre de usuario válido
        when(jwtService.getUsernameFromToken(token)).thenReturn(null);

        // Act
        filtro.doFilterInternal(solicitud, respuesta, cadenaFiltros);

        // Assert
        verify(jwtService, times(1)).getUsernameFromToken(token);
        verify(cadenaFiltros, times(1)).doFilter(solicitud, respuesta);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        // Verificar que el UserDetailsService no fue llamado
        verifyNoMoreInteractions(userDetailsService); 
    }

    @Test
    void doFilterInternal_tokenPresente_usernamePresente_peroYaAutenticado_saltaAutenticacion() throws ServletException, IOException {
        // Arrange
        when(solicitud.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer token123");
        when(jwtService.getUsernameFromToken("token123")).thenReturn("user");
        
        // Poner una autenticación existente en el contexto
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("existing", null, null));

        // Act
        filtro.doFilterInternal(solicitud, respuesta, cadenaFiltros);

        // Assert
        // No debería intentar cargar UserDetails ni validar el token porque ya hay autenticación
        verify(jwtService, never()).isTokenValid(any(), any());
        verify(userDetailsService, never()).loadUserByUsername(any());
        verify(cadenaFiltros, times(1)).doFilter(solicitud, respuesta);
        
        // Verificar que la autenticación existente no fue sobrescrita (aunque el assert en este caso es implícito)
        Authentication authActual = SecurityContextHolder.getContext().getAuthentication();
        assertEquals("existing", authActual.getPrincipal());
    }

    @Test
    void doFilterInternal_tokenValido_estableceAutenticacionYLlamaCadena() throws ServletException, IOException {
        // Arrange
        final String tokenValido = "validtoken";
        final String nombreUsuario = "alice";
        when(solicitud.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + tokenValido);
        when(jwtService.getUsernameFromToken(tokenValido)).thenReturn(nombreUsuario);
        when(userDetailsService.loadUserByUsername(nombreUsuario)).thenReturn(detallesUsuario);
        when(jwtService.isTokenValid(tokenValido, detallesUsuario)).thenReturn(true);

        // Proporcionar algunos valores usados por WebAuthenticationDetailsSource (opcional)
        when(solicitud.getRemoteAddr()).thenReturn("127.0.0.1");
        when(solicitud.getHeader("User-Agent")).thenReturn("JUnit");

        // Act
        filtro.doFilterInternal(solicitud, respuesta, cadenaFiltros);

        // Assert
        verify(jwtService, times(1)).getUsernameFromToken(tokenValido);
        verify(userDetailsService, times(1)).loadUserByUsername(nombreUsuario);
        verify(jwtService, times(1)).isTokenValid(tokenValido, detallesUsuario);
        verify(cadenaFiltros, times(1)).doFilter(solicitud, respuesta);

        // Verificar el contexto de seguridad
        Authentication autenticacion = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(autenticacion, "La autenticación debe establecerse en SecurityContext");
        assertTrue(autenticacion instanceof UsernamePasswordAuthenticationToken);
        assertEquals(detallesUsuario, autenticacion.getPrincipal());
        assertNull(autenticacion.getCredentials());
        assertNotNull(autenticacion.getAuthorities());
    }
    
    // --- Pruebas para shouldNotFilter ---

    @Test
    void shouldNotFilter_rutaComienzaConAuth_retornaTrue() throws ServletException {
        when(solicitud.getServletPath()).thenReturn("/auth/login");
        // Los filtros de autenticación generalmente se saltan para rutas de inicio de sesión/registro
        assertTrue(filtro.shouldNotFilter(solicitud));
    }

    @Test
    void shouldNotFilter_rutaNoComienzaConAuth_retornaFalse() throws ServletException {
        when(solicitud.getServletPath()).thenReturn("/api/resource");
        // Para rutas de API protegidas, el filtro debe ejecutarse
        assertFalse(filtro.shouldNotFilter(solicitud));
    }
}