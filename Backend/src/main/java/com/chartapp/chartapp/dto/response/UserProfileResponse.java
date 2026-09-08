package com.chartapp.chartapp.dto.response;

public record UserProfileResponse(
        int id,
        String name,
        String phoneNo,
        String email,
        String profileImage,
        String profileTag,
        String status
) {}
