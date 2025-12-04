package com.ecocollect.wastemanagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequest {
    @NotBlank(message = "Plate number is required")
    private String plateNumber;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    private String status = "available";
    
    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;
    
    @Min(value = 0, message = "Current load must be non-negative")
    private Integer currentLoad = 0;
    
    @Min(value = 0, message = "Fuel level must be between 0 and 100")
    @Max(value = 100, message = "Fuel level must be between 0 and 100")
    private Integer fuelLevel = 100;
    
    @NotBlank(message = "Last maintenance date is required")
    private String lastMaintenance;
    
    private String assignedDriver;
    
    private String currentRoute;
}

