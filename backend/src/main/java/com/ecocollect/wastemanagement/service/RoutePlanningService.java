package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.RouteRequest;
import com.ecocollect.wastemanagement.exception.ValidationException;
import com.ecocollect.wastemanagement.model.CollectionPoint;
import com.ecocollect.wastemanagement.model.Route;
import com.ecocollect.wastemanagement.model.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for intelligent route planning
 * Automatically plans routes based on zone, vehicle capacity, and collection point fill levels
 */
@Service
@RequiredArgsConstructor
public class RoutePlanningService {
    
    private final CollectionPointService collectionPointService;
    private final VehicleService vehicleService;
    private final RouteOptimizationService optimizationService;
    private final EmployeeAssignmentService assignmentService;
    private final RouteService routeService;
    
    /**
     * Plan an intelligent route automatically
     */
    public Route planRoute(String zone, String vehicleId, Integer numberOfEmployees) {
        // Get vehicle
        Vehicle vehicle = vehicleService.getVehicleById(vehicleId);
        
        // Get collection points in the zone that need attention (fillLevel >= 60)
        List<CollectionPoint> allPoints = collectionPointService.getAllCollectionPoints();
        List<CollectionPoint> zonePoints = allPoints.stream()
            .filter(p -> zone.equals(p.getAssignedZone()) || 
                        (p.getFillLevel() >= 60 && "operational".equals(p.getStatus())))
            .collect(Collectors.toList());
        
        if (zonePoints.isEmpty()) {
            throw new ValidationException("No collection points found in zone: " + zone);
        }
        
        // Limit points based on vehicle capacity
        // Assuming each point represents a certain load
        int maxPoints = Math.min(zonePoints.size(), vehicle.getCapacity() / 10); // Simplified calculation
        List<CollectionPoint> selectedPoints = zonePoints.stream()
            .sorted((p1, p2) -> Integer.compare(p2.getFillLevel(), p1.getFillLevel()))
            .limit(maxPoints)
            .collect(Collectors.toList());
        
        // Optimize route order
        com.ecocollect.wastemanagement.dto.RouteOptimizationRequest optRequest = 
            new com.ecocollect.wastemanagement.dto.RouteOptimizationRequest();
        optRequest.setCollectionPointIds(
            selectedPoints.stream().map(CollectionPoint::getId).collect(Collectors.toList())
        );
        optRequest.setVehicleId(vehicleId);
        optRequest.setZone(zone);
        
        com.ecocollect.wastemanagement.dto.RouteOptimizationResponse optResponse = 
            optimizationService.optimizeRoute(optRequest);
        
        // Create route
        RouteRequest routeRequest = new RouteRequest();
        routeRequest.setName("Route " + zone + " - " + java.time.LocalDateTime.now().toString());
        routeRequest.setStatus("scheduled");
        routeRequest.setZone(zone);
        routeRequest.setScheduledTime(java.time.LocalDateTime.now().plusHours(1).toString());
        routeRequest.setEstimatedDuration(optResponse.getEstimatedDuration());
        routeRequest.setCollectionPoints(selectedPoints.size());
        routeRequest.setCompletedPoints(0);
        routeRequest.setAssignedVehicle(vehicleId);
        routeRequest.setDistance(optResponse.getTotalDistance() + " km");
        routeRequest.setAssignedEmployees(new java.util.ArrayList<>());
        
        Route route = routeService.createRoute(routeRequest);
        
        // Auto-assign employees
        if (numberOfEmployees != null && numberOfEmployees > 0) {
            assignmentService.assignEmployeesToRoute(route.getId(), numberOfEmployees);
        }
        
        return routeService.getRouteById(route.getId());
    }
}

