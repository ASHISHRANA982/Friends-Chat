package com.chartapp.chartapp.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class JwtTokenGenerator {

    @Value("${jwt.secretKey:NOT_FOUND}")
    private String secretKey;
    private final JwtEncoder jwtEncoder;




    public JwtTokenGenerator(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateRefreshToken(Authentication authentication){

        System.out.println(secretKey);

        JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal(); // your UserDetails class


        Instant now =Instant.now();

        List<String>authority=
                authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).toList();

        JwtClaimsSet jwtClaimsSet=JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(now.plus(4, ChronoUnit.DAYS))
                .claim(
                        "authorities",
                        authority
                )
                .claim("id",principal.getId())
                .subject(principal.getUsername())
                .build();

        Jwt jwt=jwtEncoder.encode(
                JwtEncoderParameters.from(jwsHeader,jwtClaimsSet)
        );
        return jwt.getTokenValue();

    }

}
