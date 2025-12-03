package WITW.demo.Events;

import WITW.demo.User.Role;
import WITW.demo.User.User;
import WITW.demo.User.UserRepository;
import WITW.demo.Jwt.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Carga el contexto completo de Spring Boot para pruebas de integración
@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Garantiza que los cambios en la BD se reviertan después de cada test
public class EventoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EventoRepository eventoRepository; // Inyectamos el repo para preparar datos

    // Variable para el token de autenticación
    private String validToken;
    private final String EVENT_API = "/api/eventos";

    //CONFIGURACIÓN INICIAL

    // Ejecuta antes de CADA test. Crea un usuario y genera un token.
    @BeforeEach
    void setup() {
        // 1. Crear y guardar un usuario (para autenticación)
        User user = User.builder()
                .username("evento.user")
                .password(passwordEncoder.encode("securepass"))
                .firstname("Test")
                .lastname("Event")
                .country("USA")
                .role(Role.USER)
                .build();
        userRepository.save(user);

        // 2. Generar el Token JWT
        this.validToken = jwtService.getToken(user);

        // 3. Limpiar y Preparar eventos para tests de búsqueda
        eventoRepository.deleteAll();

        Evento evento1 = Evento.builder()
                .nombre("Feria Artesanal")
                .precio(1500.0)
                .horario(LocalDateTime.now().plusDays(5))
                .latitud(34.0)
                .longitud(-118.0)
                .build();

        Evento evento2 = Evento.builder()
                .nombre("Festival de Música")
                .precio(5000.0)
                .horario(LocalDateTime.now().plusDays(10))
                .latitud(40.0)
                .longitud(-74.0)
                .build();

        eventoRepository.saveAll(List.of(evento1, evento2));
    }


    //TEST DE CREACIÓN (POST) 

    @Test
    void testGuardarEvento_Success() throws Exception {
        // 1. Datos de un evento válido
        Evento nuevoEvento = Evento.builder()
                .nombre("Conferencia Tech")
                .precio(0.0)
                .horario(LocalDateTime.now().plusHours(3))
                .latitud(4.0)
                .longitud(70.0)
                .build();

        // 2. Ejecutar POST a /api/eventos/guardar
        mockMvc.perform(post(EVENT_API + "/guardar")
                        .header("Authorization", "Bearer " + validToken) // Autenticación
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevoEvento)))
                // 3. Verificar
                .andExpect(status().isOk()) // Esperamos 200 OK
                .andExpect(jsonPath("$.nombre", is("Conferencia Tech")))
                .andExpect(jsonPath("$.id").exists()); // Verifica que se asignó un ID
    }

    @Test
    void testGuardarEvento_MissingName_BadRequest() throws Exception {
        // 1. Datos de un evento INVÁLIDO (falta el nombre, que es obligatorio)
        Evento eventoInvalido = Evento.builder()
                .precio(1000.0)
                .horario(LocalDateTime.now().plusDays(1))
                .latitud(1.0)
                .longitud(1.0)
                .build();

        // 2. Ejecutar POST a /api/eventos/guardar
        mockMvc.perform(post(EVENT_API + "/guardar")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(eventoInvalido)))
                // 3. Verificar
                .andExpect(status().isBadRequest()) // Esperamos 400 Bad Request
                .andExpect(content().string(org.hamcrest.Matchers.containsString("El nombre es obligatorio"))); // Verifica el mensaje de validación
    }

    // TEST DE LISTADO Y BÚSQUEDA (GET)

    @Test
    void testListarEventos_Success() throws Exception {
        // 1. Setup ya guardó 2 eventos

        // 2. Ejecutar GET a /api/eventos/listar
        mockMvc.perform(get(EVENT_API + "/listar")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON))
                // 3. Verificar
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))) // Esperamos los 2 eventos guardados
                .andExpect(jsonPath("$[0].nombre", is("Feria Artesanal")));
    }

    @Test
    void testBuscarPorNombre_Success() throws Exception {
        // 1. Eventos guardados: "Feria Artesanal" y "Festival de Música"

        // 2. Ejecutar GET a /api/eventos/buscar?nombre=FESTIVAL
        // Se prueba que la búsqueda es insensible a mayúsculas/minúsculas
        mockMvc.perform(get(EVENT_API + "/buscar")
                        .header("Authorization", "Bearer " + validToken)
                        .param("nombre", "FESTIVAL")
                        .contentType(MediaType.APPLICATION_JSON))
                // 3. Verificar
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))) // Solo debe devolver el "Festival de Música"
                .andExpect(jsonPath("$[0].nombre", is("Festival de Música")));
    }

    @Test
    void testFiltrarBaratos_Success() throws Exception {
        // 1. Eventos guardados: 1500.0 y 5000.0

        // 2. Ejecutar GET a /api/eventos/baratos?precio=2000
        // Se prueba findByPrecioLessThan(2000)
        mockMvc.perform(get(EVENT_API + "/baratos")
                        .header("Authorization", "Bearer " + validToken)
                        .param("precio", "2000.0")
                        .contentType(MediaType.APPLICATION_JSON))
                // 3. Verificar
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1))) // Solo el de 1500.0 debería pasar
                .andExpect(jsonPath("$[0].nombre", is("Feria Artesanal")));
    }

    @Test
    void testListarProximosEventos_Success() throws Exception {
        // 1. Guardamos un evento que ya pasó (para el setup del test)
        Evento eventoPasado = Evento.builder()
                .nombre("Evento Pasado")
                .precio(10.0)
                .horario(LocalDateTime.now().minusDays(1)) // Hace 1 día
                .latitud(1.0).longitud(1.0)
                .build();
        eventoRepository.save(eventoPasado); // Total: 3 eventos (2 futuros, 1 pasado)

        // 2. Ejecutar GET a /api/eventos/proximos
        // Se prueba findByHorarioAfter(ahora)
        mockMvc.perform(get(EVENT_API + "/proximos")
                        .header("Authorization", "Bearer " + validToken)
                        .contentType(MediaType.APPLICATION_JSON))
                // 3. Verificar
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2))) // Solo deben volver los 2 eventos futuros del setup
                .andExpect(jsonPath("$[0].nombre", is("Feria Artesanal")));
    }

    // TEST DE SEGURIDAD 

    @Test
    void testGuardarEvento_NoToken_Forbidden() throws Exception {
        // Intenta guardar un evento sin enviar el token JWT
        Evento nuevoEvento = Evento.builder()
                .nombre("Intruso")
                .precio(1.0)
                .horario(LocalDateTime.now())
                .latitud(1.0)
                .longitud(1.0)
                .build();

        mockMvc.perform(post(EVENT_API + "/guardar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nuevoEvento)))
                // Verifica que la seguridad rechace la petición
                .andExpect(status().isForbidden()); // 403 Forbidden (por la configuración de SecurityConfig)
    }
}
