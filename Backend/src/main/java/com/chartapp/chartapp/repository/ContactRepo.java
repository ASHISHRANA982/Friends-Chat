package com.chartapp.chartapp.repository;

import com.chartapp.chartapp.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepo extends JpaRepository<Contact,Integer> {
}
