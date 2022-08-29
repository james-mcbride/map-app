package com.trippyTravel.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table (name="locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length = 250)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "location")
    @JsonBackReference
    private List<Image> images;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonManagedReference
    private Trip trip;

    public Location() {
    }

    public Location(String location, String description, List<Image> images) {
        this.location = location;
        this.description = description;
        this.images = images;
    }

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }

    public String getLocation() { return location; }

    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public List<Image> getImages() { return images; }

    public void setImages(List<Image> images) { this.images = images; }

}
