package com.chartapp.chartapp.service;

import com.chartapp.chartapp.repository.UserLogoutRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class UserLogoutService {


    private final UserLogoutRepo userLogoutRepo;

    public UserLogoutService(UserLogoutRepo userLogoutRepo) {
        this.userLogoutRepo = userLogoutRepo;
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanToken(){
        Date date=new Date();
        userLogoutRepo.deleteByExpiryDateBefore(date);
        System.out.println("Token Expiry Now");
    }
}
