import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.JwtException;
import org.mockito.Mockito;

package WITW.demo.Jwt;

public class JwtServiceTest {

    private JwtService servicioJwt; // jwtService

    @BeforeEach
    void setUp() {
        // Inicializa la instancia del servicio JWT antes de cada prueba
        servicioJwt = new JwtService();
    }

    @Test
    void generateToken_y_extractUsername() {
        // Arrange
        UserDetails usuario = Mockito.mock(UserDetails.class);
        Mockito.when(usuario.getUsername()).thenReturn("alice");

        // Act
        String token = servicioJwt.getToken(usuario);
        String nombreUsuario = servicioJwt.getUsernameFromToken(token);

        // Assert
        // El nombre de usuario extraído debe coincidir con el original
        assertEquals("alice", nombreUsuario);
    }

    @Test
    void isTokenValid_retornaTrue_paraUsuarioCoincidente() {
        // Arrange
        UserDetails usuario = Mockito.mock(UserDetails.class);
        Mockito.when(usuario.getUsername()).thenReturn("bob");

        String token = servicioJwt.getToken(usuario);

        // Act & Assert
        // La misma instancia de UserDetails (nombre de usuario coincidente) debe validar
        assertTrue(servicioJwt.isTokenValid(token, usuario));
    }

    @Test
    void isTokenValid_retornaFalse_paraUsuarioDiferente() {
        // Arrange
        UserDetails propietarioToken = Mockito.mock(UserDetails.class);
        Mockito.when(propietarioToken.getUsername()).thenReturn("carol");

        UserDetails otroUsuario = Mockito.mock(UserDetails.class);
        Mockito.when(otroUsuario.getUsername()).thenReturn("dave");

        String token = servicioJwt.getToken(propietarioToken);

        // Act & Assert
        // El token generado para 'carol' no debe ser válido para 'dave'
        assertFalse(servicioJwt.isTokenValid(token, otroUsuario));
    }

    @Test
    void tamperedToken_lanzaJwtException_alParsear() {
        // Arrange
        UserDetails usuario = Mockito.mock(UserDetails.class);
        Mockito.when(usuario.getUsername()).thenReturn("eve");

        String token = servicioJwt.getToken(usuario);
        // Alterar el token (romper la firma) añadiendo un carácter extra
        String tokenAlterado = token + "x";

        // Act & Assert
        // Intentar obtener el nombre de usuario de un token alterado debe lanzar una excepción de seguridad
        assertThrows(JwtException.class, () -> servicioJwt.getUsernameFromToken(tokenAlterado));
    }
}