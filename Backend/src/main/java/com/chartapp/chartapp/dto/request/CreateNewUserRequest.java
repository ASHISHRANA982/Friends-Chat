package com.chartapp.chartapp.dto.request;

import com.chartapp.chartapp.entity.User;
import com.chartapp.chartapp.entity.UserLogin;
import jakarta.validation.Valid;

public record CreateNewUserRequest(
        @Valid User user,
        @Valid UserLogin userLogin
) {}
