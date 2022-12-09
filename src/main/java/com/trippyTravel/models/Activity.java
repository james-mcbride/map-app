package com.trippyTravel.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "activity")
    @JsonBackReference
    private List<Image> images;

    @Column(nullable = false, length = 250)
    private String location;

    @Column(nullable = false, length = 250)
    private String name;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonManagedReference
    private Trip trip;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public List<Image> getImages() {
        return images;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Activity() {}

    public Activity(String location, String name, Trip trip) {
        this.location = location;
        this.name = name;
        this.trip = trip;
    }

}
