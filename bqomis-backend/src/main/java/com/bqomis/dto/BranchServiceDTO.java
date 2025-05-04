package com.bqomis.dto;

import lombok.Data;

@Data
public class BranchServiceDTO {

    private Long id;
    private Long branchId;
    private Long serviceId;
    private String branchName;
    private String serviceName;
    private String district;
}
