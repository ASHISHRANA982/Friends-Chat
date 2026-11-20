package com.chartapp.chartapp.security;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Component
public class GetSecurityId {


    private final JwtDecoder jwtDecoder;

    public GetSecurityId(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    public Integer SecurityIdChecker(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();
        String token = null;

        if (cookies == null) {
            throw new RuntimeException("Authentication token not found");
        }


        for (Cookie cookie : cookies) {
            if ("Refresh_Token".equals(cookie.getName())) {
                token = cookie.getValue();
                break;
            }
        }

        if (token == null || token.isBlank()) {
            throw new RuntimeException("Refresh token not found");
        }


        Jwt jwt=jwtDecoder.decode(token);
        Number id=jwt.getClaim("id");
        if (id == null) {
            throw new RuntimeException("User id missing in token");
        }
        return id.intValue();
    }


}
