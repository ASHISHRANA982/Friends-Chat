package com.chartapp.chartapp.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {

        Map<String, String> config = new HashMap<>();

        config.put("cloud_name", "dlezsvoj2");
        config.put("api_key", "379646882133529");
        config.put("api_secret", "ZLqOubQzQlv4ZuMU11gDTv78OZs");

        return new Cloudinary(config);
    }
}
