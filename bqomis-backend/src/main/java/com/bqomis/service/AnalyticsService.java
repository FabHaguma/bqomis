package com.bqomis.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bqomis.util.LookupUtil;
import com.bqomis.model.Appointment;
import com.bqomis.repository.AppointmentRepository;

@Service
public class AnalyticsService {

    @Autowired
    private LookupUtil lookupUtil;
    @Autowired
    private AppointmentRepository appointmentRepository;

    // Returns overall summary stats (total appointments, by status, etc.) for the
    // given period
    public JSONObject getAppointmentsByBranch(Long branchId, LocalDate startDate, LocalDate endDate) {

        String branchName = lookupUtil.getBranchNameById(branchId);
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByBranchId(branchId);

        // Prepare service info map: serviceId -> {name, completed, cancelled, no_show}
        class ServiceStats {
            Long serviceId;
            String serviceName;
            int completed = 0;
            int cancelled = 0;
            int noShow = 0;

            ServiceStats(Long serviceId, String serviceName) {
                this.serviceId = serviceId;
                this.serviceName = serviceName;
            }
        }

        // Map serviceId to stats
        java.util.Map<Long, ServiceStats> serviceStatsMap = new java.util.HashMap<>();
        for (Long branchServiceId : branchServiceIds) {
            Long[] ids = lookupUtil.getBranchIdAndServiceIdByBranchServiceId(branchServiceId);
            Long serviceId = ids[1];
            String serviceName = lookupUtil.getServiceNameById(serviceId);
            serviceStatsMap.put(serviceId, new ServiceStats(serviceId, serviceName));
        }

        // Get appointments for the period and branch services
        List<Appointment> appointmentList = appointmentRepository.findAppointmentsByPeriodAndBranchServiceIds(
                startDate, endDate, branchServiceIds);

        for (Appointment appointment : appointmentList) {
            Long[] ids = lookupUtil.getBranchIdAndServiceIdByBranchServiceId(appointment.getBranchServiceId());
            Long serviceId = ids[1];
            ServiceStats stats = serviceStatsMap.get(serviceId);
            if (stats != null) {
                String status = appointment.getStatus();
                if ("COMPLETED".equals(status)) {
                    stats.completed++;
                } else if ("CANCELLED".equals(status)) {
                    stats.cancelled++;
                } else if ("NO_SHOW".equals(status)) {
                    stats.noShow++;
                }
            }
        }

        // Build JSON result
        org.json.JSONObject result = new org.json.JSONObject();
        result.put("branchId", branchId);
        result.put("branchName", branchName);
        result.put("appointmentCount", appointmentList.size());

        org.json.JSONArray servicesArray = new org.json.JSONArray();
        for (ServiceStats stats : serviceStatsMap.values()) {
            org.json.JSONObject serviceObj = new org.json.JSONObject();
            serviceObj.put("serviceId", stats.serviceId);
            serviceObj.put("serviceName", stats.serviceName);
            serviceObj.put("completed", stats.completed);
            serviceObj.put("cancelled", stats.cancelled);
            serviceObj.put("no_show", stats.noShow);
            servicesArray.put(serviceObj);
        }
        result.put("services", servicesArray);

        // You can return or log result.toString()
        // System.out.println(result.toString());
        return result;
    }

    // Returns appointment counts grouped by service for the given period
    public JSONObject getAppointmentsByService(String district, Long serviceId, LocalDate startDate,
            LocalDate endDate) {
        // Get all branchServiceIds for this service in the district
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByDistrictAndService(district, serviceId);

        // Get appointments for the period and these branchServiceIds
        List<Appointment> appointmentList = appointmentRepository.findAppointmentsByPeriodAndBranchServiceIds(
                startDate, endDate, branchServiceIds);

        int completed = 0;
        int cancelled = 0;
        int noShow = 0;

        // Count appointment statuses
        for (Appointment appointment : appointmentList) {
            String status = appointment.getStatus();
            if ("COMPLETED".equals(status)) {
                completed++;
            } else if ("CANCELLED".equals(status)) {
                cancelled++;
            } else if ("NO_SHOW".equals(status)) {
                noShow++;
            }
        }

        // Build JSON result
        JSONObject result = new JSONObject();
        result.put("district", district);
        result.put("serviceId", serviceId);
        result.put("serviceName", lookupUtil.getServiceNameById(serviceId));
        result.put("appointmentCount", appointmentList.size());
        result.put("completed", completed);
        result.put("cancelled", cancelled);
        result.put("no_show", noShow);

        return result;
    }

    // Shared private method for grouping and counting appointments
    private org.json.JSONArray getPeakTimesArray(List<Appointment> appointmentList, String groupBy) {
        java.util.Map<Integer, Integer> countMap = new java.util.HashMap<>();
        if ("hour".equalsIgnoreCase(groupBy)) {
            for (Appointment appointment : appointmentList) {
                int hour = appointment.getTime().getHour();
                countMap.put(hour, countMap.getOrDefault(hour, 0) + 1);
            }
        } else if ("dayOfWeek".equalsIgnoreCase(groupBy)) {
            for (Appointment appointment : appointmentList) {
                int dayOfWeek = appointment.getDate().getDayOfWeek().getValue();
                countMap.put(dayOfWeek, countMap.getOrDefault(dayOfWeek, 0) + 1);
            }
        }
        List<java.util.Map.Entry<Integer, Integer>> sortedList = new ArrayList<>(countMap.entrySet());
        sortedList.sort((a, b) -> b.getValue().compareTo(a.getValue()));
        org.json.JSONArray resultArray = new org.json.JSONArray();
        for (java.util.Map.Entry<Integer, Integer> entry : sortedList) {
            org.json.JSONObject obj = new org.json.JSONObject();
            if ("hour".equalsIgnoreCase(groupBy)) {
                obj.put("hour", entry.getKey());
            } else {
                obj.put("dayOfWeek", entry.getKey());
            }
            obj.put("count", entry.getValue());
            resultArray.put(obj);
        }
        return resultArray;
    }

    // Returns appointment counts grouped by hour or day of week for the given
    // period
    public JSONObject getPeakTimes(LocalDate startDate,
            LocalDate endDate, String groupBy) {
        List<Appointment> appointmentList = appointmentRepository
                .findAppointmentsByPeriod(startDate, endDate);
        org.json.JSONArray resultArray = getPeakTimesArray(appointmentList, groupBy);
        org.json.JSONObject result = new org.json.JSONObject();
        result.put("groupBy", groupBy);
        result.put("peakTimes", resultArray);
        return result;
    }

    // Returns appointment counts grouped by hour or day of week for the given
    // period and district
    public JSONObject getPeakTimes(String district, LocalDate startDate,
            LocalDate endDate, String groupBy) {
        List<Long> branchServiceIds = lookupUtil.getBranchServiceIdsByDistrict(district);
        List<Appointment> appointmentList = appointmentRepository.findAppointmentsByPeriodAndBranchServiceIds(
                startDate, endDate, branchServiceIds);
        org.json.JSONArray resultArray = getPeakTimesArray(appointmentList, groupBy);
        org.json.JSONObject result = new org.json.JSONObject();
        result.put("district", district);
        result.put("groupBy", groupBy);
        result.put("peakTimes", resultArray);
        return result;
    }

}
