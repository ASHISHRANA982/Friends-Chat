package com.chartapp.chartapp.controller;

import com.chartapp.chartapp.entity.Message;
import com.chartapp.chartapp.entity.Relation;
import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.exception.ErrorClass;
import com.chartapp.chartapp.exception.InvalidCredentials;
import com.chartapp.chartapp.exception.UserAlreadyExist;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.dto.websocket.PrivateMessage;
import com.chartapp.chartapp.repository.MessageRepo;
import com.chartapp.chartapp.repository.RelationRepo;
import com.chartapp.chartapp.repository.UserLoginRepo;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepo messageRepo;
    private final UserLoginRepo userLoginRepo;
    private SimpUserRegistry simpUserRegistry;
    private final RelationRepo relationRepo;

    public ChatController(SimpMessagingTemplate messagingTemplate,
                          MessageRepo messageRepo,
                          UserLoginRepo userLoginRepo,
                          SimpUserRegistry simpUserRegistry, RelationRepo relationRepo) {

        this.messagingTemplate = messagingTemplate;
        this.messageRepo = messageRepo;
        this.userLoginRepo = userLoginRepo;
        this.simpUserRegistry=simpUserRegistry;
        this.relationRepo=relationRepo;
    }

@MessageMapping("/private-chat")
public void sendMessage( @Payload PrivateMessage privateMessage,Principal principal) {


        if (principal == null) {
            throw new UserAlreadyExist("Invalid Credential");
        }

        String senderName = principal.getName();


    UserLogin senderLogin = userLoginRepo.findByUsername(senderName).
            orElseThrow(()->new UserNotFound("User Not Found Login Again"));

    if (privateMessage.getReceiverId() == null) {
        throw new UserNotFound("Receiver ID is required");
    }

    UserLogin receiverLogin = userLoginRepo.findByUser_Id(privateMessage.getReceiverId())
            .orElseThrow(()->new UserNotFound("Receiver Not Found"));

    Relation senderRelation =relationRepo.findByOwner_IdAndContact_Id(senderLogin.getUser().getId(),
            receiverLogin.getUser().getId()).orElseThrow(
            ()->new InvalidCredentials("You Are Not Friend Now")
    );
    Relation receiverRelation=relationRepo.findByOwner_IdAndContact_Id(receiverLogin.getUser().getId(),
            senderLogin.getUser().getId()).orElseThrow(
            ()->new InvalidCredentials("You Are Not Friend Now")
    );

    if(senderRelation.getStatus().equalsIgnoreCase("BLOCKED") ){
        throw new InvalidCredentials( senderRelation.getOwner().getName()+" Blocked You");
    }

    if(receiverRelation.getStatus().equalsIgnoreCase("BLOCKED") ){
        throw new InvalidCredentials( receiverRelation.getOwner().getName()+" Blocked You");

    }

    LocalDateTime now = LocalDateTime.now();


    Message message = new Message();
    message.setContent(privateMessage.getContent());
    message.setLocalDateTime(now);
    message.setSender(senderLogin.getUser());
    message.setReceiver(receiverLogin.getUser());
    message.setMessageShow("Enabled");

    messageRepo.save(message);


    privateMessage.setLocalDateTime(now);
    privateMessage.setSenderId(senderLogin.getUser().getId());



    messagingTemplate.convertAndSendToUser(
            receiverLogin.getUsername(),
            "/queue/message",
            privateMessage
    );
    messagingTemplate.convertAndSendToUser(
            senderLogin.getUsername(),
            "/queue/message",
            privateMessage
    );
    

}

@MessageExceptionHandler
public void handleWebSocketException(Exception ex, Principal principal) {

        if (principal == null) {
            return;
        }

        ErrorClass error = new ErrorClass();
        error.setStatus(400);
        error.setMessage(ex.getMessage());
        error.setTimestamp(LocalDateTime.now().toString());

        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/errors",
                error
        );
}

}