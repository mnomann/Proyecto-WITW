package WITW.demo.External;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // Ignora campos que no nos interesen
public class NominatimResponse {
    private String display_name; // Nominatim devuelve la dirección aquí
}