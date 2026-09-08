package com.chartapp.chartapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AcceptedFriendRequest(
        @NotBlank(message = "Phone Number Is Required")
        @Pattern(
                regexp = "^[6-9]\\d{9}$",
                message = "Invalid Phone Number"
        )
        String phoneNo,
        @NotBlank(message = "Name Is Required")
        String name,
        @NotBlank(message = "Status Required")
        @Pattern(
                regexp = "ACCEPTED|REJECTED",
                message = "Status must be ACCEPTED/REJECTED"
        )
        String status
) {}
