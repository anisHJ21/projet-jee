package com.ecocollect.wastemanagement.controller;

import com.ecocollect.wastemanagement.dto.CollectionPointRequest;
import com.ecocollect.wastemanagement.model.CollectionPoint;
import com.ecocollect.wastemanagement.service.CollectionPointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collection-points")
@RequiredArgsConstructor
public class CollectionPointController {
    
    private final CollectionPointService service;
    
    @GetMapping
    public ResponseEntity<List<CollectionPoint>> getAllCollectionPoints() {
        return ResponseEntity.ok(service.getAllCollectionPoints());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CollectionPoint> getCollectionPoint(@PathVariable String id) {
        return ResponseEntity.ok(service.getCollectionPointById(id));
    }
    
    @PostMapping
    public ResponseEntity<CollectionPoint> createCollectionPoint(
            @Valid @RequestBody CollectionPointRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createCollectionPoint(request));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<CollectionPoint> updateCollectionPoint(
            @PathVariable String id,
            @Valid @RequestBody CollectionPointRequest request) {
        return ResponseEntity.ok(service.updateCollectionPoint(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollectionPoint(@PathVariable String id) {
        service.deleteCollectionPoint(id);
        return ResponseEntity.noContent().build();
    }
}

