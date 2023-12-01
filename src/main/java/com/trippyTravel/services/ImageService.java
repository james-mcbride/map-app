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
    public Image addEncodedImageFileToImage(Image image, boolean userIsMobile) throws IOException {
        String imageId = Long.toString(image.getId());
        String fileType = "%s.jpeg";
        if (image.getFileType() != null && image.getFileType().length() > 0) {
            fileType = "%s.";
            fileType += image.getFileType().split("/")[1];
        }
        if (fileType.contains(".mp4") && userIsMobile){
            Path videoImageFile = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", imageId));
            try {
                byte[] imageBytes = Files.readAllBytes(videoImageFile);
                image.setImage_location(Base64.encodeBase64String(imageBytes));
                image.setVideoCoverImage(true);
                image.setFileType("image/jpeg");
                System.out.println("returning image instead of video for image id: " + image.getId());
                return image;
            } catch (Exception e) {
                System.out.println(e);
            }

        }
        Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format(fileType, imageId));
        System.out.println(fileType);
        byte[] imageBytes = Files.readAllBytes(destinationFIle);
        image.setImage_location(Base64.encodeBase64String(imageBytes));
        return image;
    }

    public String getEncodedImageFileById(String id, String fileType) throws IOException {
        if (fileType.contains(".mp4")){
            Path videoImageFile = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", id));
            try {
                byte[] imageBytes = Files.readAllBytes(videoImageFile);
                return Base64.encodeBase64String(imageBytes);
            } catch (Exception e) {
                System.out.println(e);
            }

        }
        Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format(fileType, id));
        System.out.println(fileType);
        byte[] imageBytes = Files.readAllBytes(destinationFIle);
        return Base64.encodeBase64String(imageBytes);
    }

}
