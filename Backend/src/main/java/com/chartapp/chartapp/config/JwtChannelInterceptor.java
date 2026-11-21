
package com.chartapp.chartapp.config;

import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.repository.UserLoginRepo;
import com.chartapp.chartapp.repository.UserLogoutRepo;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtDecoder jwtDecoder;
    private final JwtAuthenticationConverter converter;
    private final UserLogoutRepo logoutRepo;
    private final UserLoginRepo userLoginRepo;

    public JwtChannelInterceptor(
            JwtDecoder jwtDecoder,
            JwtAuthenticationConverter converter,
            UserLogoutRepo logoutRepo,
            UserLoginRepo userLoginRepo) {

        this.jwtDecoder = jwtDecoder;
        this.converter = converter;
        this.logoutRepo = logoutRepo;
        this.userLoginRepo = userLoginRepo;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message, StompHeaderAccessor.class
                );

        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        StompCommand cmd = accessor.getCommand();

        if (cmd == StompCommand.CONNECT) {

            Map<String, Object> session = accessor.getSessionAttributes();

            String cookieCsrfToken = session == null
                    ? null
                    : (String) session.get("csrfToken");

            String headerCsrfToken =
                    accessor.getFirstNativeHeader("X-XSRF-TOKEN");

            if (cookieCsrfToken == null || headerCsrfToken == null ||
                    !MessageDigest.isEqual(
                            cookieCsrfToken.getBytes(StandardCharsets.UTF_8),
                            headerCsrfToken.getBytes(StandardCharsets.UTF_8))) {

                throw new MessagingException("Invalid CSRF token");
            }
        }

        if (cmd == StompCommand.DISCONNECT) {
            return message;
        }

        Map<String, Object> session = accessor.getSessionAttributes();

        String token = session == null
                ? null
                : (String) session.get("token");

        if (token == null || token.isBlank()) {
            throw new MessagingException("Not authenticated. Login first.");
        }

        try {

            if (logoutRepo.existsByToken(token)) {
                throw new MessagingException("Session expired. Please login again.");
            }

            Jwt jwt = jwtDecoder.decode(token);

            String username = jwt.getSubject();

            UserLogin userLogin = userLoginRepo.findByUsername(username)
                    .orElseThrow(() ->
                            new MessagingException("User not found")
                    );

            if (!"Active".equalsIgnoreCase(
                    userLogin.getUser().getStatus())) {

                throw new MessagingException(
                        "Your account is not active"
                );
            }

            accessor.setUser(converter.convert(jwt));

        } catch (JwtException ex) {

            throw new MessagingException("Invalid or expired token");
        }

        return message;
    }
}
