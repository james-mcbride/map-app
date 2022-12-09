package com.trippyTravel.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table (name="trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trip")
    @JsonBackReference
    private List<Image> images;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trip")
    @JsonBackReference
    private List<Activity> activities;

    @Column(nullable = false, length = 250)
    private String location;

    @Column(nullable = false, length = 250)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String trip_profile_image;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trip")
    @JsonBackReference
    private List<User> users;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trip")
    @JsonBackReference
    private List<Location> locations;

    @Column(name = "trip_type")
    private String tripType;

    @Column(name = "parent_trip")
    private String parentTrip;

    public Trip() {
    }

    public Trip(Long id) {
        this.id = id;
    }
    public Trip(String location, String name, String startDate, String endDate, String tripType, String parentTrip) {
        this.location = location;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.tripType = tripType;
        this.parentTrip = parentTrip;
    }

    public Trip(String location, String name, String description, String trip_profile_image, String startDate, String endDate, List<User> users, List<Image> images, String tripType, String parentTrip) {
        this.location = location;
        this.name = name;
        this.description = description;
        this.trip_profile_image = trip_profile_image;
        this.startDate = startDate;
        this.endDate = endDate;
        this.users = users;
        this.images = images;
        this.tripType = tripType;
        this.parentTrip = parentTrip;
    }

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }


    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getStartDate() { return startDate; }

    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }

    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getTrip_profile_image() { return trip_profile_image; }

    public void setTrip_profile_image(String trip_profile_image) { this.trip_profile_image = trip_profile_image; }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public String getTripType() {
        return tripType;
    }

    public void setTripType(String tripType) {
        this.tripType = tripType;
    }

    public String getParentTrip() {
        return parentTrip;
    }

    public void setParentTrip(String parentTrip) {
        this.parentTrip = parentTrip;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
}
