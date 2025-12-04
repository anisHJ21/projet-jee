package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.EmployeeRequest;
import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.Employee;
import com.ecocollect.wastemanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    
    private final EmployeeRepository repository;
    
    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }
    
    public Employee getEmployeeById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", id));
    }
    
    public Employee createEmployee(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setId(UUID.randomUUID().toString());
        employee.setName(request.getName());
        employee.setRole(request.getRole());
        employee.setStatus(request.getStatus() != null ? request.getStatus() : "available");
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setAssignedZone(request.getAssignedZone());
        employee.setShiftsThisWeek(request.getShiftsThisWeek() != null ? request.getShiftsThisWeek() : 0);
        employee.setJoinDate(request.getJoinDate());
        
        return repository.save(employee);
    }
    
    public Employee updateEmployee(String id, EmployeeRequest request) {
        Employee employee = getEmployeeById(id);
        
        employee.setName(request.getName());
        employee.setRole(request.getRole());
        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setAssignedZone(request.getAssignedZone());
        if (request.getShiftsThisWeek() != null) {
            employee.setShiftsThisWeek(request.getShiftsThisWeek());
        }
        employee.setJoinDate(request.getJoinDate());
        
        return repository.save(employee);
    }
    
    public void deleteEmployee(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Employee", id);
        }
        repository.deleteById(id);
    }
    
    public List<Employee> getAvailableEmployees() {
        return repository.findByStatus("available");
    }
    
    public List<Employee> getEmployeesByZone(String zone) {
        return repository.findByAssignedZone(zone);
    }
}

