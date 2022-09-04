package com.trippyTravel.controllers;

import com.trippyTravel.models.Image;
import com.trippyTravel.models.Trip;
import com.trippyTravel.repositories.ImageRepository;
import com.trippyTravel.repositories.TripRepository;
import com.trippyTravel.services.ImageService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

@Controller
public class ImageController {
    @Autowired
    private final TripRepository tripRepository;

    @Autowired
    private final ImageRepository imagesRepository;

    @Autowired
    private final ImageService imageService;

    public ImageController(TripRepository tripRepository, ImageRepository imagesRepository, ImageService imageService) {
        this.tripRepository = tripRepository;
        this.imagesRepository = imagesRepository;
        this.imageService = imageService;
    }

    @CrossOrigin
    @RequestMapping(value="/image/{id}", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody Image retrieveImageById(@PathVariable long id) throws IOException {
        Image image = imagesRepository.getOne(id);
        String encodedImage = imageService.getEncodedImageFile(image);
        image.setImage_location(encodedImage);
        return image;
    }

    @CrossOrigin
    @RequestMapping(value="/image/{id}", method= RequestMethod.PUT, produces="application/json")
    public @ResponseBody
    void updateImage(@PathVariable long id, @RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest) {
        Image image= imagesRepository.getOne(id);
        boolean isProfileImage = (boolean) data.get("isProfilePicture");
        if (data.get("description") != null) {
            String description = (String) data.get("description");
            image.setDescription(description);
        }
        System.out.println("about to set is profile image");
        if (isProfileImage) {
            System.out.println("setting is profile image");
            Trip trip = tripRepository.getOne(image.getTrip().getId());
            trip.setTrip_profile_image(Long.toString(image.getId()));
        }
        imagesRepository.save(image);
    }

    @CrossOrigin
    @RequestMapping(value="/image/{id}", method= RequestMethod.DELETE, produces="application/json")
    public @ResponseBody
    void deleteImage(@PathVariable long id) throws IOException {
        Image image= imagesRepository.getOne(id);
        Path destinationFile = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", Long.toString(image.getId())));
        Files.delete(destinationFile);
        imagesRepository.delete(image);
    }

    @CrossOrigin
    @RequestMapping(value="/trip/{id}/images", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody
    List<Image> retrieveTripImage(@PathVariable long id) throws IOException {
        List<Image> images = imagesRepository.findImagesByTrip(new Trip(id));
        if (images.size() <=5) {
            for (int i =0; i<images.size(); i = i+1) {
                Image image = images.get(i);
                String encodedImage = imageService.getEncodedImageFile(image);
                image.setImage_location(encodedImage);
                images.set(i, image);
            }
        }
        return images;
    }


    @CrossOrigin
    @RequestMapping(value="/trip/{id}/images", method= RequestMethod.POST, produces="application/json")
    public @ResponseBody
    Image saveImages(@PathVariable long id, @RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest) throws IOException {
        Trip trip= tripRepository.getOne(id);
        Image image = imagesRepository.save(new Image(trip));
        image.setDescription((String) data.get("description"));
        byte[] decodedImage = Base64.decodeBase64((String) data.get("image"));
        Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", Long.toString(image.getId())));
        Files.write(destinationFIle, decodedImage);
        return image;
    }
}
