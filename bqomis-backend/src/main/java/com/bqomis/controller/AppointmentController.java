package com.bqomis.controller;

import com.bqomis.dto.AppointmentDTO;
import com.bqomis.model.Appointment;
import com.bqomis.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        Optional<Appointment> appointment = appointmentService.findById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentDTO appointment) {
        Appointment savedAppointment = appointmentService.save(appointment);
        return ResponseEntity.ok(savedAppointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteById(id);
        return ResponseEntity.noContent().build();
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

}
