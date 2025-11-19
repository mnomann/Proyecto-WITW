package WITW.demo.Auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    void login-shouldReturnAuthResponse() throws Exception {
        LoginRequest request = new LoginRequest("example@gmail.com", "password");
        AuthResponse response = new AuthResponse("token123");

        when(authService.login(request)).thenReturn(response);

        String jsonRequest = """
            {
                "email": "example@gmail.com",
                "password": "password"
            }
            """;

        String jsonResponse = """
            {"token":"token123"}
            """;

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().json(jsonResponse));

        verify(authService).login(request);
    }

    @Test
    void register_shouldReturnAuthResponse() throws Exception {
        RegisterRequest request = new RegisterRequest("gabriel", "example@gmail.com", "pass123");
        AuthResponse response = new AuthResponse("tokenABC");

        when(authService.register(request)).thenReturn(response);

        String jsonRequest = """
            {
                "username": "gabriel",
                "email": "example@gmail.com",
                "password": "pass123"
            }
            """;

        String jsonResponse = """
            {"token":"tokenABC"}
            """;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(content().json(jsonResponse));

        verify(authService).register(request);
    }
}
