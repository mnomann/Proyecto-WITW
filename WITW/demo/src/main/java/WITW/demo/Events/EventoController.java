package WITW.demo.Events;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoRepository eventoRepository;

    @PostMapping("/guardar")

    public ResponseEntity<?> guardarEvento(@Valid @RequestBody Evento evento, BindingResult result) {
        
        if (result.hasErrors()) {
            return ResponseEntity
                    .badRequest()
                    .body("Error de validación: " + result.getFieldError().getDefaultMessage());
        }
        
        //nuevo: Llamada a la API para obtener la dirección basada en las coordenadas
        String direccion = openStreetMapService.obtenerDireccion(evento.getLatitud(), evento.getLongitud());
        evento.setDireccion(direccion);

        Evento nuevoEvento = eventoRepository.save(evento);
        return ResponseEntity.ok(nuevoEvento);
    }

    @GetMapping("/listar")
    public List<Evento> listarEventos() {
        return eventoRepository.findAll();
    }

    //-------------------- PROBANDO consultas personalizadas --------------------

    // Uso: GET /api/eventos/buscar?nombre=feria
    @GetMapping("/buscar")
    public List<Evento> buscarPorNombre(@RequestParam String nombre) {
        return eventoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // Uso: GET /api/eventos/baratos?precio=5000
    @GetMapping("/baratos")
    public List<Evento> filtrarBaratos(@RequestParam Double precio) {
        return eventoRepository.findByPrecioLessThan(precio);
    }

    // Uso: GET /api/eventos/proximos
    @GetMapping("/proximos")
    public List<Evento> listarProximosEventos() {
        LocalDateTime ahora = LocalDateTime.now();
        return eventoRepository.findByHorarioAfter(ahora);
    }
}