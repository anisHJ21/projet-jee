package com.ecocollect.wastemanagement.service;

import com.ecocollect.wastemanagement.dto.DashboardStatsResponse;
import com.ecocollect.wastemanagement.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final CollectionPointRepository collectionPointRepository;
    private final RouteRepository routeRepository;
    private final EmployeeRepository employeeRepository;
    private final AlertRepository alertRepository;

    public DashboardService(CollectionPointRepository collectionPointRepository,
            RouteRepository routeRepository,
            EmployeeRepository employeeRepository,
            AlertRepository alertRepository) {
        this.collectionPointRepository = collectionPointRepository;
        this.routeRepository = routeRepository;
        this.employeeRepository = employeeRepository;
        this.alertRepository = alertRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        List<com.ecocollect.wastemanagement.model.CollectionPoint> points = collectionPointRepository.findAll();
        List<com.ecocollect.wastemanagement.model.Route> routes = routeRepository.findAll();
        List<com.ecocollect.wastemanagement.model.Employee> employees = employeeRepository.findAll();
        List<com.ecocollect.wastemanagement.model.Alert> alerts = alertRepository.findAll();

        // Collection Points Stats
        long criticalPoints = points.stream()
                .filter(p -> p.getFillLevel() >= 80 || "full".equals(p.getStatus()))
                .count();

        DashboardStatsResponse.CollectionPointsStats collectionPointsStats = new DashboardStatsResponse.CollectionPointsStats(
                points.size(),
                (int) criticalPoints);

        // Routes Stats
        long activeRoutes = routes.stream()
                .filter(r -> "in_progress".equals(r.getStatus()) || "scheduled".equals(r.getStatus()))
                .count();

        DashboardStatsResponse.RoutesStats routesStats = new DashboardStatsResponse.RoutesStats(
                routes.size(),
                (int) activeRoutes);

        // Employees Stats
        long onDutyEmployees = employees.stream()
                .filter(e -> "on_duty".equals(e.getStatus()) || "available".equals(e.getStatus()))
                .count();

        long availableEmployees = employees.stream()
                .filter(e -> "available".equals(e.getStatus()))
                .count();

        DashboardStatsResponse.EmployeesStats employeesStats = new DashboardStatsResponse.EmployeesStats(
                (int) onDutyEmployees,
                (int) availableEmployees);

        // Alerts Stats
        long activeAlerts = alerts.stream()
                .filter(a -> !a.getAcknowledged())
                .count();

        long criticalAlerts = alerts.stream()
                .filter(a -> "critical".equals(a.getSeverity()) && !a.getAcknowledged())
                .count();

        DashboardStatsResponse.AlertsStats alertsStats = new DashboardStatsResponse.AlertsStats(
                (int) activeAlerts,
                (int) criticalAlerts);

        return new DashboardStatsResponse(
                collectionPointsStats,
                routesStats,
                employeesStats,
                alertsStats);
    }
}
