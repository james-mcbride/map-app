package com.trippyTravel.controllers;

import com.trippyTravel.models.Group;
import com.trippyTravel.models.Image;
import com.trippyTravel.models.Trip;
import com.trippyTravel.models.User;
import com.trippyTravel.repositories.ActivityRepository;
import com.trippyTravel.repositories.GroupsRepository;
import com.trippyTravel.repositories.TripRepository;
import com.trippyTravel.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class TripController {
    @Autowired
    private final EmailService emailService;
    private final TripRepository tripRepository;
    private final GroupsRepository groupsRepository;

    @Value("${fileStackApiKey}")
    private String fileStackApiKey;
   

    private final ActivityRepository activityRepository;

    public TripController(EmailService emailService, TripRepository tripRepository, GroupsRepository groupsRepository, ActivityRepository activityRepository) {
        this.emailService = emailService;
        this.tripRepository = tripRepository;
        this.groupsRepository=groupsRepository;
        this.activityRepository=activityRepository;

    }

    @GetMapping("/trip")
    public String SeeAllTripsPage(Model model) {
        List<Trip> tripFromDb= tripRepository.findAll();
        model.addAttribute("posts",tripFromDb);

        return "Trip/index";
    }

    @PostMapping("/trip")
    public String index(Model model) {
        List<Trip> tripFromDb= tripRepository.findAll();
        model.addAttribute("trips",tripFromDb);

        return "Trip/index";
    }
    @RequestMapping(path = "/keys.js", produces = "application/javascript")
    @ResponseBody
    public String apikey(){
        System.out.println(fileStackApiKey);
        return "const FileStackApiKey = `" + fileStackApiKey + "`";
    }
    @GetMapping("/trip/{id}")
    public String showOneTrip(@PathVariable Long id, Model vModel){
        vModel.addAttribute("trips", tripRepository.getOne(id));
        vModel.addAttribute("activity", activityRepository.getOne(1L));
        return "Trip/show";
    }

    @GetMapping("/trip/create")
    public String createTrip(Model model){
        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        model.addAttribute("trip", new Trip());
        model.addAttribute("groups", groupsRepository.findByOwner(user));

        return "Trip/create";
    }

    @PostMapping("/trip/create")

    public String createTripForm(@ModelAttribute Trip trips,@RequestParam(name = "image_url") String ImgUrl
            , @RequestParam(name="group")Group group) {

        Image imagetosave = new Image(ImgUrl);
       List<Image>imageList= new ArrayList<>();
imageList.add(imagetosave);
//        Group groups=(Group) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
trips.setImages(imageList);
trips.setGroup(group);
//        trips.setGroup(groups);
//        Image imagesToSave= new Image(image0);
//        Image image1ToSave= new Image(image1);
//        imagesToSave.setPost(post);
//        image1ToSave.setPost(post);
//      post.setImages(imagesToSave);
        System.out.println(imageList);
        Trip saveTrip= tripRepository.save(trips);
//        imageRepo.save(imagesToSave);
//        imageRepo.save(image1ToSave);
//        emailService.prepareAndSend(saveTrip, "new trip","hey where you wanna go");

        return "redirect:/trip/"+saveTrip.getId();
    }
    @GetMapping(path = "/trip/{id}/edit")
    public String updateTrip(@PathVariable Long id ,Model model){
        Trip trip=tripRepository.getOne(id);
        System.out.println(trip.getName());
        model.addAttribute("trip", trip);
        return "Trip/edit";
    }
    @PostMapping(path = "/trip/{id}/edit")

    public String updateTripForm(@PathVariable Long id ,@ModelAttribute Trip trips) {
        Group groups=(Group) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        trips.setId(id);
        trips.setGroup(groups);
        tripRepository.save(trips);
        return "redirect:/trip";
    }



    @PostMapping("/trip/{id}/delete")

    public String DeleteTrip(@PathVariable Long id) {
        tripRepository.deleteById(id);
        return "redirect:/trip";

    }

    @GetMapping(path = "/trip/{id}/activities")
    public String tripActivities(@PathVariable Long id ,Model model){
        Trip trip=tripRepository.getOne(id);
        model.addAttribute("trip", trip);
        return "Trip/activities";
    }
}
