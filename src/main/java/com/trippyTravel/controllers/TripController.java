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

    public TripController(TripRepository tripRepository, ImageRepository imageRepository, ImageService imageService) {
        this.tripRepository = tripRepository;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
    }

    @CrossOrigin
    @RequestMapping(value = "/trip/page/{page}", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody
    Map<String, Object> retrieveAllTrips(@PathVariable long page) throws IOException {
        List<Trip> trips = tripRepository.findTripsWithPageLimit(page * 10);
        long count = tripRepository.getNumTrips();
        List<String> locations = new ArrayList<>();
        List<Trip> tripsSubList = new ArrayList<>();
        for (int i = 0; i < trips.size(); i++) {
            Trip trip = trips.get(i);
            locations.add(trip.getLocation());
            String profileImageId = null;
//            if (i < (page + 10) && i>= (page * 10) ) {
                if (trip.getTrip_profile_image() != null) {
                    profileImageId = trip.getTrip_profile_image();
                } else {
                    if (trip.getImages().size() > 0) {
                        profileImageId = Long.toString(trip.getImages().get(0).getId());
                    }
                }
                if (profileImageId != null) {
                    trip.setTrip_profile_image(imageService.getEncodedImageFileById(profileImageId));
                }
                tripsSubList.add(trip);
//            }
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
        return tripRepository.getOne(id);
    }

    @CrossOrigin
    @RequestMapping(value="/trip/create", method=RequestMethod.POST, produces="application/json")
    public @ResponseBody Trip createTrip(@RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest){
        Trip trip = new Trip((String) data.get("location"), (String) data.get("name"), (String) data.get("startDate"), (String) data.get("endDate"));
        return tripRepository.save(trip);
    }

    @CrossOrigin
    @RequestMapping(value="/trip/{id}", method=RequestMethod.PUT, produces="application/json")
    public @ResponseBody Trip updateTrip(@PathVariable long id, @RequestBody HashMap<String, Object> data, HttpServletRequest httpServletRequest){
        Trip trip = new Trip((String) data.get("location"), (String) data.get("name"), (String) data.get("startDate"), (String) data.get("endDate"));
        Trip tripFromDb = tripRepository.getOne(id);
        tripFromDb.setName(trip.getName());
        tripFromDb.setLocation(trip.getLocation());
        tripFromDb.setStartDate(trip.getStartDate());
        tripFromDb.setEndDate(trip.getEndDate());
        return tripRepository.save(tripFromDb);
    }

}