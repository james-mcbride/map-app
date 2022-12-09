package com.trippyTravel.repositories;

import com.trippyTravel.models.Activity;
import com.trippyTravel.models.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ActivityRepository extends JpaRepository<Activity,Long> {
    List<Activity> findActivitiesByTrip(Trip trip);
}
