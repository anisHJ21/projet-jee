package com.ecocollect.wastemanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "collectionPoints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionPoint {
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("address")
    private String address;
    
    @Field("wasteType")
    private String wasteType;
    
    @Field("fillLevel")
    private Integer fillLevel = 0;
    
    @Field("status")
    private String status = "operational";
    
    @Field("lastCollected")
    private String lastCollected;
    
    @Field("latitude")
    private Double latitude;
    
    @Field("longitude")
    private Double longitude;
    
    @Field("assignedZone")
    private String assignedZone;
}

