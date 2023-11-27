package com.wbr.meditatii.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Profile("dev")
    @Bean
    public WebMvcConfigurer corsConfigurerDev() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }

    @Profile("prod")
    @Bean
    public WebMvcConfigurer corsConfigurerProd() {
        return new WebMvcConfigurer() {
            /*@todo
            sensitive endpoints that should not be exposed to the
            frontend or public internet, you'll need to protect them
            using appropriate security measures beyond CORS,
            such as OAuth, API keys, or other authentication mechanisms.*/
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("https://www.meditatiianunturi.ro/")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("Content-Type", "Authorization");
            }
        };
    }
}
