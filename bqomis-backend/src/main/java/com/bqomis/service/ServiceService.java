package com.bqomis.service;

import com.bqomis.dto.ServiceDTO;
import com.bqomis.model.Service;
import com.bqomis.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.bqomis.util.LookupUtil;
import com.bqomis.util.MapperUtil;

import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private LookupUtil lookupUtil;
    @Autowired
    private MapperUtil mapperUtil;

    public List<ServiceDTO> findAll() {
        List<Service> services = lookupUtil.getAllServices();
        List<ServiceDTO> serviceDTOs = new ArrayList<>();
        for (Service service : services) {
            ServiceDTO serviceDTO = mapperUtil.toServiceDTO(service);
            serviceDTOs.add(serviceDTO);
        }
        return serviceDTOs;
    }

    public ServiceDTO findById(Long id) {
        // Check if the service is in the cache first
        Service cachedService = lookupUtil.getServiceById(id);
        return cachedService != null ? mapperUtil.toServiceDTO(cachedService) : null;
    }

    public ServiceDTO save(Service service) {
        Service savedService = serviceRepository.save(service);
        // update the service in the lookupUtil cache.
        lookupUtil.updateService(savedService);
        return mapperUtil.toServiceDTO(savedService);
    }

    public void deleteById(Long id) {
        serviceRepository.deleteById(id);
        // remove the service from the lookupUtil cache.
        lookupUtil.removeService(id);
    }

    public List<ServiceDTO> findByBranchId(Long branchId) {
        List<Service> services = lookupUtil.getServiceByBranchId(branchId);
        List<ServiceDTO> serviceDTOs = new ArrayList<>();
        for (Service service : services) {
            ServiceDTO serviceDTO = mapperUtil.toServiceDTO(service);
            serviceDTOs.add(serviceDTO);
        }
        return serviceDTOs;
    }
}