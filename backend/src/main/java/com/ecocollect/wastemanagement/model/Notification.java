package com.ecocollect.wastemanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    
    @Field("type")
    private String type;
    
    @Field("title")
    private String title;
    
    @Field("message")
    private String message;
    
    @Field("timestamp")
    private String timestamp;
    
    @Field("read")
    private Boolean read = false;
}

