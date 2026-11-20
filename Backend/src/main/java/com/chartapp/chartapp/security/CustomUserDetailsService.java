package com.chartapp.chartapp.security;

import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.repository.UserLoginRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserLoginRepo userLoginRepo;

    public CustomUserDetailsService(UserLoginRepo userLoginRepo) {
        this.userLoginRepo = userLoginRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserLogin userLogin=userLoginRepo.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("User not found"));

        return new CustomUserDetails(userLogin);
    }
}
