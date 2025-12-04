package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.RouteRequest;
import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.Route;
import com.ecocollect.wastemanagement.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RouteService {
    
    private final RouteRepository repository;
    
    public List<Route> getAllRoutes() {
        return repository.findAll();
    }
    
    public Route getRouteById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route", id));
    }
    
    public Route createRoute(RouteRequest request) {
        Route route = new Route();
        route.setId(UUID.randomUUID().toString());
        route.setName(request.getName());
        route.setStatus(request.getStatus() != null ? request.getStatus() : "scheduled");
        route.setZone(request.getZone());
        route.setScheduledTime(request.getScheduledTime());
        route.setEstimatedDuration(request.getEstimatedDuration());
        route.setCollectionPoints(request.getCollectionPoints());
        route.setCompletedPoints(request.getCompletedPoints() != null ? request.getCompletedPoints() : 0);
        route.setAssignedVehicle(request.getAssignedVehicle());
        route.setAssignedEmployees(request.getAssignedEmployees() != null ? request.getAssignedEmployees() : new ArrayList<>());
        route.setDistance(request.getDistance());
        
        return repository.save(route);
    }
    
    public Route updateRoute(String id, RouteRequest request) {
        Route route = getRouteById(id);
        
        route.setName(request.getName());
        if (request.getStatus() != null) {
            route.setStatus(request.getStatus());
        }
        route.setZone(request.getZone());
        route.setScheduledTime(request.getScheduledTime());
        route.setEstimatedDuration(request.getEstimatedDuration());
        if (request.getCollectionPoints() != null) {
            route.setCollectionPoints(request.getCollectionPoints());
        }
        if (request.getCompletedPoints() != null) {
            route.setCompletedPoints(request.getCompletedPoints());
        }
        route.setAssignedVehicle(request.getAssignedVehicle());
        if (request.getAssignedEmployees() != null) {
            route.setAssignedEmployees(request.getAssignedEmployees());
        }
        route.setDistance(request.getDistance());
        
        return repository.save(route);
    }
    
    public void deleteRoute(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Route", id);
        }
        repository.deleteById(id);
    }
}

