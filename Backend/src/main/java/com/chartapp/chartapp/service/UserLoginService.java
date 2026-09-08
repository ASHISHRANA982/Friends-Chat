package com.chartapp.chartapp.service;

import com.chartapp.chartapp.entity.User;
import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.exception.InvalidCredentials;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.repository.UserLoginRepo;
import com.chartapp.chartapp.repository.UserRepo;
import com.chartapp.chartapp.security.JwtAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserLoginService {

    private final UserLoginRepo userLoginRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtAuth jwtAuth;
    private final UserRepo userRepo;

    public UserLoginService(UserLoginRepo userLoginRepo, PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager, JwtAuth jwtAuth,
                            UserRepo userRepo) {
        this.userLoginRepo = userLoginRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtAuth = jwtAuth;
        this.userRepo = userRepo;
    }

    public String LoginUser(UserLogin userLogin, String expectedRole) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userLogin.getUsername(),
                            userLogin.getPassword()
                    )
            );
            UserLogin userLogin1 =
                    userLoginRepo.findByUsername(userLogin.getUsername())
                            .orElseThrow(()->new UserNotFound("User Not Found Verify Username"));


//            User user = userRepo.findById(userLogin1.getUser().getId())
//                    .orElseThrow(
//                            () -> new UserNotFound("User Not Found")
//                    );

            System.out.println("User Login Object Status:"+userLogin1.getUser().getStatus());
            System.out.println("User Login Object Id:"+userLogin1.getUser().getId());

//            System.out.println("User Object Status:"+user.getStatus());
//            System.out.println("User Object Id:"+user.getId());


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

            return jwtAuth.generateUserAccessToken(userLogin1);

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
