package com.chartapp.chartapp.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateProfileRequest(
        @NotBlank(message = "Name Required")
        String name,
        @Email(message = "Invalid Email")
        @NotBlank(message = "Email Required")
        @Pattern(
                regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$",
                message = "Only Gmail addresses are allowed"
        )
        String email,
        @NotBlank(message = "Profile Tag Required")
        String profileTag,
        String imageUrl
) {}
