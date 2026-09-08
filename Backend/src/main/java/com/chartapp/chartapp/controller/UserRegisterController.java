package com.chartapp.chartapp.controller;

import com.chartapp.chartapp.entity.User;
import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.entity.UserLogout;
import com.chartapp.chartapp.exception.SuccessClass;
import com.chartapp.chartapp.dto.request.CreateNewUserRequest;
import com.chartapp.chartapp.dto.request.ForgetPasswordRequest;
import com.chartapp.chartapp.repository.UserLogoutRepo;
import com.chartapp.chartapp.security.JwtAuth;
import com.chartapp.chartapp.service.UserLoginService;
import com.chartapp.chartapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user/register")
@Validated
public class UserRegisterController {

    private final UserService userService;
    private final UserLoginService userLoginService;
    private final JwtAuth jwtAuth;
    private final UserLogoutRepo userLogoutRepo;



    public UserRegisterController(UserService userService, UserLoginService userLoginService,
                          JwtAuth jwtAuth,
                          UserLogoutRepo userLogoutRepo) {
        this.userService = userService;
        this.userLoginService = userLoginService;
        this.jwtAuth = jwtAuth;
        this.userLogoutRepo = userLogoutRepo;
    }

    @PostMapping("/createUser")
    public ResponseEntity<SuccessClass> CreateUser(@Valid @RequestBody CreateNewUserRequest createNewUserRequest){

        User user= userService.createUser(createNewUserRequest.user(), createNewUserRequest.userLogin());
       return ResponseEntity.ok(
               SuccessClass.success("User Account Created Successfully",null)
       );
    }

    @PostMapping("/loginUser")
    public ResponseEntity<SuccessClass>LoginUser(@Valid @RequestBody UserLogin userLogin){
        String token= userLoginService.LoginUser(userLogin,"USER");
        return ResponseEntity.ok(
                SuccessClass.success("User Login Successful",token)
        );
    }

    @PutMapping("/forgetPassword")
    public ResponseEntity<String>forgetPassword(@RequestBody ForgetPasswordRequest forgetPasswordRequest){

        String message=userLoginService.forgetPassword(forgetPasswordRequest.username(), forgetPasswordRequest.newPassword());
        return ResponseEntity.ok(message);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/logoutUser")
    public ResponseEntity<SuccessClass> logoutUser(
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            UserLogout userLogout = new UserLogout(
                    token,
                    jwtAuth.getExpiryDate(token)
            );

            userLogoutRepo.save(userLogout);

            SecurityContextHolder.clearContext();   // Add this

            return ResponseEntity.ok(
                    SuccessClass.success("User Logout Successful",null)
            );
        }

        throw new BadCredentialsException("Token Not Found");
    }


}
