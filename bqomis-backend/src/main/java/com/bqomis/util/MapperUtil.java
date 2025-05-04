package com.bqomis.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bqomis.dto.BranchDTO;
import com.bqomis.dto.BranchServiceDTO;
import com.bqomis.model.Service;
import com.bqomis.dto.ServiceDTO;
import com.bqomis.dto.UserDTO;
import com.bqomis.model.Branch;
import com.bqomis.model.BranchService;
import com.bqomis.model.User;
import com.bqomis.util.LookupUtil;

@Component
public class MapperUtil {

    @Autowired
    private LookupUtil lookupUtil;

    public UserDTO toUserDTO(User user) {
        if (user == null) {
            return null;
        }
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setProfilePicture(user.getProfilePicture());
        // Assuming password is not to be included in the DTO for security reasons
        return userDTO;
    }

    public BranchDTO toBranchDTO(Branch branch) {
        if (branch == null) {
            return null;
        }
        BranchDTO branchDTO = new BranchDTO();
        branchDTO.setId(branch.getId());
        branchDTO.setName(branch.getName());
        branchDTO.setAddress(branch.getAddress());
        branchDTO.setDistrict(branch.getDistrict());
        branchDTO.setProvince(branch.getProvince());
        return branchDTO;
    }

    public BranchServiceDTO toBranchServiceDTO(BranchService branchService) {
        if (branchService == null) {
            return null;
        }
        BranchServiceDTO branchServiceDTO = new BranchServiceDTO();
        branchServiceDTO.setId(branchService.getId());
        branchServiceDTO.setBranchId(branchService.getBranchId());
        branchServiceDTO.setServiceId(branchService.getServiceId());
        String branchName = lookupUtil.getBranchNameById(branchService.getBranchId());
        String serviceName = lookupUtil.getServiceNameById(branchService.getServiceId());
        String district = lookupUtil.getDistrictByBranchId(branchService.getBranchId());
        branchServiceDTO.setBranchName(branchName);
        branchServiceDTO.setServiceName(serviceName);
        branchServiceDTO.setDistrict(district);

        return branchServiceDTO;
    }

    public ServiceDTO toServiceDTO(Service service) {
        if (service == null) {
            return null;
        }
        ServiceDTO serviceDTO = new ServiceDTO();
        serviceDTO.setId(service.getId());
        serviceDTO.setName(service.getName());
        serviceDTO.setDescription(service.getDescription());
        return serviceDTO;
    }
}
