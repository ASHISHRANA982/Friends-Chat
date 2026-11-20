package com.chartapp.chartapp.service;


import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.exception.InvalidCredentials;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.repository.UserLoginRepo;
import com.chartapp.chartapp.repository.UserRepo;
import com.chartapp.chartapp.security.JwtTokenGenerator;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;


@Service
public class UserLoginService {

    private final UserLoginRepo userLoginRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserRepo userRepo;
    private final JwtTokenGenerator jwtTokenGenerator;

    public UserLoginService(UserLoginRepo userLoginRepo, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, UserRepo userRepo, JwtTokenGenerator jwtTokenGenerator) {
        this.userLoginRepo = userLoginRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userRepo = userRepo;
        this.jwtTokenGenerator = jwtTokenGenerator;
    }

    public ResponseCookie LoginUser(UserLogin userLogin, String expectedRole) {

        try {
            Authentication authenticationRequest =
                     UsernamePasswordAuthenticationToken.unauthenticated(
                            userLogin.getUsername(),
                            userLogin.getPassword()
                    );

            Authentication authentication=authenticationManager.authenticate(authenticationRequest);

            UserLogin userLogin1 =
                    userLoginRepo.findByUsername(userLogin.getUsername())
                            .orElseThrow(()->new UserNotFound("User Not Found Verify Username"));



            if (!userLogin1.getUser().getStatus().equalsIgnoreCase("Active")) {
                throw new UserNotFound(
                        "Your Account Is Not Active"
                );
            }
            if (!userLogin1.getRole().equalsIgnoreCase(expectedRole)) {
                throw new UserNotFound(
                        "Access denied! You are not authorized to login as "
                                + expectedRole
                );
            }

           String token= jwtTokenGenerator.generateRefreshToken(authentication);

            ResponseCookie cookie=ResponseCookie
                    .from("Refresh_Token",token)
                    .secure(true)
                    .httpOnly(true)
                    .sameSite("none")
                    .maxAge(Duration.ofDays(4))
                    .path("/")
                    .build();
                return cookie;

        } catch (BadCredentialsException | UsernameNotFoundException e) {

            throw new InvalidCredentials(
                    "Invalid username and password"
            );
        }
    }


    public String forgetPassword(String username,String newPassword){
        UserLogin userLogin=userLoginRepo.findByUsername(username)
                .orElseThrow(()-> new UserNotFound("Invalid Username Please Validate Again"));


        userLogin.setPassword(passwordEncoder.encode(newPassword));

        userLoginRepo.save(userLogin);

        return "User Password Update Successfully";

    }

}
