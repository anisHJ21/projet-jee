package com.ecocollect.wastemanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    private String id;
    
    @Field("severity")
    private String severity;
    
    @Field("title")
    private String title;
    
    @Field("description")
    private String description;
    
    @Field("location")
    private String location;
    
    @Field("timestamp")
    private String timestamp;
    
    @Field("acknowledged")
    private Boolean acknowledged = false;
}

