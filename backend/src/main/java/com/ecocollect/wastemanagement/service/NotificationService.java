package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.NotificationRequest;
import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.CollectionPoint;
import com.ecocollect.wastemanagement.model.Notification;
import com.ecocollect.wastemanagement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository repository;
    private final AlertService alertService;
    
    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }
    
    public Notification getNotificationById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
    }
    
    public Notification createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setType(request.getType());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setTimestamp(request.getTimestamp());
        notification.setRead(request.getRead() != null ? request.getRead() : false);
        
        return repository.save(notification);
    }
    
    public Notification updateNotification(String id, NotificationRequest request) {
        Notification notification = getNotificationById(id);
        
        notification.setType(request.getType());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setTimestamp(request.getTimestamp());
        if (request.getRead() != null) {
            notification.setRead(request.getRead());
        }
        
        return repository.save(notification);
    }
    
    public void deleteNotification(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Notification", id);
        }
        repository.deleteById(id);
    }
    
    public void markAllAsRead() {
        List<Notification> notifications = repository.findByRead(false);
        for (Notification notification : notifications) {
            notification.setRead(true);
            repository.save(notification);
        }
    }
    
    /**
     * Check collection point and create notifications/alerts if needed
     */
    public void checkAndCreateNotifications(CollectionPoint point) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        // Check if container is full or nearly full
        if (point.getFillLevel() >= 80) {
            // Create notification
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setType("alert");
            notification.setTitle("Container Full");
            notification.setMessage("Container at " + point.getName() + " has reached " + point.getFillLevel() + "% capacity.");
            notification.setTimestamp(timestamp);
            notification.setRead(false);
            repository.save(notification);
            
            // Create alert if critical
            if (point.getFillLevel() >= 90) {
                com.ecocollect.wastemanagement.dto.AlertRequest alertRequest = 
                    new com.ecocollect.wastemanagement.dto.AlertRequest();
                alertRequest.setSeverity("critical");
                alertRequest.setTitle("Container Overflow Risk");
                alertRequest.setDescription("Container at " + point.getName() + " has reached " + 
                    point.getFillLevel() + "% capacity and needs immediate attention.");
                alertRequest.setLocation(point.getAddress());
                alertRequest.setTimestamp(timestamp);
                alertRequest.setAcknowledged(false);
                alertService.createAlert(alertRequest);
            }
        }
        
        // Check if container is damaged
        if ("damaged".equals(point.getStatus())) {
            Notification notification = new Notification();
            notification.setId(UUID.randomUUID().toString());
            notification.setType("warning");
            notification.setTitle("Container Damaged");
            notification.setMessage("Container at " + point.getName() + " is damaged and requires maintenance.");
            notification.setTimestamp(timestamp);
            notification.setRead(false);
            repository.save(notification);
        }
    }
}

