package WITW.demo.External;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.hamcrest.Matchers.containsString;


@SpringBootTest
public class OpenStreetMapServiceIntegrationTest {

    // ----------------------------------------------------
    // SOLUCIÓN: Configuración para el Contexto de Spring Test
    // ----------------------------------------------------
    @TestConfiguration
    static class RestTemplateTestConfig {

        // 1. Define el RestTemplate que será el objeto mockeable (el que MockRestServiceServer controlará).
        @Bean
        public RestTemplate mockableRestTemplate() {
            return new RestTemplate();
        }

        // 2. Define el RestTemplateBuilder como un MOCK bean que reemplaza al real.
        // Esto se ejecuta al cargar el contexto.
        @Bean
        public RestTemplateBuilder restTemplateBuilder(@Autowired RestTemplate mockableRestTemplate) {

            // Creamos un Mock de RestTemplateBuilder
            RestTemplateBuilder builderMock = mock(RestTemplateBuilder.class);

            // Configuramos la cadena de métodos para que devuelva el mismo MockBuilder (self-chaining)
            // ESTO SOLUCIONA el NullPointerException durante la carga del contexto.
            when(builderMock.setConnectTimeout(any(Duration.class))).thenReturn(builderMock);
            when(builderMock.setReadTimeout(any(Duration.class))).thenReturn(builderMock);
            when(builderMock.defaultHeader(anyString(), any(String[].class))).thenReturn(builderMock);

            // Configuramos la llamada final .build() para que devuelva el RestTemplate que podemos mockear.
            when(builderMock.build()).thenReturn(mockableRestTemplate);

            return builderMock;
        }
    }
    // ----------------------------------------------------

    // Inyectamos el servicio real (que ahora usa el builder mockeado)
    @Autowired
    private OpenStreetMapService osmService;

    // Inyectamos el RestTemplate controlado (para configurar el mockServer)
    @Autowired
    private RestTemplate mockableRestTemplate;

    private MockRestServiceServer mockServer;

    private final double LAT = 34.0522;
    private final double LON = -118.2437;
    // Usamos una coincidencia parcial para evitar fallos por precisión de decimales en la URL
    private final String EXPECTED_URL_MATCH = String.format("lat=%s&lon=%s", LAT, LON).substring(0, 15);


    @BeforeEach
    void setup() {
        // Inicializamos el MockServer con el RestTemplate que el servicio está usando (gracias al mock builder)
        this.mockServer = MockRestServiceServer.createServer(this.mockableRestTemplate);
    }

    // ----------------------- 1. Prueba de Éxito y Parseo de JSON -----------------------

    @Test
    void testObtenerDireccion_Success() {
        String jsonResponse = """
            {
                "place_id": 12345,
                "display_name": "Calle Falsa 123, Springfield"
            }
            """;

        mockServer.expect(requestTo(containsString(EXPECTED_URL_MATCH)))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        String resultado = osmService.obtenerDireccion(LAT, LON);

        assertEquals("Calle Falsa 123, Springfield", resultado,
                "Debe devolver la dirección parseada del JSON.");
        mockServer.verify();
    }

    // ----------------------- 2. Prueba de Manejo de Errores de Conexión -----------------------

    @Test
    void testObtenerDireccion_RestClientException() {
        mockServer.expect(requestTo(containsString(EXPECTED_URL_MATCH)))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.INTERNAL_SERVER_ERROR));

        String resultado = osmService.obtenerDireccion(LAT, LON);

        assertEquals("Sin dirección (Error API)", resultado,
                "Debe devolver el mensaje de error del API.");
        mockServer.verify();
    }

    // ----------------------- 3. Prueba de Dirección No Encontrada (Respuesta NULL) -----------------------

    @Test
    void testObtenerDireccion_NotFound() {
        // Simulamos que la llamada a la API devuelve NULL (ej. con código 204 No Content)
        mockServer.expect(requestTo(containsString(EXPECTED_URL_MATCH)))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withStatus(HttpStatus.NO_CONTENT));

        String resultado = osmService.obtenerDireccion(LAT, LON);

        // Tu lógica devuelve "Dirección no encontrada" si la respuesta es NULL
        assertEquals("Dirección no encontrada", resultado,
                "Debe devolver 'Dirección no encontrada' si la respuesta es nula.");

        mockServer.verify();
    }
}