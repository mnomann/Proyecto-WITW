package WITW.demo.Jwt;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.JwtException;
import org.mockito.Mockito;





public class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_and_extractUsername() {
        UserDetails user = Mockito.mock(UserDetails.class);
        Mockito.when(user.getUsername()).thenReturn("alice");

        String token = jwtService.getToken(user);
        String username = jwtService.getUsernameFromToken(token);

        assertEquals("alice", username);
    }

    @Test
    void isTokenValid_returnsTrue_forMatchingUser() {
        UserDetails user = Mockito.mock(UserDetails.class);
        Mockito.when(user.getUsername()).thenReturn("bob");

        String token = jwtService.getToken(user);

        // same userDetails instance (matching username) should validate
        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void isTokenValid_returnsFalse_forDifferentUser() {
        UserDetails tokenOwner = Mockito.mock(UserDetails.class);
        Mockito.when(tokenOwner.getUsername()).thenReturn("carol");

        UserDetails otherUser = Mockito.mock(UserDetails.class);
        Mockito.when(otherUser.getUsername()).thenReturn("dave");

        String token = jwtService.getToken(tokenOwner);

        assertFalse(jwtService.isTokenValid(token, otherUser));
    }

    @Test
    void tamperedToken_throwsJwtException_onParsing() {
        UserDetails user = Mockito.mock(UserDetails.class);
        Mockito.when(user.getUsername()).thenReturn("eve");

        String token = jwtService.getToken(user);
        // tamper with the token (break the signature)
        String tampered = token + "x";

        assertThrows(JwtException.class, () -> jwtService.getUsernameFromToken(tampered));
    }

}
