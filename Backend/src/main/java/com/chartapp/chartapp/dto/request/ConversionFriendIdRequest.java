package com.chartapp.chartapp.dto.request;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ConversionFriendIdRequest(
        @NotNull(message = "Select Your Friend First")
        @Positive
        Integer friendId
) {}
