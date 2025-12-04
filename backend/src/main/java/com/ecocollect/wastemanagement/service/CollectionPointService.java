package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.CollectionPointRequest;
import com.ecocollect.wastemanagement.exception.ResourceNotFoundException;
import com.ecocollect.wastemanagement.model.CollectionPoint;
import com.ecocollect.wastemanagement.repository.CollectionPointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollectionPointService {
    
    private final CollectionPointRepository repository;
    private final NotificationService notificationService;
    
    public List<CollectionPoint> getAllCollectionPoints() {
        return repository.findAll();
    }
    
    public CollectionPoint getCollectionPointById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CollectionPoint", id));
    }
    
    public CollectionPoint createCollectionPoint(CollectionPointRequest request) {
        CollectionPoint point = new CollectionPoint();
        point.setId(UUID.randomUUID().toString());
        point.setName(request.getName());
        point.setAddress(request.getAddress());
        point.setWasteType(request.getWasteType());
        point.setFillLevel(request.getFillLevel() != null ? request.getFillLevel() : 0);
        point.setStatus(request.getStatus() != null ? request.getStatus() : "operational");
        point.setLastCollected(request.getLastCollected());
        point.setLatitude(request.getLatitude());
        point.setLongitude(request.getLongitude());
        
        CollectionPoint saved = repository.save(point);
        
        // Check for automatic notifications
        notificationService.checkAndCreateNotifications(saved);
        
        return saved;
    }
    
    public CollectionPoint updateCollectionPoint(String id, CollectionPointRequest request) {
        CollectionPoint point = getCollectionPointById(id);
        
        point.setName(request.getName());
        point.setAddress(request.getAddress());
        point.setWasteType(request.getWasteType());
        if (request.getFillLevel() != null) {
            point.setFillLevel(request.getFillLevel());
        }
        if (request.getStatus() != null) {
            point.setStatus(request.getStatus());
        }
        point.setLastCollected(request.getLastCollected());
        if (request.getLatitude() != null) {
            point.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            point.setLongitude(request.getLongitude());
        }
        
        CollectionPoint updated = repository.save(point);
        
        // Check for automatic notifications after update
        notificationService.checkAndCreateNotifications(updated);
        
        return updated;
    }
    
    public void deleteCollectionPoint(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("CollectionPoint", id);
        }
        repository.deleteById(id);
    }
}

