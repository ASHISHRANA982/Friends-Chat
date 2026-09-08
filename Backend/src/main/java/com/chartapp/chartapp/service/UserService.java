package com.chartapp.chartapp.service;

import com.chartapp.chartapp.entity.Relation;
import com.chartapp.chartapp.entity.User;
import com.chartapp.chartapp.entity.UserFriends;
import com.chartapp.chartapp.entity.UserLogin;
import com.chartapp.chartapp.exception.InvalidCredentials;
import com.chartapp.chartapp.exception.UserAlreadyExist;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.repository.RelationRepo;
import com.chartapp.chartapp.repository.UserFriendsRepo;
import com.chartapp.chartapp.repository.UserLoginRepo;
import com.chartapp.chartapp.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {


    private final UserRepo userRepo;
    private final UserFriendsRepo userFriendsRepo;
    private final UserLoginRepo userLoginRepo;
    private final RelationRepo relationRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo,UserFriendsRepo userFriendsRepo,
                       UserLoginRepo userLoginRepo,RelationRepo relationRepo,PasswordEncoder passwordEncoder){

        this.userRepo=userRepo;
        this.userFriendsRepo=userFriendsRepo;
        this.userLoginRepo=userLoginRepo;
        this.relationRepo=relationRepo;
        this.passwordEncoder=passwordEncoder;
    }

    @Transactional
    public User createUser(User user, UserLogin userLogin){


        if (user == null || user.getPhoneNo() == null || user.getPhoneNo().isBlank()) {
            throw new UserNotFound("Empty user details");
        }

        if(userRepo.existsByPhoneNo(user.getPhoneNo())){
            throw new UserAlreadyExist("User Already Exist With This PhoneNo");
        }
        if (userLogin == null ||
                userLogin.getUsername() == null ||
                userLogin.getUsername().isBlank() ||
                userLogin.getPassword() == null ||
                userLogin.getPassword().isBlank()) {

            throw new UserNotFound("Empty login details");
        }
        if(userLoginRepo.existsByUsername(userLogin.getUsername())){
            throw new UserAlreadyExist("User Already Exist With This Username");
        }

        user.setStatus("Active");
        user=userRepo.save(user);

        userLogin.setUser(user);
        userLogin.setRole("USER");
        userLogin.setPassword(passwordEncoder.encode(userLogin.getPassword()));

        userLoginRepo.save(userLogin);

        return user;
    }

    public User getUser(int id){
        User user=userRepo.findById(id).orElseThrow(()->new UserNotFound("User Not Found"));
        return user;
    }

    @Transactional
    public String updateProfileImage(String image,int userId){
        User user=userRepo.findById(userId).
                orElseThrow(()->new UserNotFound("User Not Found"));
        if (image == null || image.isBlank()) {
            throw new InvalidCredentials("Profile image is required");
        }
        user.setProfileImage(image);

        userRepo.save(user);

        return "Profile Image Update Successfully";
    }

    @Transactional
    public String updateProfile(int userId,String name,String email,String profileTag,String imageUrl){
        User user=userRepo.findById(userId).orElseThrow(()->new UserNotFound("User Not Found"));
        user.setEmail(email);
        user.setName(name);
        user.setProfileTag(profileTag);
        if(imageUrl!=null && !imageUrl.isBlank()) {
            user.setProfileImage(imageUrl);
        }

        userRepo.save(user);
        return "Profile Update Successfully";
    }

    @Transactional
    public UserFriends addUserFriends(String phoneNo,String friendName,int userId){

        User user=userRepo.findById(userId).orElseThrow(()->new UserNotFound("User Not Found"));
        User userFriend=userRepo.findByPhoneNo(phoneNo);

        if(userFriend.getPhoneNo().equalsIgnoreCase(user.getPhoneNo())) {
            throw new UserAlreadyExist("Your Device Can Not Be Add Your Account As Friend");
        }
        if(userFriend.getStatus().equalsIgnoreCase("inactive")){
            throw new UserNotFound("Friend Account Is Not Active");
        }

        UserFriends userFriends=new UserFriends();
        userFriends.setFriend(userFriend);
        userFriends.setUser(user);
        userFriends.setFriendNickName(friendName);
        return  userFriendsRepo.save(userFriends);

    }

    public List<UserFriends> getPendingFriends(int userId){
        return userFriendsRepo.findByUser_IdAndStatusAndFriend_Status(userId,"PENDING","ACTIVE");
    }

    public List<UserFriends> getInvitationFriends(int userId){
        return userFriendsRepo.findByFriend_IdAndStatusAndUser_Status(userId,"PENDING","ACTIVE");
    }

    @Transactional
    public String updateAcceptRequest(String requestPhoneNo, String requestNickName,
            String status, int userId) {

        UserFriends userFriends =
                userFriendsRepo.findByUser_PhoneNoAndFriend_Id(
                        requestPhoneNo,
                        userId
                );

        if (userFriends == null) {
            throw new UserNotFound("Friend request not found");
        }

        if (!"Active".equalsIgnoreCase(userFriends.getUser().getStatus())) {
            throw new UserNotFound("Your Account Is Not Active");
        }

        if (!"Active".equalsIgnoreCase(userFriends.getFriend().getStatus())) {
            throw new UserNotFound("Friend Account Is Not Active");
        }

        if (!"PENDING".equalsIgnoreCase(userFriends.getStatus())) {
            throw new UserAlreadyExist(
                    "Friend request is already processed"
            );
        }

        if ("REJECTED".equalsIgnoreCase(status)) {

            userFriends.setStatus("REJECTED");
            userFriendsRepo.save(userFriends);

            return "Rejected Successfully";
        }

        if ("ACCEPTED".equalsIgnoreCase(status)) {

            userFriends.setStatus("ACCEPTED");
            UserFriends userFriends1 =
                    userFriendsRepo.save(userFriends);

            Relation relation1 = new Relation();
            relation1.setOwner(userFriends1.getFriend());
            relation1.setContact(userFriends1.getUser());
            relation1.setContactName(requestNickName);
            relation1.setStatus("CONNECTED");
            relationRepo.save(relation1);

            Relation relation2 = new Relation();
            relation2.setOwner(userFriends1.getUser());
            relation2.setContact(userFriends1.getFriend());
            relation2.setContactName(userFriends1.getFriendNickName());
            relation2.setStatus("CONNECTED");
            relationRepo.save(relation2);

            return "Invitation Accepted Successfully";
        }

        throw new InvalidCredentials("Invalid request status");
    }

   public List<Relation> getFriends(int userId){
        return relationRepo.findByOwner_Id(userId);
   }

}
