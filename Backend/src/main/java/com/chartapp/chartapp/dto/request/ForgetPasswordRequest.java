package com.chartapp.chartapp.dto.request;

public record ForgetPasswordRequest(
        String username,
        String newPassword
) {}
