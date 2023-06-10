package com.trippyTravel.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;

@Entity
@Table(name = "images")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn( name= "user_id")
    @JsonManagedReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "location_id")
    @JsonManagedReference
    private Location location;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonManagedReference
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    @JsonManagedReference
    private Activity activity;

    @Column( name= "image_location", columnDefinition = "text")
    private String image_location;

    @Column(columnDefinition = "text")
    private String description;

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    @Column(nullable = false, length = 250)
    private String fileType;

    public Image(){}

    public Image(String imgUrl, User user, Location location){
    this.image_location=imgUrl;
    this.user=user;
    this.location=location;
}

public Image(Trip trip, String fileType) {
        this.trip = trip;
        this.fileType = fileType;
}

    public Image(long id, User user, Location location, String image_location) {
        this.id = id;
        this.user = user;
        this.location = location;
        this.image_location = image_location;
    }

    public Image(User user, Location location, String image_location, String description, Trip trip) {
        this.user = user;
        this.location = location;
        this.image_location = image_location;
        this.description = description;
        this.trip = trip;
    }

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public String getImage_location() {
        return image_location;
    }

    public void setImage_location(String image_location) {
        this.image_location = image_location;
    }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }
}
