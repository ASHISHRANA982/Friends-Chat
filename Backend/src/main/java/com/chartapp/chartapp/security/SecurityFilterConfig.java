package com.chartapp.chartapp.security;

import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.DefaultBearerTokenResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)

public class SecurityFilterConfig {


    private final CustomUserDetailsService customUserDetailsService;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    public SecurityFilterConfig(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain EnableSecurity (HttpSecurity httpSecurity,BearerTokenResolver bearerTokenResolver) throws Exception {


        CsrfTokenRequestAttributeHandler handler=new CsrfTokenRequestAttributeHandler();
        handler.setCsrfRequestAttributeName(null);

        httpSecurity.
                cors(Customizer.withDefaults()).
                csrf(
                csrf->
                        csrf.csrfTokenRepository(csrfTokenRepository())
                                .csrfTokenRequestHandler(handler)
                                .ignoringRequestMatchers("/user/register/createUser","/user/register/loginUser",
                                        "/chat/","/chat/**","/contact/saveContact",
                                        "/api/health")
        )
                        .addFilterAfter(new CsrfCookieFilter(),BasicAuthenticationFilter.class);


        httpSecurity.authorizeHttpRequests(http->
            http.requestMatchers("/user/register/createUser","/user/register/loginUser",
                            "/chat/**","/contact/saveContact",
                            "/api/health"
                            )
                    .permitAll()
                    .anyRequest()
                    .authenticated()
        )
                .oauth2ResourceServer(oauth->
                        oauth.bearerTokenResolver(bearerTokenResolver)
                        .jwt(
                            jwt->
                                    jwt.jwtAuthenticationConverter(
                                            jwtAuthenticationConverter()
                                    )
                        ));


        return httpSecurity.build();
    }


    @Bean
    public CookieCsrfTokenRepository csrfTokenRepository() {

        CookieCsrfTokenRepository repository =
                CookieCsrfTokenRepository.withHttpOnlyFalse();

        repository.setCookieCustomizer(cookie -> cookie
                .sameSite("None")
                .secure(true)
                .httpOnly(false)
                .path("/")
        );

        return repository;
    }


    @Bean
    public BearerTokenResolver bearerTokenResolver() {

        DefaultBearerTokenResolver defaultResolver =
                new DefaultBearerTokenResolver();

        return request -> {
            Cookie[] cookies = request.getCookies();

            if (cookies != null) {

                for (Cookie cookie : cookies) {

                    if ("Refresh_Token".equals(cookie.getName())) {
                        return cookie.getValue();
                    }
                }
            }

            return defaultResolver.resolve(request);
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(
                Arrays.stream(allowedOrigins.split(","))
                        .map(String::trim)
                        .toList()
        );

        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );

        config.setAllowedHeaders(
                List.of(
                        "Content-Type",
                        "X-XSRF-TOKEN",
                        "Authorization",
                        "Accept"
                )
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter=new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("authorities");

        JwtAuthenticationConverter converter=new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return converter;
    }



}
