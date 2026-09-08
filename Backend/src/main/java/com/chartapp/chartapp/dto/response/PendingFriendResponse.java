package com.chartapp.chartapp.dto.response;

public record PendingFriendResponse(
        int id,
        int Fid,
        String name,
        String phoneNo,
        String email,
        String profileImage,
        String profileTag,
        String friendNickName,
        String status
) {}

