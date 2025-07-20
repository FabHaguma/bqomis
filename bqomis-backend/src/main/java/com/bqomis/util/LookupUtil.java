package com.bqomis.util;

import java.util.List;

import com.bqomis.model.Branch;
import com.bqomis.model.BranchService;
import com.bqomis.model.District;
import com.bqomis.model.Service;
import com.bqomis.repository.BranchRepository;
import com.bqomis.repository.BranchServiceRepository;
import com.bqomis.repository.DistrictRepository;
import com.bqomis.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Component
public class LookupUtil {

    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private BranchServiceRepository branchServiceRepository;

    // Maps for quick access
    private Map<String, String> provinceByDistrict = new HashMap<>();
    private Map<Long, Service> serviceMap = new HashMap<>();
    private Map<Long, Branch> branchMap = new HashMap<>();
    // private Map<Long, Long> branchIdByBSId = new HashMap<>();
    // private Map<Long, Long> serviceIdByBSId = new HashMap<>();
    private Map<String, Long> bsIdByBranchIdAndServiceId = new HashMap<>(); // (branchId +"-"+serviceId)
    private Map<Long, String> branchIdAndServiceIdByBsId = new HashMap<>(); // (branchId +"-"+serviceId)
    private Map<Long, List<Long>> serviceIdListByBranchId = new HashMap<>();

    @PostConstruct
    public void initialize() {
        // Load all districts for quick access
        List<District> districtList = districtRepository.findAll();

        // Load all branches and services for quick access
        List<Branch> branches = branchRepository.findAll();
        List<Service> services = serviceRepository.findAll();
        List<BranchService> branchServices = branchServiceRepository.findAll();

        // Populate the provinceByDistrict map
        for (District district : districtList) {
            provinceByDistrict.put(district.getName(), district.getProvince());
        }

        for (Branch branch : branches) {
            branchMap.put(branch.getId(), branch);
        }

        for (Service service : services) {
            serviceMap.put(service.getId(), service);
        }

        for (BranchService bs : branchServices) {
            // Create a unique string key for branch and service combination
            String key = bs.getBranchId() + "-" + bs.getServiceId();
            bsIdByBranchIdAndServiceId.put(key, bs.getId());
            branchIdAndServiceIdByBsId.put(bs.getId(), key);
        }

        for (Branch branch : branches) {
            List<Long> serviceIds = new ArrayList<>();
            for (BranchService bs : branchServices) {
                if (bs.getBranchId().equals(branch.getId())) {
                    serviceIds.add(bs.getServiceId());
                }
            }
            serviceIdListByBranchId.put(branch.getId(), serviceIds);
        }

    }

    public String getBranchNameById(Long id) {
        Branch branch = branchMap.get(id);
        return branch != null ? branch.getName() : null;
    }

    public String getServiceNameById(Long id) {
        Service service = serviceMap.get(id);
        return service != null ? service.getName() : null;
    }

    public Service getServiceById(Long id) {
        return serviceMap.get(id);
    }

    public String getDistrictByBranchId(Long branchId) {
        Branch branch = branchMap.get(branchId);
        return branch != null ? branch.getDistrict() : null;
    }

    public String getProvinceByDistrict(String district) {
        return provinceByDistrict.get(district);
    }

    public Branch getBranchById(Long id) {
        return branchMap.get(id);
    }

    public List<Branch> findBranchesByDistrictName(String districtName) {
        List<Branch> brancheList = new ArrayList<>();
        for (Branch branch : branchMap.values()) {
            if (branch.getDistrict().equalsIgnoreCase(districtName)) {
                brancheList.add(branch);
            }
        }
        return brancheList;
    }

    public void updateBranch(Branch branch) {
        branchMap.put(branch.getId(), branch);
    }

    public void removeBranchById(Long id) {
        branchMap.remove(id);
    }

    public List<String> getAllDistrictStrings() {
        return new ArrayList<>(provinceByDistrict.keySet());
    }

    public List<String> getDistrictsByProvince(String province) {
        List<String> districts = new ArrayList<>();
        for (Map.Entry<String, String> entry : provinceByDistrict.entrySet()) {
            if (entry.getValue().equals(province)) {
                districts.add(entry.getKey());
            }
        }
        return districts;
    }

    public List<String> getProvinces() {
        List<String> provinces = new ArrayList<>();
        for (String province : provinceByDistrict.values()) {
            if (!provinces.contains(province)) {
                provinces.add(province);
            }
        }
        return provinces;
    }

    public void updateDistrict(District district) {
        provinceByDistrict.put(district.getName(), district.getProvince());
    }

