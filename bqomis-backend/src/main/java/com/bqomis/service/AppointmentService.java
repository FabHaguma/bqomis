package com.bqomis.service;

import com.bqomis.model.Appointment;
import com.bqomis.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bqomis.util.LookupUtil;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private LookupUtil lookupUtil;

    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }

    // MY OWN METHODS THAT DEALS WITH SPECIFIC APPOINTMENTS ACTIONS
    public List<Appointment> findAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findAppointmentsByDate(date);
    }

    public List<Appointment> findTodayAppointmentsByDistrict(String districtName) {
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByDistrict(districtName);
        LocalDate today = LocalDate.now();
        return appointmentRepository.findAppointmentsByDateAndBranchServiceIds(today, branchServiceIds);
    }

    public List<Appointment> findTodayAppointmentsByDistrictAndService(String districtName, Long serviceId) {
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByDistrictAndService(districtName, serviceId);
        return appointmentRepository.findAppointmentsByDateAndBranchServiceIds(LocalDate.now(), branchServiceIds);
    }

    public List<Appointment> findTodayAppointmentsByBranchAndService(Long branchId, Long serviceId) {
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByBranchAndService(branchId, serviceId);
        return appointmentRepository.findAppointmentsByDateAndBranchServiceIds(LocalDate.now(), branchServiceIds);
    }

    public List<Appointment> findTodayAppointmentsByBranch(Long branchId) {
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByBranchId(branchId);
        return appointmentRepository.findAppointmentsByDateAndBranchServiceIds(LocalDate.now(), branchServiceIds);
    }
}