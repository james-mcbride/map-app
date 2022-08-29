package com.trippyTravel.controllers;

import com.trippyTravel.models.*;
import com.trippyTravel.repositories.*;
import com.trippyTravel.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;



@Controller
public class HomeController {
    private final TripRepository tripRepository;
    private final ImageRepository imagesRepository;
    private final UsersRepository usersRepository;
    @Autowired
    private UserService usersService;
    @Autowired

    public HomeController(TripRepository tripRepository, ImageRepository imagesRepository, UsersRepository usersRepository) {
        this.tripRepository = tripRepository;
        this.imagesRepository = imagesRepository;
        this.usersRepository = usersRepository;
    }

    @GetMapping("/")
    public String SeeAllTripsHome(@ModelAttribute User user, Model model) {
        return "index";
    }

}
