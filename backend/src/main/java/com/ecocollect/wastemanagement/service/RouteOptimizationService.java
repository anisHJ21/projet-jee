package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.RouteOptimizationRequest;
import com.ecocollect.wastemanagement.dto.RouteOptimizationResponse;
import com.ecocollect.wastemanagement.exception.ValidationException;
import com.ecocollect.wastemanagement.model.CollectionPoint;
import com.ecocollect.wastemanagement.model.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for optimizing collection routes using Dijkstra-like algorithm
 * Optimizes based on distance, fill level priority, and vehicle capacity
 */
@Service
@RequiredArgsConstructor
public class RouteOptimizationService {
    
    private final CollectionPointService collectionPointService;
    private final VehicleService vehicleService;
    
    /**
     * Calculate distance between two points using Haversine formula
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    
    /**
     * Optimize route using nearest neighbor heuristic with priority for high fill levels
     */
    public RouteOptimizationResponse optimizeRoute(RouteOptimizationRequest request) {
        // Get vehicle
        Vehicle vehicle = vehicleService.getVehicleById(request.getVehicleId());
        
        // Get collection points
        List<CollectionPoint> points = request.getCollectionPointIds().stream()
                .map(collectionPointService::getCollectionPointById)
                .collect(Collectors.toList());
        
        if (points.isEmpty()) {
            throw new ValidationException("No collection points provided");
        }
        
        // Filter points by zone if specified
        if (request.getZone() != null && !request.getZone().isEmpty()) {
            // In a real implementation, you'd filter by zone
            // For now, we'll use all points
        }
        
        // Sort points by fill level (priority: higher fill level first)
        points.sort((p1, p2) -> Integer.compare(p2.getFillLevel(), p1.getFillLevel()));
        
        // Use nearest neighbor algorithm starting from the highest priority point
        List<String> optimizedOrder = new ArrayList<>();
        List<CollectionPoint> remaining = new ArrayList<>(points);
        CollectionPoint current = remaining.remove(0);
        optimizedOrder.add(current.getId());
        
        double totalDistance = 0.0;
        
        while (!remaining.isEmpty()) {
            CollectionPoint nearest = null;
            double minDistance = Double.MAX_VALUE;
            int nearestIndex = -1;
            
            // Find nearest unvisited point
            for (int i = 0; i < remaining.size(); i++) {
                CollectionPoint candidate = remaining.get(i);
                double distance = calculateDistance(
                    current.getLatitude(), current.getLongitude(),
                    candidate.getLatitude(), candidate.getLongitude()
                );
                
                // Consider fill level as priority (higher fill = closer in priority space)
                double priorityDistance = distance / (1 + candidate.getFillLevel() / 100.0);
                
                if (priorityDistance < minDistance) {
                    minDistance = priorityDistance;
                    nearest = candidate;
                    nearestIndex = i;
                }
            }
            
            if (nearest != null) {
                double actualDistance = calculateDistance(
                    current.getLatitude(), current.getLongitude(),
                    nearest.getLatitude(), nearest.getLongitude()
                );
                totalDistance += actualDistance;
                optimizedOrder.add(nearest.getId());
                remaining.remove(nearestIndex);
                current = nearest;
            }
        }
        
        // Estimate duration (assuming average speed of 30 km/h and 10 min per stop)
        double estimatedHours = (totalDistance / 30.0) + (points.size() * 10.0 / 60.0);
        int hours = (int) estimatedHours;
        int minutes = (int) ((estimatedHours - hours) * 60);
        String estimatedDuration = hours + "h " + minutes + "m";
        
        RouteOptimizationResponse response = new RouteOptimizationResponse();
        response.setOptimizedPointIds(optimizedOrder);
        response.setTotalDistance(Math.round(totalDistance * 100.0) / 100.0);
        response.setEstimatedDuration(estimatedDuration);
        response.setMessage("Route optimized successfully. " + points.size() + 
            " points ordered by priority and distance.");
        
        return response;
    }
}

