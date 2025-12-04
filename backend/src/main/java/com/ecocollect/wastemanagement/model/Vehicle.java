package com.ecocollect.wastemanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    private String id;
    
    @Field("plateNumber")
    @Indexed(unique = true)
    private String plateNumber;
    
    @Field("type")
    private String type;
    
    @Field("status")
    private String status = "available";
    
    @Field("capacity")
    private Integer capacity;
    
    @Field("currentLoad")
    private Integer currentLoad = 0;
    
    @Field("fuelLevel")
    private Integer fuelLevel = 100;
    
    @Field("lastMaintenance")
    private String lastMaintenance;
    
    @Field("assignedDriver")
    private String assignedDriver;
    
    @Field("currentRoute")
    private String currentRoute;
}

