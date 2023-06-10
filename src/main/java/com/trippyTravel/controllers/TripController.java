package com.trippyTravel.controllers;
import com.trippyTravel.models.*;
import com.trippyTravel.repositories.*;
import com.trippyTravel.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class TripController {
    @Autowired
    private final TripRepository tripRepository;

    @Autowired
    private final ImageRepository imageRepository;

    @Autowired
    private final ImageService imageService;

    @Autowired
    private final ActivityRepository activityRepository;

    public TripController(TripRepository tripRepository, ImageRepository imageRepository, ImageService imageService, ActivityRepository activityRepository) {
        this.tripRepository = tripRepository;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
        this.activityRepository = activityRepository;
    }

    @CrossOrigin
    @RequestMapping(value = "/trip/page/{page}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody
    Map<String, Object> retrieveAllTrips(@PathVariable long page) throws IOException {
        List<Trip> trips = tripRepository.findTripsWithPageLimit(page * 5);
        long count = tripRepository.getNumTrips();
        List<String> locations = new ArrayList<>();
        List<Trip> tripsSubList = new ArrayList<>();
        for (int i = 0; i < trips.size(); i++) {
            Trip trip = trips.get(i);
            locations.add(trip.getLocation());
            String profileImageId = null;
            if (trip.getTrip_profile_image() != null) {
                profileImageId = trip.getTrip_profile_image();
            } else {
                if (trip.getImages().size() > 0) {
                    profileImageId = Long.toString(trip.getImages().get(0).getId());
                }
            }
            if (profileImageId != null) {
                trip.setTrip_profile_image(imageService.getEncodedImageFileById(profileImageId, "%s.jpeg"));
            }
            tripsSubList.add(trip);
        }
        HashMap<String, Object> map = new HashMap<>();
        map.put("locations", locations);
        map.put("trips", tripsSubList);
        map.put("numTrips", count);
        return map;
    }

    @CrossOrigin
    @RequestMapping(value="/trip/{id}", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody Trip retrieveTripById(@PathVariable long id) {
        Trip trip = tripRepository.getOne(id);
        System.out.println("num trip activities: " + trip.getActivities().size());
        return trip;
    }

    @CrossOrigin
    @RequestMapping(value="/trip/create", method=RequestMethod.POST, produces="application/json")
    public @ResponseBody Trip createTrip(@RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest){
        Trip trip = new Trip((String) data.get("location"), (String) data.get("name"), (String) data.get("startDate"),
                (String) data.get("endDate"), (String) data.get("tripType"), (String) data.get("parentTrip"),
                (String) data.get("category"), (String) data.get("categoryItem"), (String) data.get("categoryItemDetail1"),
                (String) data.get("categoryItemDetail2"), (String) data.get("categoryItemDetail3"));
        return tripRepository.save(trip);
    }

    @CrossOrigin
    @RequestMapping(value="/trip/{id}", method=RequestMethod.PUT, produces="application/json")
    public @ResponseBody Trip updateTrip(@PathVariable long id, @RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest){
        Trip tripFromDb = tripRepository.getOne(id);
        tripFromDb.setName((String) data.get("name"));
        tripFromDb.setLocation((String) data.get("location"));
        tripFromDb.setStartDate((String) data.get("startDate"));
        tripFromDb.setEndDate((String) data.get("endDate"));
        tripFromDb.setTripType((String) data.get("tripType"));
        tripFromDb.setParentTrip((String) data.get("parentTrip"));
        tripFromDb.setCategory((String) data.get("category"));
        tripFromDb.setCategoryItem((String) data.get("categoryItem"));
        tripFromDb.setCategoryItemDetail1((String) data.get("categoryItemDetail1"));
        tripFromDb.setCategoryItemDetail2((String) data.get("categoryItemDetail2"));
        tripFromDb.setCategoryItemDetail3((String) data.get("categoryItemDetail3"));
        return tripRepository.save(tripFromDb);
    }

    @CrossOrigin
    @RequestMapping(value="/trip/{id}", method=RequestMethod.DELETE, produces="application/json")
    public @ResponseBody String deleteTrip(@PathVariable long id) {
        Trip trip = tripRepository.getOne(id);
        List<Activity> activities = activityRepository.findActivitiesByTrip(trip);
        for (Activity activity : activities) {
            activityRepository.delete(activity);
        }
        List<Image> images = imageRepository.findImagesByTrip(trip);
        for (Image image: images) {
            imageRepository.delete(image);
        }
        tripRepository.delete(trip);
        return "SUCCESS";
    }

    @CrossOrigin
    @RequestMapping(value="/parentTrips", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody List<String> retrieveParentTrips() {
        return tripRepository.findAllParentTrips();
    }

    @CrossOrigin
    @RequestMapping(value="/parentTrip", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody List<Trip> retrieveTripsForParentTrip(@RequestParam String parentTripName) {
        String nameWithCorrectCharacters = parentTripName.replace("%20", " ");
        System.out.println(nameWithCorrectCharacters);
        return tripRepository.findTripsByParentTrip(nameWithCorrectCharacters);
    }

    @CrossOrigin
    @RequestMapping(value="/category/{name}", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody List<Trip> retrieveTripsForCategoryName(@PathVariable String name) throws IOException {
        List<Trip> trips = tripRepository.findTripsByCategory(name);
        for (int i = 0; i < trips.size(); i++) {
            Trip trip = trips.get(i);
            String profileImageId = null;
            if (trip.getTrip_profile_image() != null) {
                profileImageId = trip.getTrip_profile_image();
            } else {
                if (trip.getImages().size() > 0) {
                    profileImageId = Long.toString(trip.getImages().get(0).getId());
                }
            }
            if (profileImageId != null) {
                trip.setTrip_profile_image(imageService.getEncodedImageFileById(profileImageId, "%s.jpeg"));
            }
        }
        return trips;
    }

}