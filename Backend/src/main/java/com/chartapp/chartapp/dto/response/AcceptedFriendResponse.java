package com.chartapp.chartapp.dto.response;

public record AcceptedFriendResponse(
        int id,
        int Fid,
        String name,
        String phoneNo,
        String profileImage,
        String profileTag,
        String contactName,
        String status
) {}

