package WITW.demo.User;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

class UserTest {

    @Test
    void getAuthorities_returnsRoleAsAuthority() {
        User user = User.builder()
                .username("testuser")
                .password("secret")
                .role(Role.USER)
                .build();

        assertEquals(1, user.getAuthorities().size());
        assertTrue(user.getAuthorities().contains(new SimpleGrantedAuthority("USER")));
    }

    @Test
    void userBuilder_setsAllFieldsCorrectly() {
        User user = User.builder()
                .id(1)
                .username("testuser")
                .firstname("John")
                .lastname("Doe")
                .country("Chile")
                .password("secret")
                .role(Role.USER)
                .build();

        assertEquals(1, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("John", user.getFirstname());
        assertEquals("Doe", user.getLastname());
        assertEquals("Chile", user.getCountry());
        assertEquals("secret", user.getPassword());
        assertEquals(Role.USER, user.getRole());
    }
}
