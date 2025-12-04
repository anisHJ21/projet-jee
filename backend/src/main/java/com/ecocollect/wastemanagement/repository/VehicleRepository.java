package com.ecocollect.wastemanagement.repository;

import com.ecocollect.wastemanagement.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    List<Vehicle> findByStatus(String status);
    Optional<Vehicle> findByPlateNumber(String plateNumber);
}

