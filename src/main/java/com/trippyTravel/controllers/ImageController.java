package com.trippyTravel.controllers;

import com.trippyTravel.models.Image;
import com.trippyTravel.models.Trip;
import com.trippyTravel.repositories.ImageRepository;
import com.trippyTravel.repositories.TripRepository;
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

    public ImageController(TripRepository tripRepository, ImageRepository imagesRepository) {
        this.tripRepository = tripRepository;
        this.imagesRepository = imagesRepository;
    }

    @CrossOrigin
    @RequestMapping(value="/image/{id}", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody Image retrieveImageById(@PathVariable long id) throws IOException {
        Image image = imagesRepository.getOne(id);
        Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", Long.toString(image.getId())));
        byte[] imageBytes = Files.readAllBytes(destinationFIle);
        String encodedImage = Base64.encodeBase64String(imageBytes);
        image.setImage_location(encodedImage);
        return image;
    }

    @CrossOrigin
    @RequestMapping(value="/image/{id}", method= RequestMethod.PUT, produces="application/json")
    public @ResponseBody
    void updateImage(@PathVariable long id, @RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest) {
        Image image= imagesRepository.getOne(id);
        boolean isProfileImage = (boolean) data.get("isProfilePicture");
        String description = (String) data.get("description");
        image.setDescription(description);
        if (isProfileImage) {
            Trip trip = tripRepository.getOne(image.getTrip().getId());
            trip.setTrip_profile_image(Long.toString(image.getId()));
        }
        imagesRepository.save(image);
    }

    @CrossOrigin
    @RequestMapping(value="/image/{id}", method= RequestMethod.DELETE, produces="application/json")
    public @ResponseBody
    void deleteImage(@PathVariable long id) {
        Image image= imagesRepository.getOne(id);
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
                Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", Long.toString(image.getId())));
                byte[] imageBytes = Files.readAllBytes(destinationFIle);
                String encodedImage = Base64.encodeBase64String(imageBytes);
                image.setImage_location(encodedImage);
                images.set(i, image);
            }
        }
        return images;
    }


    @CrossOrigin
    @RequestMapping(value="/trip/{id}/images", method= RequestMethod.POST, produces="application/json")
    public @ResponseBody
    void saveImages(@PathVariable long id, @RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest) throws IOException {
        System.out.println("saving image");
        Trip trip= tripRepository.getOne(id);
        Image image = imagesRepository.save(new Image(trip));
        byte[] decodedImage = Base64.decodeBase64((String) data.get("image"));
        Path destinationFIle = Paths.get("/Users/jimmiemcbride/Pictures/mapapp", String.format("%s.jpeg", Long.toString(image.getId())));
        Files.write(destinationFIle, decodedImage);

    }
}
