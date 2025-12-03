package WITW.demo.Events;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import WITW.demo.Jwt.JwtService; 

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EventoController.class)

@AutoConfigureMockMvc(addFilters = false)
public class EventoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventoRepository eventoRepository;


    @MockBean private JwtService jwtService; 

    @Autowired
    private ObjectMapper objectMapper;

    // PRUEBA 1: Verificar que guarda correctamente
    @Test
    public void guardarEvento_DeberiaRetornar200_CuandoDatosSonValidos() throws Exception {
        Evento evento = Evento.builder()
                .nombre("Concierto Rock")
                .precio(10000.0)
                .horario(LocalDateTime.now())
                .latitud(-38.73)
                .longitud(-72.59)
                .build();
        
        // Simulamos que el repositorio devuelve el evento (incluyendo un ID simulado)
        Evento eventoGuardado = Evento.builder()
                .id(1L) // Simulamos que la BD le asignó ID 1
                .nombre("Concierto Rock")
                .precio(10000.0)
                .horario(evento.getHorario())
                .latitud(-38.73)
                .longitud(-72.59)
                .build();

        when(eventoRepository.save(any(Evento.class))).thenReturn(eventoGuardado);

        mockMvc.perform(post("/api/eventos/guardar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(evento)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Concierto Rock"))
                .andExpect(jsonPath("$.id").value(1)); // Verificamos que devuelve el ID
    }

    // PRUEBA 2: Verificar la validación (Status 400)
    @Test
    public void guardarEvento_DeberiaRetornar400_CuandoFaltaLatitud() throws Exception {
        Evento eventoInvalido = Evento.builder()
                .nombre("Evento Fantasma")
                .precio(0.0)
                .horario(LocalDateTime.now())
                // .latitud(...)  <-- NO LO PONEMOS para forzar el error
                .longitud(-72.59)
                .build();

        mockMvc.perform(post("/api/eventos/guardar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(eventoInvalido)))
                .andExpect(status().isBadRequest()); // Esperamos 400 Bad Request
    }
}