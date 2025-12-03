package com.WITW.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactiva protección CSRF para facilitar pruebas
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // <--- ESTA ES LA CLAVE: Permite todo
            );
        return http.build();
    }
}