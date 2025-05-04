package com.bqomis.repository;

import com.bqomis.model.BranchService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BranchServiceRepository extends JpaRepository<BranchService, Long> {
    // Additional query methods can be defined here if needed
}