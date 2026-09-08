package com.chartapp.chartapp.service;

import com.chartapp.chartapp.entity.Contact;
import com.chartapp.chartapp.repository.ContactRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ContactService {

    private ContactRepo contactRepo;

    public ContactService(ContactRepo contactRepo) {
        this.contactRepo = contactRepo;
    }

    @Transactional
    public void saveContact(Contact contact){
        contact.setCreatedAt(LocalDateTime.now());
        contactRepo.save(contact);
    }
}
