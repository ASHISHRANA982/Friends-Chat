package com.chartapp.chartapp.dto.response;

import java.time.LocalDateTime;

public record ConversationResponse(
        int id,
        int senderId,
        int receiverId,
        String content,
        LocalDateTime localDateTime,
        String messageShow
) {}

//   {
//           "id": 1,
//           "content": "hii\n",
//           "localDateTime": "2026-08-29T00:37:21",
//           "messageShow": "Enabled",
//           "sender": {
//           "id": 5,
//           "name": "Subha",
//           "phoneNo": "9827782201",
//           "email": "subha@gmail.com",
//           "profileImage": null,
//           "profileTag": null,
//           "status": "ACTIVE",
//           "userLogin": {
//           "id": 5,
//           "username": "Subha123",
//           "password": "$2a$10$W/P/3Sv2yW0sd4FFJthRXuweXwnaSu3dE0asdeLSJLGJmiYNe74Tm",
//           "role": "USER"
//           }
//           },
//           "receiver": {
//           "id": 1,
//           "name": "Ashish Rana",
//           "phoneNo": "9938629863",
//           "email": "ashish@gmail.com",
//           "profileImage": null,
//           "profileTag": null,
//           "status": "ACTIVE",
//           "userLogin": {
//           "id": 1,
//           "username": "AshisRana",
//           "password": "$2a$10$aJmRAG1KQIr/osc2H/CUR.BhEn5B943KQ7GOy03FPdBRYA4Ep3qHi",
//           "role": "USER"
//           }
//           }
//           },