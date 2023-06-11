package com.trippyTravel.services;

import com.trippyTravel.models.Trip;
import com.trippyTravel.repositories.TripRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service("tripService")
public class TripService {
    TripRepository tripRepository;
    ImageService imageService;

    public TripService(TripRepository tripRepository, ImageService imageService) {
        this.tripRepository = tripRepository;
        this.imageService = imageService;
    }

    public List<Trip> addImagesToTrips(List<Trip> trips) throws IOException {
        System.out.println("getting profile pics for images: " + trips.size());
        List<Trip> tripsSubList = new ArrayList<>();
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
            tripsSubList.add(trip);
        }
        return tripsSubList;
    }
}
