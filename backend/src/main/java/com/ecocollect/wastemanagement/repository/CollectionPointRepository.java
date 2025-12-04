package com.ecocollect.wastemanagement.repository;

import com.ecocollect.wastemanagement.model.CollectionPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CollectionPointRepository extends MongoRepository<CollectionPoint, String> {
    List<CollectionPoint> findByStatus(String status);
    List<CollectionPoint> findByWasteType(String wasteType);
    List<CollectionPoint> findByFillLevelGreaterThanEqual(Integer fillLevel);
}

