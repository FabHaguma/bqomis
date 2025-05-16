package com.bqomis.service;

import com.bqomis.dto.BranchServiceDTO;
import com.bqomis.model.BranchService;
import com.bqomis.repository.BranchServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bqomis.util.LookupUtil;
import com.bqomis.util.MapperUtil;
import java.util.List;
import java.util.Optional;

@Service
public class BranchServiceService {
    @Autowired
    private BranchServiceRepository branchServiceRepository;
    @Autowired
    private LookupUtil lookupUtil;
    @Autowired
    private MapperUtil mapperUtil;

    public List<BranchServiceDTO> findAllBrancheServices() {
        List<BranchService> branchServices = branchServiceRepository.findAll();
        return branchServices.stream()
                .map(mapperUtil::toBranchServiceDTO)
                .toList();
    }

    public Optional<BranchServiceDTO> findBrancheServiceById(Long id) {
        Optional<BranchService> branchService = branchServiceRepository.findById(id);
        return branchService.map(mapperUtil::toBranchServiceDTO);
    }

    public List<BranchServiceDTO> findBrancheServiceByBranchId(Long branchId) {
        List<Long> branchServiceIdList = lookupUtil.getBranchServiceIdsByBranchId(branchId);
        List<BranchService> branchService = branchServiceRepository.findByIdIn(branchServiceIdList);
        return branchService.stream().map(mapperUtil::toBranchServiceDTO).toList();
    }

    public BranchServiceDTO save(BranchService branchService) {
        BranchService savedBranchService = branchServiceRepository.save(branchService);
        lookupUtil.updateBranchService(savedBranchService);
        return mapperUtil.toBranchServiceDTO(savedBranchService);
    }

    public void deleteBrancheServiceById(Long id) {
        branchServiceRepository.deleteById(id);
    }
}
