package com.ecocollect.wastemanagement.controller;

import com.ecocollect.wastemanagement.dto.RouteOptimizationRequest;
import com.ecocollect.wastemanagement.dto.RouteOptimizationResponse;
import com.ecocollect.wastemanagement.dto.RouteRequest;
import com.ecocollect.wastemanagement.model.Route;
import com.ecocollect.wastemanagement.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {
    
    private final RouteService service;
    private final RouteOptimizationService optimizationService;
    private final EmployeeAssignmentService assignmentService;
    private final RoutePlanningService planningService;
    
    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(service.getAllRoutes());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Route> getRoute(@PathVariable String id) {
        return ResponseEntity.ok(service.getRouteById(id));
    }
    
    @PostMapping
    public ResponseEntity<Route> createRoute(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createRoute(request));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Route> updateRoute(
            @PathVariable String id,
            @Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(service.updateRoute(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable String id) {
        service.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/optimize")
    public ResponseEntity<RouteOptimizationResponse> optimizeRoute(
            @Valid @RequestBody RouteOptimizationRequest request) {
        return ResponseEntity.ok(optimizationService.optimizeRoute(request));
    }
    
    @PostMapping("/{id}/assign-employees")
    public ResponseEntity<Route> assignEmployees(
            @PathVariable String id,
            @RequestBody Map<String, Integer> request) {
        Integer numberOfEmployees = request.get("numberOfEmployees");
        return ResponseEntity.ok(assignmentService.assignEmployeesToRoute(id, numberOfEmployees));
    }
    
    @PostMapping("/plan")
    public ResponseEntity<Route> planRoute(
            @RequestBody Map<String, Object> request) {
        String zone = (String) request.get("zone");
        String vehicleId = (String) request.get("vehicleId");
        Integer numberOfEmployees = request.get("numberOfEmployees") != null ? 
            ((Number) request.get("numberOfEmployees")).intValue() : null;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(planningService.planRoute(zone, vehicleId, numberOfEmployees));
    }
}

