package com.chartapp.chartapp.controller;

import com.chartapp.chartapp.entity.Message;
import com.chartapp.chartapp.exception.SuccessClass;
import com.chartapp.chartapp.dto.response.ConversationResponse;
import com.chartapp.chartapp.dto.request.ConversionFriendIdRequest;
import com.chartapp.chartapp.dto.request.RelationStatusRequest;
import com.chartapp.chartapp.dto.response.UserQuickInfoResponse;
import com.chartapp.chartapp.security.GetSecurityId;
import com.chartapp.chartapp.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    private final MessageService messageService;
    private final GetSecurityId getSecurityId;

    public MessageController(MessageService messageService,GetSecurityId getSecurityId) {
        this.messageService = messageService;
        this.getSecurityId=getSecurityId;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/conversation")
    public ResponseEntity<SuccessClass> getConversation(@Valid  @RequestBody ConversionFriendIdRequest conversionFriendIdRequest,
                                                        HttpServletRequest request) {

        int userId=getSecurityId.SecurityIdChecker(request);
        int friendId= conversionFriendIdRequest.friendId();

        List<Message> messages=messageService.getConversation(userId, friendId);

        List<ConversationResponse>responses=messages.stream()
                .map(message->new ConversationResponse(
                        message.getId(),
                        message.getSender().getId(),
                        message.getReceiver().getId(),
                        message.getContent(),
                        message.getLocalDateTime(),
                        message.getMessageShow()
                )).toList();

        return ResponseEntity.ok(SuccessClass.success(
                "Messages",responses
        ));
    }


    @PreAuthorize("hasRole('USER')")
    @GetMapping("/countInfo")
    public ResponseEntity<SuccessClass> getAllCountInfo(HttpServletRequest servletRequest){
        int userId=getSecurityId.SecurityIdChecker(servletRequest);
        int friends=messageService.getFriendsCount(userId);
        int request=messageService.getRequestCount(userId);
        UserQuickInfoResponse userQuickInfoResponse =new UserQuickInfoResponse(friends,request);
        return ResponseEntity.ok(
                SuccessClass.success("Quick Info Loaded", userQuickInfoResponse)
        );
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/updateRelationStatus")
    public ResponseEntity<SuccessClass>updateRelationStatus(@Valid @RequestBody RelationStatusRequest relationStatusRequest,
                                                 HttpServletRequest request){
        int userId=getSecurityId.SecurityIdChecker(request);
       String message= messageService.updateRelation(userId, relationStatusRequest.friendId(), relationStatusRequest.status());
        return ResponseEntity.ok(
                SuccessClass.success(message,null)
        );
    }

}
