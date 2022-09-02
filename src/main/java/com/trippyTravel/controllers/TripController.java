package com.trippyTravel.controllers;
import com.trippyTravel.models.*;
import com.trippyTravel.repositories.*;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

@Controller
public class TripController {
    @Autowired
    private final TripRepository tripRepository;

    @Autowired
    private final ImageRepository imagesRepository;

    public TripController(TripRepository tripRepository, ImageRepository imagesRepository) {
        this.tripRepository = tripRepository;
        this.imagesRepository = imagesRepository;
    }
    @CrossOrigin
    @RequestMapping(value="/trip", method=RequestMethod.GET, produces="application/json")
    public @ResponseBody List<Trip> retrieveAllTrips() {
        List<Trip> trips = tripRepository.findAll();
        return trips;
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