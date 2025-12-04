package com.ecocollect.wastemanagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String status = "scheduled";
    
    @NotBlank(message = "Zone is required")
    private String zone;
    
    @NotBlank(message = "Scheduled time is required")
    private String scheduledTime;
    
    @NotBlank(message = "Estimated duration is required")
    private String estimatedDuration;
    
    @NotNull(message = "Collection points count is required")
    @Min(value = 0, message = "Collection points must be non-negative")
    private Integer collectionPoints;
    
    @Min(value = 0, message = "Completed points must be non-negative")
    private Integer completedPoints = 0;
    
    private String assignedVehicle;
    
    private List<String> assignedEmployees;
    
    @NotBlank(message = "Distance is required")
    private String distance;
}

