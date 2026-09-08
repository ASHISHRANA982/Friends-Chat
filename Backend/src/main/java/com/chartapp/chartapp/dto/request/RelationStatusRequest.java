package com.chartapp.chartapp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record RelationStatusRequest(
        @NotNull(message = "Friend ID is required")
        @Positive(message = "Invalid Friend ID")
        Integer friendId,

        @NotBlank(message = "Status is required")
        @Pattern(
                regexp = "CONNECTED|BLOCKED",
                message = "Status Must Be BLOCKED Or CONNECTED"
        )
        String status
) {}
