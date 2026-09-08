package com.chartapp.chartapp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public void deleteImage(String publicId) {

        try {

            Map result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap(
                            "resource_type", "image"
                    )
            );

            System.out.println("Cloudinary delete result: " + result);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to delete image from Cloudinary",
                    e
            );
        }
    }
}