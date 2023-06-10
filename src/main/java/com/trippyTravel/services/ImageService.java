package com.trippyTravel.services;

import com.trippyTravel.models.Image;
import com.trippyTravel.repositories.ImageRepository;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service("imageService")
public class ImageService {
    ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }
    public String getEncodedImageFile(Image image) throws IOException {
        String imageId = Long.toString(image.getId());
        String fileType = "%s.jpeg";
        if (image.getFileType() != null && image.getFileType().length() > 0) {
            fileType = "%s.";
            fileType += image.getFileType().split("/")[1];
        }
        return getEncodedImageFileById(imageId, fileType);
    }

    public String getEncodedImageFileById(String id, String fileType) throws IOException {
        Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format(fileType, id));
        System.out.println("getting image from file with id: " + id + " and fileType: " + fileType);
        byte[] imageBytes = Files.readAllBytes(destinationFIle);
        return Base64.encodeBase64String(imageBytes);
    }
}
