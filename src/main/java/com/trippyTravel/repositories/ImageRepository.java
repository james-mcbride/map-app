package com.trippyTravel.repositories;

import com.trippyTravel.models.Image;
import com.trippyTravel.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ImageRepository extends JpaRepository<Image,Long> {
    List<Image> findImagesByTrip(Trip trip);
}
