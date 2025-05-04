package com.bqomis.service;

import com.bqomis.model.Branch;
import com.bqomis.dto.BranchDTO;
import com.bqomis.repository.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bqomis.util.LookupUtil;
import com.bqomis.util.MapperUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private LookupUtil lookupUtil;
    @Autowired
    private MapperUtil mapperUtil;

    public List<BranchDTO> findAll() {
        List<Branch> branches = branchRepository.findAll();
        List<BranchDTO> branchDTOs = new ArrayList<>();
        for (Branch branch : branches) {
            BranchDTO branchDTO = mapperUtil.toBranchDTO(branch);
            if (branchDTO != null) {
                branchDTOs.add(branchDTO);
            }
        }
        return branchDTOs;
    }

    public List<BranchDTO> findByDistrictName(String districtName) {
        List<Branch> branches = lookupUtil.findBranchesByDistrictName(districtName);
        List<BranchDTO> branchDTOs = new ArrayList<>();
        for (Branch branch : branches) {
            BranchDTO branchDTO = mapperUtil.toBranchDTO(branch);
            if (branchDTO != null) {
                branchDTOs.add(branchDTO);
            }
        }
        return branchDTOs;
    }

    public Optional<BranchDTO> getBranchDTOById(Long id) {
        Branch branch = lookupUtil.getBranchById(id);
        if (branch != null) {
            return Optional.of(mapperUtil.toBranchDTO(branch));
        }
        return Optional.empty();
    }

    public BranchDTO save(Branch branch) {
        Branch savedBranch = branchRepository.save(branch);
        // update the branch in the lookupUtil cache.
        lookupUtil.updateBranch(savedBranch);
        return mapperUtil.toBranchDTO(savedBranch);
    }

    public void deleteById(Long id) {
        branchRepository.deleteById(id);
        // remove the branch from the lookupUtil cache.
        lookupUtil.removeBranchById(id);
    }
}