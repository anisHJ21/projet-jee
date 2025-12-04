package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.VehicleRequest;
import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.Vehicle;
import com.ecocollect.wastemanagement.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleService {
    
    private final VehicleRepository repository;
    
    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }
    
    public Vehicle getVehicleById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
    }
    
    public Vehicle createVehicle(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setId(UUID.randomUUID().toString());
        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setType(request.getType());
        vehicle.setStatus(request.getStatus() != null ? request.getStatus() : "available");
        vehicle.setCapacity(request.getCapacity());
        vehicle.setCurrentLoad(request.getCurrentLoad() != null ? request.getCurrentLoad() : 0);
        vehicle.setFuelLevel(request.getFuelLevel() != null ? request.getFuelLevel() : 100);
        vehicle.setLastMaintenance(request.getLastMaintenance());
        vehicle.setAssignedDriver(request.getAssignedDriver());
        vehicle.setCurrentRoute(request.getCurrentRoute());
        
        return repository.save(vehicle);
    }
    
    public Vehicle updateVehicle(String id, VehicleRequest request) {
        Vehicle vehicle = getVehicleById(id);
        
        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setType(request.getType());
        if (request.getStatus() != null) {
            vehicle.setStatus(request.getStatus());
        }
        vehicle.setCapacity(request.getCapacity());
        if (request.getCurrentLoad() != null) {
            vehicle.setCurrentLoad(request.getCurrentLoad());
        }
        if (request.getFuelLevel() != null) {
            vehicle.setFuelLevel(request.getFuelLevel());
        }
        vehicle.setLastMaintenance(request.getLastMaintenance());
        vehicle.setAssignedDriver(request.getAssignedDriver());
        vehicle.setCurrentRoute(request.getCurrentRoute());
        
        return repository.save(vehicle);
    }
    
    public void deleteVehicle(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", id);
        }
        repository.deleteById(id);
    }
    
    public List<Vehicle> getAvailableVehicles() {
        return repository.findByStatus("available");
    }
}

