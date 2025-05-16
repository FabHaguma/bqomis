package com.bqomis.controller;

import com.bqomis.dto.BranchServiceDTO;
import com.bqomis.model.BranchService;
import com.bqomis.service.BranchServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/branch-services")
public class BranchServiceController {

    @Autowired
    private BranchServiceService branchServiceService;

    @GetMapping
    public ResponseEntity<List<BranchServiceDTO>> getAllBranchServices() {
        List<BranchServiceDTO> branchServices = branchServiceService.findAllBrancheServices();
        return ResponseEntity.ok(branchServices);
    }

    @PostMapping
    public ResponseEntity<BranchServiceDTO> createBranchService(@RequestBody BranchService branchService) {
        // Assuming you have a method to save the branch service in your service layer
        BranchServiceDTO savedBranchService = branchServiceService.save(branchService);
        return ResponseEntity.status(201).body(savedBranchService);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchServiceDTO> getBranchServiceById(@PathVariable Long id) {
        Optional<BranchServiceDTO> branchService = branchServiceService.findBrancheServiceById(id);
        return branchService.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<BranchServiceDTO>> getBranchServicesByBranchId(@PathVariable Long branchId) {
        List<BranchServiceDTO> branchServices = branchServiceService.findBrancheServiceByBranchId(branchId);
        return ResponseEntity.ok(branchServices);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranchServiceById(@PathVariable Long id) {
        branchServiceService.deleteBrancheServiceById(id);
        return ResponseEntity.noContent().build();
    }
}
