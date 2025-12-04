package com.ecocollect.wastemanagement.repository;

import com.ecocollect.wastemanagement.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRead(Boolean read);
    List<Notification> findByType(String type);
}

