package com.bqomis.repository;

import com.bqomis.model.BranchService;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchServiceRepository extends JpaRepository<BranchService, Long> {
    // Additional query methods can be defined here if needed
    // For example, if you want to find BranchService by branchId
    // List<BranchService> findByBranchId(Long branchId);
    List<BranchService> findByIdIn(List<Long> ids);
}