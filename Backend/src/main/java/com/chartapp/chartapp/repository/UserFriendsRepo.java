package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.UserFriends;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFriendsRepo extends JpaRepository<UserFriends,Integer> {

    boolean existsByFriend_PhoneNoAndUser_Id(String phoneNo, int userId);
    List<UserFriends> findAllByUser_Id(int userId);
    UserFriends findByUser_PhoneNoAndFriend_Id(String phoneNo,int friendId);

    List<UserFriends> findByUser_IdAndStatusAndFriend_Status(int userId, String status,String userStatus);

    List<UserFriends> findByFriend_IdAndStatusAndUser_Status(int userId, String status,String friendStatus);
}
