package com.bqomis.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bqomis.model.BranchConfigurationOverrides;

import java.util.List;

@Repository
public interface BranchConfigurationOverridesRepository extends JpaRepository<BranchConfigurationOverrides, Long> {

    @Query("SELECT b FROM BranchConfigurationOverrides b WHERE b.branchId = :branchId")
    List<BranchConfigurationOverrides> findByBranchId(@Param("branchId") Long branchId);
}
