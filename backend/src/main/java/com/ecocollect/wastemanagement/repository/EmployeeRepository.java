package com.ecocollect.wastemanagement.repository;

import com.ecocollect.wastemanagement.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
    List<Employee> findByStatus(String status);
    List<Employee> findByAssignedZone(String zone);
    List<Employee> findByStatusAndAssignedZone(String status, String zone);
}

