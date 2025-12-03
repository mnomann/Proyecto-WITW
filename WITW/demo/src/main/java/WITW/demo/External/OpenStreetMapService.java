package WITW.demo.External;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import java.time.Duration;
import org.springframework.boot.web.client.RestTemplateBuilder;

@Service
public class OpenStreetMapService {

    private final RestTemplate restTemplate;

    // Configuración de TIMEOUTS 
    public OpenStreetMapService(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(2)) // 2 seg para conectar
                .setReadTimeout(Duration.ofSeconds(2))    // 2 seg para leer respuesta
                .build();
    }

    public String obtenerDireccion(double lat, double lon) {
        String url = String.format("https://nominatim.openstreetmap.org/reverse?format=json&lat=%s&lon=%s", lat, lon);

        try {
            // LLAMADA REAL A LA API
            NominatimResponse respuesta = restTemplate.getForObject(url, NominatimResponse.class);
            return (respuesta != null) ? respuesta.getDisplay_name() : "Dirección no encontrada";
            
        } catch (RestClientException e) {
            // MANEJO DE ERRORES 
            System.err.println("Error llamando a API Externa: " + e.getMessage());
            return "Sin dirección (Error API)";
        }
    }
}