package com.ecocollect.wastemanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("role")
    private String role;
    
    @Field("status")
    private String status = "available";
    
    @Field("phone")
    private String phone;
    
    @Field("email")
    private String email;
    
    @Field("assignedZone")
    private String assignedZone;
    
    @Field("shiftsThisWeek")
    private Integer shiftsThisWeek = 0;
    
    @Field("joinDate")
    private String joinDate;
}

