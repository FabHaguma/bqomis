package com.bqomis.controller;

import com.bqomis.dto.AppointmentDTO;
import com.bqomis.dto.BatchAppointmentResponseDTO;
import com.bqomis.model.Appointment;
import com.bqomis.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDTO> getAppointmentById(@PathVariable Long id) {
        Optional<AppointmentDTO> appointment = appointmentService.findById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentDTO appointment) {
        AppointmentDTO savedAppointment = appointmentService.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @PostMapping("/batch")
    public ResponseEntity<BatchAppointmentResponseDTO> createMultipleAppointments(
            @RequestBody List<AppointmentDTO> appointments) {
        BatchAppointmentResponseDTO response = appointmentService.saveBatchAppointments(appointments);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        Appointment updatedAppointment = appointmentService.updateStatus(id, status);
        if (updatedAppointment != null) {
            return ResponseEntity.ok(updatedAppointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // MY OWN METHODS THAT DEALS WITH SPECIFIC APPOINTMENTS ACTIONS

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(@PathVariable String date) {
        // Assuming date is in the format "yyyy-MM-dd"
        LocalDate parsedDate = LocalDate.parse(date); // Uncomment if you want to parse the date
        List<Appointment> appointments = appointmentService.findAppointmentsByDate(parsedDate);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/today/district/{districtName}")
    public ResponseEntity<List<Appointment>> getTodayAppointmentsByDistrict(@PathVariable String districtName) {
        List<Appointment> appointments = appointmentService.findTodayAppointmentsByDistrict(districtName);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/today/branch/{branchId}")
    public ResponseEntity<List<Appointment>> getTodayAppointmentsByBranch(@PathVariable Long branchId) {
        List<Appointment> appointments = appointmentService.findTodayAppointmentsByBranch(branchId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/today/district/{districtName}/service/{serviceId}")
    public ResponseEntity<List<Appointment>> getTodayAppointmentsByService(@PathVariable String districtName,
            @PathVariable Long serviceId) {
        List<Appointment> appointments = appointmentService.findTodayAppointmentsByDistrictAndService(districtName,
                serviceId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/branch/{branchId}/")
    public ResponseEntity<List<Appointment>> getAppointmentsByBranchAndDate(@PathVariable Long branchId) {
        List<Appointment> appointments = appointmentService.findTodayAppointmentsByBranch(branchId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/date/branchServiceId/")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateAndBranchServiceId(@RequestParam String date,
            @RequestParam Long branchServiceId) {
        LocalDate parsedDate = LocalDate.parse(date);
        List<Appointment> appointments = appointmentService.findAppointmentsByDateAndBranchServiceId(parsedDate,
                branchServiceId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/date/branchId/")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateAndBranchId(@RequestParam String date,
            @RequestParam Long branchId) {
        LocalDate parsedDate = LocalDate.parse(date);
        List<Appointment> appointments = appointmentService.findAppointmentsByDateAndBranchId(parsedDate,
                branchId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByUserId(@PathVariable Long userId) {
        List<AppointmentDTO> appointmentDTOs = appointmentService.findAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointmentDTOs);
    }

    @GetMapping("/filtered")
    public ResponseEntity<Page<AppointmentDTO>> getFilteredAppointments(
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String districtName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AppointmentDTO> appointments = appointmentService.findFilteredAppointments(
                dateFrom, dateTo, branchId, serviceId, status, districtName, pageable);
        return ResponseEntity.ok(appointments);
    }

}
