package com.chartapp.chartapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;


public class CsrfCookieFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        String method = request.getMethod();
        boolean safe = method.equals("GET") || method.equals("HEAD")
                || method.equals("OPTIONS") || method.equals("TRACE");
        String path = request.getRequestURI();
        boolean ignored = path.equals("/user/register/createUser") || path.equals("/user/register/loginUser")
            || path.startsWith("/chat/**") || path.equals("/contact/saveContact") || path.equals("/api/health");

        if (!safe && !ignored) {
            String cookieToken = null;
            if (request.getCookies() != null) {
                for (Cookie c : request.getCookies()) {
                    if ("XSRF-TOKEN".equals(c.getName())) cookieToken = c.getValue();
                }
            }
            String headerToken = request.getHeader("X-XSRF-TOKEN");

            if (cookieToken == null || headerToken == null
                    || !MessageDigest.isEqual(
                    cookieToken.getBytes(StandardCharsets.UTF_8),
                    headerToken.getBytes(StandardCharsets.UTF_8))) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF token");
                return;
            }
        }
        filterChain.doFilter(request, response);

    }
}
