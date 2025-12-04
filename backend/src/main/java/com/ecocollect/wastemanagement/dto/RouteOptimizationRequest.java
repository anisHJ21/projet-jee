package com.ecocollect.wastemanagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteOptimizationRequest {
    @NotEmpty(message = "Collection point IDs are required")
    private List<String> collectionPointIds;
    
    @NotBlank(message = "Vehicle ID is required")
    private String vehicleId;
    
    private String zone;
}

