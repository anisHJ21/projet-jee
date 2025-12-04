package com.ecocollect.wastemanagement.dto;

import lombok.Data;

@Data
public class DashboardStatsResponse {
    private CollectionPointsStats collectionPoints;
    private RoutesStats routes;
    private EmployeesStats employees;
    private AlertsStats alerts;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(CollectionPointsStats collectionPoints, RoutesStats routes, EmployeesStats employees,
            AlertsStats alerts) {
        this.collectionPoints = collectionPoints;
        this.routes = routes;
        this.employees = employees;
        this.alerts = alerts;
    }

    @Data
    public static class CollectionPointsStats {
        private Integer total;
        private Integer needingAttention;

        public CollectionPointsStats() {
        }

        public CollectionPointsStats(Integer total, Integer needingAttention) {
            this.total = total;
            this.needingAttention = needingAttention;
        }
    }

    @Data
    public static class RoutesStats {
        private Integer total;
        private Integer active;

        public RoutesStats() {
        }

        public RoutesStats(Integer total, Integer active) {
            this.total = total;
            this.active = active;
        }
    }

    @Data
    public static class EmployeesStats {
        private Integer onDuty;
        private Integer available;

        public EmployeesStats() {
        }

        public EmployeesStats(Integer onDuty, Integer available) {
            this.onDuty = onDuty;
            this.available = available;
        }
    }

    @Data
    public static class AlertsStats {
        private Integer active;
        private Integer critical;

        public AlertsStats() {
        }

        public AlertsStats(Integer active, Integer critical) {
            this.active = active;
            this.critical = critical;
        }
    }
}
