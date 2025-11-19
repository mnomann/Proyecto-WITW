package WITW.demo.Auth;

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
    void register-savesUserWithEncodedPassword_and_returnsToken() throws Exception {
        // Arrange
        RegisterRequest request = Mockito.mock(RegisterRequest.class);
        when(request.getUsername()).thenReturn("alice");
        when(request.getPassword()).thenReturn("plainPass");
        when(request.getFirstname()).thenReturn("Alice");
        when(request.getCountry()).thenReturn("Wonderland");
        // the implementation reads request.lastname (field access), set it via reflection on the mock
        setFieldOnMock(request, "lastname", "Liddell");

        when(passwordEncoder.encode("plainPass")).thenReturn("encodedPass");
        when(jwtService.getToken(any(User.class))).thenReturn("jwt-token-123");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userRepository.save(userCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertEquals("jwt-token-123", response.getToken());
        User saved = userCaptor.getValue();
        assertEquals("alice", saved.getUsername());
        assertEquals("encodedPass", saved.getPassword());
        assertEquals("Alice", saved.getFirstname());
        assertEquals("Liddell", saved.getLastname());
        assertEquals("Wonderland", saved.getCountry());
        assertEquals(Role.USER, saved.getRole());

        verify(userRepository).save(any(User.class));
        verify(jwtService).getToken(saved);
    }

    private static void setFieldOnMock(Object mock, String fieldName, Object value) throws Exception {
        Class<?> clazz = mock.getClass();
        Field field = null;
        while (clazz != null && clazz != Object.class) {
            try {
                field = clazz.getDeclaredField(fieldName);
                break;
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        if (field == null) {
            throw new NoSuchFieldException("Field '" + fieldName + "' not found on mock");
        }
        field.setAccessible(true);
        field.set(mock, value);
    }

@Test
void register_ShouldCreateUserAndReturnToken() {
    // Arrange
    RegisterRequest request = new RegisterRequest();
    request.setUsername("testuser");
    request.setPassword("password123");
    request.setFirstname("John");
    request.setLastname("Doe");
    request.setCountry("Chile");

    User user = User.builder()
        .username("testuser")
        .password("encodedPassword")
        .firstname("John")
        .lastname("Doe")
        .country("Chile")
        .role(Role.USER)
        .build();

    when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
    when(userRepository.save(any(User.class))).thenReturn(user);
    when(jwtService.getToken(any(User.class))).thenReturn("fake-jwt-token");

    // Act
    AuthResponse response = authService.register(request);

    // Assert
    assertNotNull(response);
    assertEquals("fake-jwt-token", response.getToken());
    verify(passwordEncoder).encode("password123");
    verify(userRepository).save(any(User.class));
    verify(jwtService).getToken(any(User.class));
}

}
