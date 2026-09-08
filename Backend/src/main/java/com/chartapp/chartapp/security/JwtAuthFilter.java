package com.chartapp.chartapp.security;

import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.repository.UserLoginRepo;
import com.chartapp.chartapp.repository.UserLogoutRepo;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtAuth jwtAuth;
    private final UserDetailsService userDetailsService;
    private final UserLogoutRepo logoutRepo;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final UserLoginRepo userLoginRepo;

    public JwtAuthFilter(
            @Lazy UserDetailsService userDetailsService,
            JwtAuth jwtAuth,
            UserLogoutRepo logoutRepo,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,UserLoginRepo userLoginRepo) {

        this.userDetailsService = userDetailsService;
        this.jwtAuth = jwtAuth;
        this.logoutRepo = logoutRepo;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.userLoginRepo=userLoginRepo;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.equals("/user/register/loginUser") ||
                path.equals("/user/register/createUser")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            String authHeader = request.getHeader("Authorization");

            String token = null;
            String username = null;
            if (authHeader != null &&
                    authHeader.startsWith("Bearer ")) {

                token = authHeader.substring(7);

                if (logoutRepo.existsByToken(token)) {
                    throw new JwtException(
                            "Session expired. Please login again"
                    );
                }

                username = jwtAuth.getUsernameFromToken(token);
            }

            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                if (jwtAuth.validateToken(token, userDetails)) {

                    UserLogin userLogin=userLoginRepo.findByUsername(username).orElseThrow(
                            ()->new UserNotFound("User Not Found Login Again")
                    );

//                    System.out.println("Filter Calling");
//                    System.out.println(userLogin.getUser().getStatus());
//                    System.out.println(userLogin.getUser().getId());


                    if (!"Active".equalsIgnoreCase(userLogin.getUser().getStatus())) {
                        throw new JwtException("Your Account Is Not Active");
                    }


                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authToken);

                } else {

                    throw new JwtException(
                            "Token validation failed"
                    );
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException ex) {

            SecurityContextHolder.clearContext();

            jwtAuthenticationEntryPoint.commence(
                    request,
                    response,
                    new BadCredentialsException(
                            "Token expired"
                    )
            );

        } catch (JwtException ex) {

            SecurityContextHolder.clearContext();

            jwtAuthenticationEntryPoint.commence(
                    request,
                    response,
                    new BadCredentialsException(
                            "Your login session is invalid. Please login again"
                    )
            );
        }
    }
}
