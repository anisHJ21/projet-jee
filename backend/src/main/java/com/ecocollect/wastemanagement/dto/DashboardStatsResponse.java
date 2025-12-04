package com.ecocollect.wastemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private CollectionPointsStats collectionPoints;
    private RoutesStats routes;
    private EmployeesStats employees;
    private AlertsStats alerts;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CollectionPointsStats {
        private Integer total;
        private Integer needingAttention;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoutesStats {
        private Integer total;
        private Integer active;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeesStats {
        private Integer onDuty;
        private Integer available;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertsStats {
        private Integer active;
        private Integer critical;
    }
}

