package com.ecocollect.wastemanagement.repository;

import com.ecocollect.wastemanagement.model.Route;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RouteRepository extends MongoRepository<Route, String> {
    List<Route> findByStatus(String status);
    List<Route> findByZone(String zone);
    List<Route> findByAssignedVehicle(String vehicleId);
}

