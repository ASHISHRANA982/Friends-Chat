package com.chartapp.chartapp.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class GetSecurityId {


    private final JwtAuth jwtAuth;

    public GetSecurityId(JwtAuth jwtAuth) {
        this.jwtAuth = jwtAuth;
    }

    public int SecurityIdChecker(HttpServletRequest request){

        String header=request.getHeader("Authorization");
        if(header==null || !header.startsWith("Bearer")){
            throw new RuntimeException("Missing or invalid Authorization header");
        }

        String token=header.substring(7);
        Claims claims= jwtAuth.getId(token);
        return (Integer) claims.get("id");
    }


}
