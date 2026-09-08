package com.chartapp.chartapp.security;

import com.chartapp.chartapp.entity.UserLogin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAuth {

        @Value("${jwt.secretKey:NOT_FOUND}")
        private String secretKey;

        private SecretKey getSecretKey(){
            return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        }

        public String generateUserAccessToken(UserLogin login){

            Map<String, Object> claims = new HashMap<>();
            if ("USER".equalsIgnoreCase(login.getRole()) ) {
                claims.put("id", login.getId());
            }
            else {
                claims.put("id", login.getId());
            }
            claims.put("username", login.getUsername());
            claims.put("role", login.getRole());

            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(login.getUsername())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis()+1000*60*60*24*7))
                    .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                    .compact();
        }


    public String getUsernameFromToken(String token){
            return Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }

        public Claims getId(String token){
            return Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }

        public boolean validateToken(String token, UserDetails userDetails) {
            try {
                String username = getUsernameFromToken(token);
                return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
            } catch (JwtException e) {
                return false;
            }
        }

        public Date getExpiryDate(String token){
            return Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
        }

        private boolean isTokenExpired(String token) {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        }
}
