package WITW.demo.Auth;

import WITW.demo.Jwt.JwtService; // Importa tu JwtService
import WITW.demo.User.Role;
import WITW.demo.User.User;
import WITW.demo.User.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder; // Importante
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.hamcrest.Matchers.notNullValue;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos esto para guardar contraseñas reales

    @Autowired
    private JwtService jwtService; // Inyectamos esto para generar tokens manualmente si hace falta

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
       
    }

    @Test
    void testLoginUser_Success() throws Exception {
        // 1. PREPARACIÓN (Garantizado): Guardamos el usuario directamente en la BD
        User user = User.builder()
                .username("usuario_para_login")
                .password(passwordEncoder.encode("clave123")) // IMPORTANTE: Encriptar la clave
                .firstname("Test")
                .lastname("Login")
                .country("Mexico")
                .role(Role.USER)
                .build();
        userRepository.save(user);

        // 2. EJECUCIÓN: Intentamos Login con la clave "cruda" (sin encriptar)
        LoginRequest loginRequest = LoginRequest.builder()
                .username("usuario_para_login")
                .password("clave123") // La misma clave que usamos arriba
                .build();

        // 3. VERIFICACIÓN
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk()) // Ahora debería dar 200 OK
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    // --- TEST QUE FALLABA (Error general) ---
    @Test
    void testAccessProtectedEndpoint_Success() throws Exception {
        //  Crear Usuario
        User user = User.builder()
                .username("usuario_token")
                .password(passwordEncoder.encode("1234"))
                .firstname("Demo")
                .lastname("Access")
                .country("Peru")
                .role(Role.USER)
                .build();
        userRepository.save(user);

        // Generar Token manualmente 
        String token = jwtService.getToken(user);

        // EJECUCIÓN: Usar el token para entrar al endpoint protegido
        mockMvc.perform(post("/api/v1/demo")
                        .header("Authorization", "Bearer " + token)) // Header correcto
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome from secure endpoint"));
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .username("nuevo_registro")
                .password("password123")
                .firstname("New")
                .lastname("User")
                .country("Chile")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    @Test
    void testLoginUser_Failure() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("no_existo")
                .password("mal_pass")
                .build();
        
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden());
    }
}