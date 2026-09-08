package com.chartapp.chartapp.service;

import com.chartapp.chartapp.entity.Message;
import com.chartapp.chartapp.entity.Relation;
import com.chartapp.chartapp.entity.UserFriends;
import com.chartapp.chartapp.exception.InvalidCredentials;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.repository.MessageRepo;
import com.chartapp.chartapp.repository.RelationRepo;
import com.chartapp.chartapp.repository.UserFriendsRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepo messageRepo;
    private final RelationRepo relationRepo;
    private final UserFriendsRepo userFriendsRepo;

    public MessageService(MessageRepo messageRepo, RelationRepo relationRepo,UserFriendsRepo userFriendsRepo) {
        this.messageRepo = messageRepo;
        this.relationRepo=relationRepo;
        this.userFriendsRepo=userFriendsRepo;
    }

    public List<Message> getConversation(int userId, int friendId) {

        String status=relationRepo.findStatus(userId,friendId);

        if (status == null) {
            throw new UserNotFound("Friend relation not found");
        }

//        if (!"CONNECTED".equalsIgnoreCase(status)) {
//            throw new InvalidCredentials("You cannot access this conversation");
//        }

        return messageRepo.getConversation(userId, friendId);
    }

    public int getFriendsCount(int userId){
        List<Relation>relations=relationRepo.findByOwner_Id(userId);
        return relations.size();
    }

    public int getRequestCount(int userId){
        List<UserFriends>friends=userFriendsRepo
                .findByUser_IdAndStatusAndFriend_Status(userId,"PENDING","Active");
        return friends.size();
    }

    @Transactional
    public String updateRelation(int userId,int friendId,String status){

        if(userId==friendId){
            throw new InvalidCredentials("You cannot update your own relation");
        }

        Relation relation=relationRepo.findRelation(userId,friendId);

        if(relation==null){
            throw new UserNotFound("Relation Not Found");
        }

        String newStatus = status.toUpperCase();

        if (!newStatus.equals("CONNECTED") && !newStatus.equals("BLOCKED")) {
            throw new IllegalArgumentException(
                    "Invalid status. Status must be CONNECTED or BLOCKED"
            );
        }
        if(relation.getStatus().equalsIgnoreCase(newStatus)){
            throw new IllegalArgumentException("Status Already Updated");
        }
        relation.setStatus(newStatus);
        relationRepo.save(relation);

        return "Status Updated Successfully";
    }

}
