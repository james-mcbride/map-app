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

    @Query(nativeQuery = true, value="SELECT DISTINCT parent_trip FROM trips")
    List<String> findAllParentTrips();

    @Query(nativeQuery = true, value="SELECT * from trips order by start_date DESC LIMIT 12 offset :offset ")
    List<Trip> findTripsWithPageLimit(@Param("offset") long offset);

    List<Trip> findAllByOrderByIdDesc();

    @Query(nativeQuery = true, value="SELECT COUNT(*) from trips")
    long getNumTrips();

    List<Trip> findTripsByParentTrip(String parentTripName);

    List<Trip> findTripsByCategory(String category);

    @Query("from Trip trip where lower(trip.location) like lower(concat('%', :location,'%'))")
    List<Trip> findTripsByLocationLike(String location);

}

