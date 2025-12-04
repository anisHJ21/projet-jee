package com.ecocollect.wastemanagement.controller;

import com.ecocollect.wastemanagement.dto.AlertRequest;
import com.ecocollect.wastemanagement.model.Alert;
import com.ecocollect.wastemanagement.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {
    
    private final AlertService service;
    
    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(service.getAllAlerts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlert(@PathVariable String id) {
        return ResponseEntity.ok(service.getAlertById(id));
    }
    
    @PostMapping
    public ResponseEntity<Alert> createAlert(@Valid @RequestBody AlertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createAlert(request));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(
            @PathVariable String id,
            @Valid @RequestBody AlertRequest request) {
        return ResponseEntity.ok(service.updateAlert(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable String id) {
        service.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}

