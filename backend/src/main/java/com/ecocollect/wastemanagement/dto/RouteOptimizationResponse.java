package com.ecocollect.wastemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteOptimizationResponse {
    private List<String> optimizedPointIds;
    private Double totalDistance;
    private String estimatedDuration;
    private String message;
}

