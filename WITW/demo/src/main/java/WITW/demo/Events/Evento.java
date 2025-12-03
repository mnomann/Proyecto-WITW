package WITW.demo.Events;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "eventos")
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio") 
    @Column(nullable = false)
    private String nombre;

    @NotNull(message = "El precio es obligatorio")
    private Double precio;

    private LocalDateTime horario;

    // Coordenadas para el mapa
    @NotNull(message = "La latitud es obligatoria")
    @Column(nullable = false)
    private Double latitud;

    @NotNull(message = "La longitud es obligatoria")
    @Column(nullable = false)
    private Double longitud;

    // Dirección del evento API
    private String direccion;
}