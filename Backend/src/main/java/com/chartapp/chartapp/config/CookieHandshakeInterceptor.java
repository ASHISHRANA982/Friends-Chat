package com.chartapp.chartapp.config;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class CookieHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        HttpServletRequest req = servletRequest.getServletRequest();

        String jwtToken = null;
        String csrfToken = null;

        Cookie[] cookies = req.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {

                if ("Refresh_Token".equals(cookie.getName())) {
                    jwtToken = cookie.getValue();
                }

                if ("XSRF-TOKEN".equals(cookie.getName())) {
                    csrfToken = cookie.getValue();
                }
            }
        }

        if (jwtToken == null || jwtToken.isBlank()) {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        if (csrfToken == null || csrfToken.isBlank()) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return false;
        }

        attributes.put("token", jwtToken);
        attributes.put("csrfToken", csrfToken);

        return true;
    }


    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }
}
