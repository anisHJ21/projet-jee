package com.ecocollect.wastemanagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertRequest {
    @NotBlank(message = "Severity is required")
    private String severity;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String location;
    
    @NotBlank(message = "Timestamp is required")
    private String timestamp;
    
    private Boolean acknowledged = false;
}

