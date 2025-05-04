package com.bqomis.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "branch_services")
public class BranchService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "branch_id", nullable = false)
    private Long branchId;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

}
