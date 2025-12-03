package WITW.demo.Events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {


    List<Evento> findByNombreContainingIgnoreCase(String nombre);


    List<Evento> findByPrecioLessThan(Double precioMaximo);


    List<Evento> findByHorarioAfter(LocalDateTime fechaActual);
}