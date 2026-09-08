package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {
    boolean existsByPhoneNo(String phoneNo);
//    boolean existsByUserFriends_PhoneNo(String phoneNo);
    User findByPhoneNo(String phoneNo);

}
