package com.chartapp.chartapp.controller;

import com.chartapp.chartapp.dto.request.*;
import com.chartapp.chartapp.dto.response.AcceptedFriendResponse;
import com.chartapp.chartapp.dto.response.PendingFriendResponse;
import com.chartapp.chartapp.dto.response.UserProfileResponse;
import com.chartapp.chartapp.entity.*;
import com.chartapp.chartapp.exception.SuccessClass;
import com.chartapp.chartapp.exception.UserAlreadyExist;
import com.chartapp.chartapp.exception.UserNotFound;
import com.chartapp.chartapp.repository.UserFriendsRepo;
import com.chartapp.chartapp.repository.UserRepo;
import com.chartapp.chartapp.security.GetSecurityId;
import com.chartapp.chartapp.service.CloudinaryService;
import com.chartapp.chartapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    private final UserService userService;
    private final GetSecurityId getSecurityId;
    private final UserRepo userRepo;
    private final UserFriendsRepo userFriendsRepo;
    private final CloudinaryService cloudinaryService;


    public UserController(UserService userService,
                          GetSecurityId getSecurityId,  UserRepo userRepo,
                          UserFriendsRepo userFriendsRepo,CloudinaryService cloudinaryService) {
        this.userService = userService;
        this.getSecurityId = getSecurityId;
        this.userRepo = userRepo;
        this.userFriendsRepo = userFriendsRepo;
        this.cloudinaryService=cloudinaryService;
    }


    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getUser")
    public ResponseEntity<SuccessClass> getUser(HttpServletRequest request){

        int id= getSecurityId.SecurityIdChecker(request);
        User user= userService.getUser(id);

        UserProfileResponse userProfileResponse =new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getPhoneNo(),
                user.getEmail(),
                user.getProfileImage(),
                user.getProfileTag(),
                user.getStatus()
        );

        return ResponseEntity.ok(
                SuccessClass.success("Profile Loaded", userProfileResponse)
        );
    }


    @PreAuthorize("hasRole('USER')")
    @PutMapping("/updatePic")
    public ResponseEntity<SuccessClass> updatePic(
            @Valid @RequestBody UpdateProfileImageRequest updateProfileImageRequest,
            HttpServletRequest request
    ) {

        int userId = getSecurityId.SecurityIdChecker(request);
        String message= userService.updateProfileImage(updateProfileImageRequest.image(), userId);
        return ResponseEntity.ok(
                SuccessClass.success(message,null)
        );
    }


    @PreAuthorize("hasRole('USER')")
    @PutMapping("/updateProfile")
    public ResponseEntity<SuccessClass>updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest, HttpServletRequest request){

        int userId=getSecurityId.SecurityIdChecker(request);
        String res=userService.updateProfile(userId, updateProfileRequest.name(), updateProfileRequest.email()
                , updateProfileRequest.profileTag(), updateProfileRequest.imageUrl());

        return ResponseEntity.ok(
                SuccessClass.success(res,null)
        );
    }

    @PostMapping("/addFriends")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?>AddFriends(@Valid @RequestBody AddFriendRequest addFriendRequest, HttpServletRequest request){

        int userId=getSecurityId.SecurityIdChecker(request);

        if(!userRepo.existsByPhoneNo(addFriendRequest.phoneNo())){
            throw new UserNotFound("Your Friend Do Not Have Account");
        }

        if(userFriendsRepo.existsByFriend_PhoneNoAndUser_Id(addFriendRequest.phoneNo(),userId)){
            throw new UserAlreadyExist("This Account Is Already Added As Friend");
        }

        userService.addUserFriends(addFriendRequest.phoneNo(), addFriendRequest.name(), userId);

            return ResponseEntity.ok(
                    SuccessClass.success("Friend Added Successfully",null)
            );

    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getPendingFriendRequest")
    public ResponseEntity<SuccessClass> getPendingRequest(HttpServletRequest request){

        int userId = getSecurityId.SecurityIdChecker(request);
        System.out.println("Pending Request: "+userId);


        List<UserFriends> userFriends = userService.getPendingFriends(userId);



        List<PendingFriendResponse>responses=userFriends.stream()
                .map(friend->new PendingFriendResponse(
                        friend.getId(),
                        friend.getFriend().getId(),
                        friend.getFriend().getName(),
                        friend.getFriend().getPhoneNo(),
                        friend.getFriend().getEmail(),
                        friend.getFriend().getProfileImage(),
                        friend.getFriend().getProfileTag(),
                        friend.getFriendNickName(),
                        friend.getStatus()
                )).toList();

        return ResponseEntity.ok(
                SuccessClass.success("Pending Request Loaded",responses)
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getPendingFriendInvitation")
    public ResponseEntity<SuccessClass> getInvitationRequest(HttpServletRequest request){

        int userId = getSecurityId.SecurityIdChecker(request);

        List<UserFriends> userFriends = userService.getInvitationFriends(userId);

        List<PendingFriendResponse>response=userFriends.stream()
                .map(user-> new PendingFriendResponse(
                        user.getId(),
                        user.getUser().getId(),
                        user.getUser().getName(),
                        user.getUser().getPhoneNo(),
                        user.getUser().getEmail(),
                        user.getUser().getProfileImage(),
                        user.getUser().getProfileTag(),
                        user.getUser().getName(),
                        user.getStatus()
                )).toList();

        return ResponseEntity.ok(
                SuccessClass.success("Invitation Loaded",response)
        );
    }


    @PreAuthorize("hasRole('USER')")
    @PutMapping("/acceptRequest")
    public ResponseEntity<?>acceptRequest(@Valid @RequestBody AcceptedFriendRequest acceptedFriendRequest,
                                          HttpServletRequest request){

        int userId= getSecurityId.SecurityIdChecker(request);

        String status=userService.updateAcceptRequest(acceptedFriendRequest.phoneNo(), acceptedFriendRequest.name(),
                acceptedFriendRequest.status(), userId);

        return ResponseEntity.ok(
                SuccessClass.success(status,null)
        );
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/getAcceptedFriends")
    public ResponseEntity<SuccessClass>getAcceptedFriends(HttpServletRequest request){

        int userId= getSecurityId.SecurityIdChecker(request);

        List<Relation> friends = userService.getFriends(userId);

        List<AcceptedFriendResponse>responses=friends.stream()
                .map(friend->new AcceptedFriendResponse(
                        friend.getId(),
                        friend.getContact().getId(),
                        friend.getContact().getName(),
                        friend.getContact().getPhoneNo(),
                        friend.getContact().getProfileImage(),
                        friend.getContact().getProfileTag(),
                        friend.getContactName(),
                        friend.getStatus()
                )).toList();

        return ResponseEntity.ok(
                SuccessClass.success("Saved Friends",responses)
        );

    }


    @DeleteMapping("/deleteCloudinaryImage")
    public ResponseEntity<?> deleteCloudinaryImage(@RequestBody DeleteCloudinaryImageRequest request) {

        if (request.publicId() == null ||
                request.publicId().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Public ID is required");
        }

        try {

            cloudinaryService.deleteImage(
                    request.publicId()
            );

            return ResponseEntity.ok(
                    "Image deleted successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to delete image");
        }
    }

}
