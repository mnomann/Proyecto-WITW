import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.lang.reflect.Field;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import WITW.demo.Jwt.JwtService;
import WITW.demo.User.Role;
import WITW.demo.User.User;
import WITW.demo.User.UserRepository;

package WITW.demo.Auth;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_savesUserWithEncodedPassword_and_returnsToken() throws Exception {
        // Preparar (Arrange)
        RegisterRequest solicitudRegistro = Mockito.mock(RegisterRequest.class);
        when(solicitudRegistro.getUsername()).thenReturn("alice");
        when(solicitudRegistro.getPassword()).thenReturn("plainPass");
        when(solicitudRegistro.getFirstname()).thenReturn("Alice");
        when(solicitudRegistro.getCountry()).thenReturn("Wonderland");
        
        // La implementación lee request.lastname (acceso a campo), se establece mediante reflexión en el mock
        setFieldOnMock(solicitudRegistro, "lastname", "Liddell");

        // Simular el codificador de contraseñas
        when(passwordEncoder.encode("plainPass")).thenReturn("encodedPass");
        
        // Simular el servicio JWT para devolver un token
        when(jwtService.getToken(any(User.class))).thenReturn("jwt-token-123");

        // Capturar el objeto User que se guarda
        ArgumentCaptor<User> captorUsuario = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(captorUsuario.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        // Actuar (Act)
        AuthResponse respuesta = authService.register(solicitudRegistro);

        // Afirmar (Assert)
        assertEquals("jwt-token-123", respuesta.getToken());
        
        // Verificar los detalles del User capturado
        User usuarioGuardado = captorUsuario.getValue();
        assertEquals("alice", usuarioGuardado.getUsername());
        assertEquals("encodedPass", usuarioGuardado.getPassword());
        assertEquals("Alice", usuarioGuardado.getFirstname());
        assertEquals("Liddell", usuarioGuardado.getLastname());
        assertEquals("Wonderland", usuarioGuardado.getCountry());
        assertEquals(Role.USER, usuarioGuardado.getRole());

        // Verificar que el método save fue llamado
        verify(userRepository).save(any(User.class));
        // Verificar que se solicitó un token para el usuario guardado
        verify(jwtService).getToken(usuarioGuardado);
    }

    /**
     * Establece un valor en un campo específico de un objeto mock,
     * útil cuando la clase bajo prueba accede directamente a un campo
     * en lugar de usar un getter.
     */
    private static void setFieldOnMock(Object mock, String nombreCampo, Object valor) throws Exception {
        Class<?> clazz = mock.getClass();
        Field campo = null;
        while (clazz != null && clazz != Object.class) {
            try {
                campo = clazz.getDeclaredField(nombreCampo);
                break;
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        if (campo == null) {
            throw new NoSuchFieldException("Campo '" + nombreCampo + "' no encontrado en el mock");
        }
        campo.setAccessible(true);
        campo.set(mock, valor);
    }
}