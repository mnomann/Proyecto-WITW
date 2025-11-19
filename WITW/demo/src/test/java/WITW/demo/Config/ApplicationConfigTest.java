package WITW.demo.Config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import WITW.demo.User.User;
import WITW.demo.User.UserRepository;

@ExtendWith(MockitoExtension.class)
class ApplicationConfigTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ApplicationConfig applicationConfig;

    @Test
    void userDetailsService_returnsUser_whenUserExists() {
        // Arrange
        User mockUser = User.builder()
                .username("testuser")
                .password("encoded")
                .build();

        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(mockUser));

        // Act
        UserDetails result = applicationConfig.userDetailService()
                .loadUserByUsername("testuser");

        // Assert
        assertEquals("testuser", result.getUsername());
        assertEquals("encoded", result.getPassword());
    }

    @Test
    void userDetailsService_throwsException_whenUserDoesNotExist() {
        // Arrange
        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            UsernameNotFoundException.class,
            () -> applicationConfig.userDetailService().loadUserByUsername("unknown")
        );
    }

}
