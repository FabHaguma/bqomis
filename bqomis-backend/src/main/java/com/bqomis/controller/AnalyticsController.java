package com.bqomis.controller;

import com.bqomis.model.Appointment;
import com.bqomis.service.AppointmentService;
import com.bqomis.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AnalyticsService analyticsService;

    // GET
    // /api/analytics/appointments-by-branch?branchId=...&period=YYYY-MM-DD_to_YYYY-MM-DD
    @GetMapping("/appointments-by-branch")
    public ResponseEntity<?> getAppointmentsByBranch(
            @RequestParam Long branchId,
            @RequestParam String period) {
        String[] dates = period.split("_to_");
        LocalDate startDate = LocalDate.parse(dates[0]);
        LocalDate endDate = LocalDate.parse(dates[1]);
        return ResponseEntity.ok(
                analyticsService.getAppointmentsByBranch(branchId, startDate, endDate).toMap());
    }

    // GET
    // /api/analytics/appointments-by-service?district=...&serviceId=...&period=YYYY-MM-DD_to_YYYY-MM-DD
    @GetMapping("/appointments-by-service")
    public ResponseEntity<?> getAppointmentsByService(
            @RequestParam String district,
            @RequestParam Long serviceId,
            @RequestParam String period) {
        String[] dates = period.split("_to_");
        LocalDate startDate = LocalDate.parse(dates[0]);
        LocalDate endDate = LocalDate.parse(dates[1]);
        return ResponseEntity.ok(
                analyticsService.getAppointmentsByService(district, serviceId, startDate, endDate).toMap());
    }

    // GET
    // /api/analytics/peak-times?period=YYYY-MM-DD_to_YYYY-MM-DD&groupBy=hour|dayOfWeek
    @GetMapping("/peak-times")
    public ResponseEntity<?> getPeakTimes(
            @RequestParam String period,
            @RequestParam String groupBy) {
        String[] dates = period.split("_to_");
        LocalDate startDate = LocalDate.parse(dates[0]);
        LocalDate endDate = LocalDate.parse(dates[1]);
        return ResponseEntity.ok(
                analyticsService.getPeakTimes(startDate, endDate, groupBy).toMap());
    }

    // GET
    // /api/analytics/peak-times-by-district?district=...&period=YYYY-MM-DD_to_YYYY-MM-DD&groupBy=hour|dayOfWeek
    @GetMapping("/peak-times-by-district")
    public ResponseEntity<?> getPeakTimesByDistrict(
            @RequestParam String district,
            @RequestParam String period,
            @RequestParam String groupBy) {
        String[] dates = period.split("_to_");
        LocalDate startDate = LocalDate.parse(dates[0]);
        LocalDate endDate = LocalDate.parse(dates[1]);
        return ResponseEntity.ok(
                analyticsService.getPeakTimes(district, startDate, endDate, groupBy).toMap());
    }
}
