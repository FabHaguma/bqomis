package com.bqomis.dto;

import lombok.Data;

@Data
public class AppointmentDTO {
    private Long id;
    private Long userId;
    private Long branchServiceId;
    private String date;
    private String time;
    private String status;
}
