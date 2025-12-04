package com.ecocollect.wastemanagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Role is required")
    private String role;
    
    private String status = "available";
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    private String assignedZone;
    
    @Min(value = 0, message = "Shifts this week must be non-negative")
    private Integer shiftsThisWeek = 0;
    
    @NotBlank(message = "Join date is required")
    private String joinDate;
}

