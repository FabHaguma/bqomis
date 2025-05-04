package com.bqomis.controller;

import com.bqomis.model.District;
import com.bqomis.service.DistrictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    @Autowired
    private DistrictService districtService;

    @GetMapping
    public ResponseEntity<List<District>> getAllDistricts() {
        return ResponseEntity.ok(districtService.findAll());
    }

    @GetMapping("/{provinceName}")
    public ResponseEntity<List<String>> getDistrictById(@PathVariable String provinceName) {
        return ResponseEntity.ok(districtService.findByProvinceName(provinceName));
    }

    @PostMapping
    public ResponseEntity<District> createDistrict(@RequestBody District district) {
        return ResponseEntity.ok(districtService.save(district));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistrict(@PathVariable Long id) {
        districtService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}