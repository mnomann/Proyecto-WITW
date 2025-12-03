package WITW.demo.Events;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.TestPropertySource;


import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
// 1. Esto asegura que usemos H2 (Base de datos en memoria)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
// 2. Sobreescribimos application.properties solo para este test
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    // Esta línea obliga a crear la tabla 'eventos' antes del test:
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class EventoRepositoryTest {

    @Autowired
    private EventoRepository eventoRepository;

    @Test
    public void deberiaGuardarYBuscarEvento() {
        // 1. DADO (Given)
        Evento evento = Evento.builder()
                .nombre("Feria Gastronómica")
                .precio(5000.0)
                .horario(LocalDateTime.now())
                .latitud(-38.73)
                .longitud(-72.59)
                .build();

        // 2. CUANDO (When)
        Evento guardado = eventoRepository.save(evento);

        // 3. ENTONCES (Then)
        assertThat(guardado).isNotNull();
        assertThat(guardado.getId()).isGreaterThan(0);
        
        // Imprimir para confirmar visualmente
        System.out.println("Evento guardado con ID: " + guardado.getId());
    }
}