package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.UserLogout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
@Repository
public interface UserLogoutRepo extends JpaRepository<UserLogout,String> {

    boolean existsByToken(String token);
    void deleteByExpiryDateBefore(Date date);
}