    public List<Service> getAllServices() {
        return new ArrayList<>(serviceMap.values());
    }

    public void updateService(Service service) {
        serviceMap.put(service.getId(), service);
    }

    public void removeService(Long id) {
        serviceMap.remove(id);
    }

    public void updateBranchService(BranchService branchService) {
        // Update the branch service ID map with the new branch and service IDs
        String key = branchService.getBranchId() + "-" + branchService.getServiceId();
        bsIdByBranchIdAndServiceId.put(key, branchService.getId());
        branchIdAndServiceIdByBsId.put(branchService.getId(), key);

        List<Long> serviceIds = serviceIdListByBranchId.get(branchService.getBranchId());
        if (serviceIds == null) {
            serviceIds = new ArrayList<>();
        }
        serviceIds.add(branchService.getServiceId());
        serviceIdListByBranchId.put(branchService.getBranchId(), serviceIds);
    }

    public List<Service> getServiceByBranchId(Long branchId) {
        List<Service> services = new ArrayList<>();
        List<Long> serviceIds = serviceIdListByBranchId.get(branchId);
        if (serviceIds != null) {
            for (Long serviceId : serviceIds) {
                Service service = serviceMap.get(serviceId);
                if (service != null) {
                    services.add(service);
                }
            }
        }
        return services;
    }

    public List<Long> getBranchServiceIdsByDistrict(String districtName) {
        List<Long> branchServiceIds = new ArrayList<>();
        List<Branch> branchList = findBranchesByDistrictName(districtName);
        //
        for (Branch branch : branchList) {
            List<Long> serviceIds = serviceIdListByBranchId.get(branch.getId());
            if (serviceIds != null && !serviceIds.isEmpty()) {
                // Iterate through the service IDs and find the corresponding branch service IDs
                for (Long serviceId : serviceIds) {
                    String key = branch.getId() + "-" + serviceId;
                    Long branchServiceId = bsIdByBranchIdAndServiceId.get(key);
                    if (branchServiceId != null) {
                        branchServiceIds.add(branchServiceId);
                    }
                }
            }
        }
        return branchServiceIds;
    }

    public List<Long> getBranchServiceIdsByDistrictAndService(String districtName, Long serviceId) {
        List<Long> branchServiceIds = new ArrayList<>();
        List<Branch> branchList = findBranchesByDistrictName(districtName);
        for (Branch branch : branchList) {
            String key = branch.getId() + "-" + serviceId;
            Long branchServiceId = bsIdByBranchIdAndServiceId.get(key);
            if (branchServiceId != null) {
                branchServiceIds.add(branchServiceId);
            }
        }
        return branchServiceIds;
    }

    public List<Long> getBranchServiceIdsByBranchAndService(Long branchId, Long serviceId) {
        List<Long> branchServiceIds = new ArrayList<>();
        String key = branchId + "-" + serviceId;
        Long branchServiceId = bsIdByBranchIdAndServiceId.get(key);
        if (branchServiceId != null) {
            branchServiceIds.add(branchServiceId);
        }
        return branchServiceIds;
    }

    public List<Long> getBranchServiceIdsByBranchId(Long branchId) {
        List<Long> branchServiceIds = new ArrayList<>();
        List<Long> serviceIds = serviceIdListByBranchId.get(branchId);
        if (serviceIds != null) {
            for (Long serviceId : serviceIds) {
                String key = branchId + "-" + serviceId;
                Long branchServiceId = bsIdByBranchIdAndServiceId.get(key);
                if (branchServiceId != null) {
                    branchServiceIds.add(branchServiceId);
                }
            }
        }
        return branchServiceIds;
    }

    public List<Long> getBranchServiceIdsByServiceId(Long serviceId) {
        List<Long> branchServiceIds = new ArrayList<>();
        for (Map.Entry<String, Long> entry : bsIdByBranchIdAndServiceId.entrySet()) {
            String key = entry.getKey();
            String[] parts = key.split("-");
            if (Long.parseLong(parts[1]) == serviceId) {
                branchServiceIds.add(entry.getValue());
            }
        }
        return branchServiceIds;
    }

    public Long[] getBranchIdAndServiceIdByBranchServiceId(Long branchServiceId) {
        Long[] ids = new Long[2];
        String key = branchIdAndServiceIdByBsId.get(branchServiceId);
        if (key != null) {
            String[] parts = key.split("-");
            ids[0] = Long.parseLong(parts[0]); // Branch ID
            ids[1] = Long.parseLong(parts[1]); // Service ID
        }
        return ids;
    }

}
