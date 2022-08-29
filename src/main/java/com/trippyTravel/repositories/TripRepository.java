package com.trippyTravel.repositories;

import com.trippyTravel.models.Trip;
import com.trippyTravel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip,Long> {


    @Query("from Trip trip where trip.description like %:term%")
    List<Trip> searchTrip(@Param("term") String term);
    List<Trip> findByDescriptionContainingOrNameContainingOrLocationContaining(String term, String term1, String term2);
    List<Trip> findAllByDescriptionContainingOrNameContainingOrLocationContaining(String term, String term1, String term2);

    List<Trip> findAllByOrderByIdDesc();

}

