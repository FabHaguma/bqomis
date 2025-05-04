package com.bqomis.service;

import com.bqomis.model.District;
import com.bqomis.repository.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bqomis.util.LookupUtil;
import java.util.List;

@Service
public class DistrictService {

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private LookupUtil lookupUtil;

    public List<District> findAll() {
        return districtRepository.findAll();
    }

    public District save(District district) {
        District savedDistrict = districtRepository.save(district);
        // Update the lookup utility with the new district
        lookupUtil.updateDistrict(savedDistrict);
        return savedDistrict;
    }

    public List<String> findByProvinceName(String provinceName) {
        List<String> districts = lookupUtil.getDistrictsByProvince(provinceName);
        return districts;
    }

    public void deleteById(Long id) {
        districtRepository.deleteById(id);
    }
}