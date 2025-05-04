package com.bqomis.dto;

import lombok.Data;

@Data
public class BranchDTO {
    private Long id;
    private String name;
    private String address;
    private String district;
    private String province;
}