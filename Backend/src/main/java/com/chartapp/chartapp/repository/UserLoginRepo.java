package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLoginRepo extends JpaRepository<UserLogin,Integer> {

    Optional<UserLogin> findByUsername(String username);
    boolean existsByUsername(String username);

    Optional<UserLogin>findByUser_Id(int userId);

}
