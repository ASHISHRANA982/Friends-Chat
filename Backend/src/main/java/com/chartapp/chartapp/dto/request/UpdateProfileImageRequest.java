package com.chartapp.chartapp.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileImageRequest(
        @NotBlank(message = "Profile image is required")
        String image
) {}
