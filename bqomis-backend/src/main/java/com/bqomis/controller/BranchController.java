package com.bqomis.controller;

import com.bqomis.dto.BranchDTO;
import com.bqomis.model.Branch;
import com.bqomis.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @GetMapping
    public ResponseEntity<List<BranchDTO>> getAllBranches() {
        List<BranchDTO> branchDTOs = branchService.findAll();
        return ResponseEntity.ok(branchDTOs);
    }

    @GetMapping("/district/{districtName}")
    public ResponseEntity<List<BranchDTO>> getBranchesByDistrict(@PathVariable String districtName) {
        List<BranchDTO> branchDTOs = branchService.findByDistrictName(districtName);
        return ResponseEntity.ok(branchDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchDTO> getBranchById(@PathVariable Long id) {
        Optional<BranchDTO> branchDTOOptional = branchService.getBranchDTOById(id);
        if (!branchDTOOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(branchDTOOptional.get());
    }

    @PostMapping
    public ResponseEntity<BranchDTO> createBranch(@RequestBody Branch branch) {
        return ResponseEntity.ok(branchService.save(branch));
    }

    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable Long id) {
        branchService.deleteById(id);
    }
}