package com.chartapp.chartapp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Setter@Getter
public class UserLogout {

    @Id
    private String token;
    private Date expiryDate;

    public UserLogout(){
        super();
    }

    public UserLogout(String token, Date expiryDate) {
        this.token = token;
        this.expiryDate = expiryDate;
    }
}
