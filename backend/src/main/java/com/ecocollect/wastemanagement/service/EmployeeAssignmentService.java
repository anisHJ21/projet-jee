package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.Employee;
import com.ecocollect.wastemanagement.model.Route;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for automatic employee assignment to routes
 * Assigns employees based on availability, skills, and assigned zones
 */
@Service
@RequiredArgsConstructor
public class EmployeeAssignmentService {
    
    private final EmployeeService employeeService;
    private final RouteService routeService;
    
    /**
     * Automatically assign employees to a route
     * Priority: available status > zone match > minimum shifts this week
     */
    public Route assignEmployeesToRoute(String routeId, Integer numberOfEmployees) {
        Route route = routeService.getRouteById(routeId);
        
        List<Employee> allEmployees = employeeService.getAllEmployees();
        
        // Filter by zone if route has a zone
        List<Employee> candidates = allEmployees;
        if (route.getZone() != null && !route.getZone().isEmpty()) {
            candidates = allEmployees.stream()
                .filter(e -> route.getZone().equals(e.getAssignedZone()))
                .collect(Collectors.toList());
        }
        
        // Filter available employees
        List<Employee> available = candidates.stream()
            .filter(e -> "available".equals(e.getStatus()) || "on_duty".equals(e.getStatus()))
            .collect(Collectors.toList());
        
        // If no zone-matched available employees, use all available
        if (available.isEmpty()) {
            available = allEmployees.stream()
                .filter(e -> "available".equals(e.getStatus()) || "on_duty".equals(e.getStatus()))
                .collect(Collectors.toList());
        }
        
        // Sort by shifts this week (ascending) to balance workload
        available.sort((e1, e2) -> Integer.compare(e1.getShiftsThisWeek(), e2.getShiftsThisWeek()));
        
        // Select the requested number of employees (or all available if less)
        int count = numberOfEmployees != null ? 
            Math.min(numberOfEmployees, available.size()) : available.size();
        
        List<String> assignedEmployeeIds = available.stream()
            .limit(count)
            .map(Employee::getId)
            .collect(Collectors.toList());
        
        route.setAssignedEmployees(assignedEmployeeIds);
        
        return routeService.updateRoute(routeId, convertToRequest(route));
    }
    
    private com.ecocollect.wastemanagement.dto.RouteRequest convertToRequest(Route route) {
        com.ecocollect.wastemanagement.dto.RouteRequest request = 
            new com.ecocollect.wastemanagement.dto.RouteRequest();
        request.setName(route.getName());
        request.setStatus(route.getStatus());
        request.setZone(route.getZone());
        request.setScheduledTime(route.getScheduledTime());
        request.setEstimatedDuration(route.getEstimatedDuration());
        request.setCollectionPoints(route.getCollectionPoints());
        request.setCompletedPoints(route.getCompletedPoints());
        request.setAssignedVehicle(route.getAssignedVehicle());
        request.setAssignedEmployees(route.getAssignedEmployees());
        request.setDistance(route.getDistance());
        return request;
    }
}

