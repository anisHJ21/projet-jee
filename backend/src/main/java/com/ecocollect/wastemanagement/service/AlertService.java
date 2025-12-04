package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.AlertRequest;
import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.Alert;
import com.ecocollect.wastemanagement.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlertService {
    
    private final AlertRepository repository;
    
    public List<Alert> getAllAlerts() {
        return repository.findAll();
    }
    
    public Alert getAlertById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", id));
    }
    
    public Alert createAlert(AlertRequest request) {
        Alert alert = new Alert();
        alert.setId(UUID.randomUUID().toString());
        alert.setSeverity(request.getSeverity());
        alert.setTitle(request.getTitle());
        alert.setDescription(request.getDescription());
        alert.setLocation(request.getLocation());
        alert.setTimestamp(request.getTimestamp());
        alert.setAcknowledged(request.getAcknowledged() != null ? request.getAcknowledged() : false);
        
        return repository.save(alert);
    }
    
    public Alert updateAlert(String id, AlertRequest request) {
        Alert alert = getAlertById(id);
        
        alert.setSeverity(request.getSeverity());
        alert.setTitle(request.getTitle());
        alert.setDescription(request.getDescription());
        alert.setLocation(request.getLocation());
        alert.setTimestamp(request.getTimestamp());
        if (request.getAcknowledged() != null) {
            alert.setAcknowledged(request.getAcknowledged());
        }
        
        return repository.save(alert);
    }
    
    public void deleteAlert(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Alert", id);
        }
        repository.deleteById(id);
    }
}

