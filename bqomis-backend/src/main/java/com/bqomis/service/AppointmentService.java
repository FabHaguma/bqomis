package com.bqomis.service;

import com.bqomis.model.Appointment;
import com.bqomis.dto.AppointmentDTO;
import com.bqomis.dto.BatchAppointmentResponseDTO;
import com.bqomis.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.bqomis.util.LookupUtil;
import com.bqomis.util.MapperUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private LookupUtil lookupUtil;
    @Autowired
    private MapperUtil mapperUtil;

    public List<AppointmentDTO> findAll() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return mapperUtil.toAppointmentDTOList(appointments);
    }

    public Optional<AppointmentDTO> findById(Long id) {
        return appointmentRepository.findById(id).map(mapperUtil::toAppointmentDTO);
    }

    public AppointmentDTO save(AppointmentDTO appointmentDTO) {
        Appointment appointment = mapperUtil.toAppointment(appointmentDTO);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapperUtil.toAppointmentDTO(savedAppointment);
    }

    public List<AppointmentDTO> saveAll(List<AppointmentDTO> appointmentDTOs) {
        Set<Appointment> appointments = new HashSet<>();
        for (AppointmentDTO appointmentDTO : appointmentDTOs) {
            appointments.add(mapperUtil.toAppointment(appointmentDTO));
        }
        List<Appointment> savedAppointments = appointmentRepository.saveAll(appointments);
        return mapperUtil.toAppointmentDTOList(savedAppointments);
    }

    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment updateStatus(Long id, String status) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        } else {
            return null;
        }
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

    public List<Appointment> findAppointmentsByDateAndBranchServiceId(LocalDate date, Long branchServiceId) {
        return appointmentRepository.findAppointmentsByDateAndBranchServiceId(date, branchServiceId);
    }

    public List<Appointment> findAppointmentsByDateAndBranchId(LocalDate date, Long branchId) {
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByBranchId(branchId);
        return appointmentRepository.findAppointmentsByDateAndBranchServiceIds(date, branchServiceIds);
    }

    public List<AppointmentDTO> findAppointmentsByUserId(Long userId) {
        List<Appointment> appointments = appointmentRepository.findAppointmentsByUserId(userId);
        return mapperUtil.toAppointmentDTOList(appointments);
    }

    public Page<AppointmentDTO> findFilteredAppointments(String dateFrom, String dateTo, Long branchId, Long serviceId,
            String status, String districtName, Pageable pageable) {

        List<Appointment> allAppointments = getOptimalAppointmentList(dateFrom, dateTo, branchId,
                serviceId, districtName);
        System.out.println("All Appointments pulled optimally: " + allAppointments.size());

        List<Appointment> filtered = allAppointments.stream()
                .filter(a -> {
                    boolean matches = true;
                    if (dateFrom != null) {
                        matches &= !a.getDate().isBefore(LocalDate.parse(dateFrom));
                    }
                    if (dateTo != null) {
                        matches &= !a.getDate().isAfter(LocalDate.parse(dateTo));
                    }
                    if (branchId != null) {
                        Long[] ids = lookupUtil.getBranchIdAndServiceIdByBranchServiceId(a.getBranchServiceId());
                        matches &= ids[0].equals(branchId);
                    }
                    if (serviceId != null) {
                        Long[] ids = lookupUtil.getBranchIdAndServiceIdByBranchServiceId(a.getBranchServiceId());
                        matches &= ids[1].equals(serviceId);
                    }
                    if (status != null) {
                        matches &= status.equalsIgnoreCase(a.getStatus());
                    }
                    if (districtName != null) {
                        String district = lookupUtil.getDistrictByBranchId(
                                lookupUtil.getBranchIdAndServiceIdByBranchServiceId(a.getBranchServiceId())[0]);
                        matches &= districtName.equalsIgnoreCase(district);
                    }
                    return matches;
                })
                .collect(Collectors.toList());

        System.out.println("Filtered Appointments: " + filtered.size());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<AppointmentDTO> dtos = mapperUtil.toAppointmentDTOList(filtered.subList(start, end));
        return new PageImpl<>(dtos, pageable, filtered.size());
    }

    private List<Appointment> getOptimalAppointmentList(String dateFrom, String dateTo, Long branchId, Long serviceId,
            String districtName) {
        LocalDate startDate = dateFrom != null ? LocalDate.parse(dateFrom) : null;
        LocalDate endDate = dateTo != null ? LocalDate.parse(dateTo) : null;

        List<Long> branchServiceIds = new ArrayList<>();

        if (branchId != null && serviceId != null) {
            branchServiceIds = lookupUtil.getBranchServiceIdsByBranchAndService(branchId, serviceId);
        }

        if (branchServiceIds.isEmpty() && (districtName != null && serviceId != null)) {
            branchServiceIds = lookupUtil.getBranchServiceIdsByDistrictAndService(districtName, serviceId);
        }

        if (branchServiceIds.isEmpty() && branchId != null) {
            branchServiceIds = lookupUtil.getBranchServiceIdsByBranchId(branchId);
        }

        if (branchServiceIds.isEmpty() && serviceId != null) {
            branchServiceIds = lookupUtil.getBranchServiceIdsByServiceId(serviceId);
        }

        if (branchServiceIds.isEmpty() && districtName != null) {
            branchServiceIds = lookupUtil.getBranchServiceIdsByDistrict(districtName);
        }

        if (branchServiceIds.isEmpty()) {
            if (startDate != null && endDate != null) {
                return appointmentRepository.findAppointmentsByPeriod(startDate, endDate);
            } else if (startDate != null) {
                return appointmentRepository.findAppointmentsAfterOrEqualDate(startDate);
            } else if (endDate != null) {
                return appointmentRepository.findAppointmentsBeforeOrEqualDate(endDate);
            }
        } else {
            System.out.println("Branch Service IDs: " + branchServiceIds.size());
            if (startDate != null && endDate != null) {
                return appointmentRepository.findAppointmentsByPeriodAndBranchServiceIds(startDate, endDate,
                        branchServiceIds);
            } else if (startDate != null) {
                return appointmentRepository.findAppointmentsByDateAfterAndBranchServiceIds(startDate,
                        branchServiceIds);
            } else if (endDate != null) {
                return appointmentRepository.findAppointmentsByDateBeforeAndBranchServiceIds(endDate,
                        branchServiceIds);
            }
        }

        System.out.println("HAVE TO FIND ALL!");

        return appointmentRepository.findAll();
    }

    public BatchAppointmentResponseDTO saveBatchAppointments(List<AppointmentDTO> appointmentDTOs) {
        BatchAppointmentResponseDTO response = new BatchAppointmentResponseDTO();
        List<BatchAppointmentResponseDTO.Failure> failures = new ArrayList<>();
        int totalSubmitted = appointmentDTOs.size();
        int successfullyCreated = 0;

        for (int i = 0; i < appointmentDTOs.size(); i++) {
            AppointmentDTO appointmentDTO = appointmentDTOs.get(i);
            try {
                Appointment appointment = mapperUtil.toAppointment(appointmentDTO);
                appointmentRepository.save(appointment);
                successfullyCreated++;
            } catch (Exception e) {
                HashMap<String, Object> data = new HashMap<>();
                data.put("userId", appointmentDTO.getUserId());
                data.put("branchServiceId", appointmentDTO.getBranchServiceId());
                data.put("date", appointmentDTO.getDate());
                data.put("time", appointmentDTO.getTime());
                data.put("status", appointmentDTO.getStatus());
                failures.add(new BatchAppointmentResponseDTO.Failure(i, data, e.getMessage()));
            }
        }

        response.setTotalSubmitted(totalSubmitted);
        response.setSuccessfullyCreated(successfullyCreated);
        response.setFailedCount(failures.size());
        response.setFailures(failures);

        return response;
    }
}