package com.ecocollect.wastemanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Document(collection = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Route {
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("status")
    private String status = "scheduled";
    
    @Field("zone")
    private String zone;
    
    @Field("scheduledTime")
    private String scheduledTime;
    
    @Field("estimatedDuration")
    private String estimatedDuration;
    
    @Field("collectionPoints")
    private Integer collectionPoints;
    
    @Field("completedPoints")
    private Integer completedPoints = 0;
    
    @Field("assignedVehicle")
    private String assignedVehicle;
    
    @Field("assignedEmployees")
    private List<String> assignedEmployees;
    
    @Field("distance")
    private String distance;
}

