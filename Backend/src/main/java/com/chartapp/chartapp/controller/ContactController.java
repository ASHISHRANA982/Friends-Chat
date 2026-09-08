package com.chartapp.chartapp.controller;

import com.chartapp.chartapp.entity.Contact;
import com.chartapp.chartapp.exception.SuccessClass;
import com.chartapp.chartapp.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
public class ContactController {

    private ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/saveContact")
    public ResponseEntity<SuccessClass>saveContact(@Valid @RequestBody Contact contact){
        contactService.saveContact(contact);
        return ResponseEntity.ok(
                SuccessClass.success("Your Request Noted After Review Our Team" +
                        " Contact You As Soon As Possible",null)
        );
    }
}
