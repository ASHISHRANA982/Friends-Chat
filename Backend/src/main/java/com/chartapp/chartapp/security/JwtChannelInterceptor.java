package com.chartapp.chartapp.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.messaging.support.MessageBuilder;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtAuth jwtAuth;
    private final UserDetailsService userDetailsService;

    public JwtChannelInterceptor(
            JwtAuth jwtAuth,
            UserDetailsService userDetailsService) {

        this.jwtAuth = jwtAuth;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())
                || StompCommand.SEND.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new MessageDeliveryException("Token Not Found");
            }

            String token = authHeader.substring(7);

            try {

                String username = jwtAuth.getUsernameFromToken(token);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                if (!jwtAuth.validateToken(token, userDetails)) {
                    throw new MessageDeliveryException(
                            "Invalid or expired token"
                    );
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                userDetails.getAuthorities()
                        );

                accessor.setUser(authentication);

                System.out.println(
                        "WebSocket User = " +
                                accessor.getUser().getName()
                );

            } catch (ExpiredJwtException e) {

                throw new MessageDeliveryException(
                        "Your session has expired. Please login again"
                );

            } catch (JwtException e) {

                throw new MessageDeliveryException(
                        "Your login session is invalid. Please login again"
                );

            } catch (UsernameNotFoundException e) {

                throw new MessageDeliveryException(
                        "User account not found. Please login again"
                );
            }
        }

        return MessageBuilder.createMessage(
                message.getPayload(),
                accessor.getMessageHeaders()
        );
    }
}
