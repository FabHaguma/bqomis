package com.bqomis.dto;

import lombok.Data;

@Data
public class AppointmentDTO {
    private Long id;
    private Long userId;
    private Long branchServiceId;
    private Long branchId;
    private String branchName;
    private Long serviceId;
    private String serviceName;
    private String date;
    private String time;
    private String status;
}
