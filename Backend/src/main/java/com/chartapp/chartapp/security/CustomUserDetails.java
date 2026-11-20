package com.chartapp.chartapp.security;

import com.chartapp.chartapp.entity.UserLogin;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;


public class CustomUserDetails implements UserDetails {

    private final UserLogin userLogin;

    public CustomUserDetails(UserLogin userLogin) {
        this.userLogin = userLogin;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(userLogin.getRole()));
    }

    @Override
    public String getPassword() {
        return userLogin.getPassword();
    }

    public Integer getId(){
        return userLogin.getUser().getId();
    }


    @Override
    public String getUsername() {
        return userLogin.getUsername();
    }
}
