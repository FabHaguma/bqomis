package com.bqomis.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bqomis.model.GlobalApplicationConfiguration;
import com.bqomis.model.BranchConfigurationOverrides;
import com.bqomis.repository.GlobalApplicationConfigurationRepository;

import jakarta.annotation.PostConstruct;

import com.bqomis.repository.BranchConfigurationOverridesRepository;

@Component
public class AppSettingsUtil {

    @Autowired
    private GlobalApplicationConfigurationRepository globalConfigRepo;

    @Autowired
    private BranchConfigurationOverridesRepository branchConfigRepo;

    private GlobalApplicationConfiguration globalConfig;
    private List<BranchConfigurationOverrides> branchConfigOverrides;

    @PostConstruct
    public void init() {
        globalConfig = globalConfigRepo.findAll().stream().findFirst().orElse(null);
        branchConfigOverrides = branchConfigRepo.findAll();
    }

    public GlobalApplicationConfiguration getGlobalConfig() {
        System.out.println("Global Config: " + globalConfig.toString());
        return globalConfig;
    }

    public List<BranchConfigurationOverrides> getBranchConfigOverrides() {
        return branchConfigOverrides;
    }

    public BranchConfigurationOverrides getBranchConfigOverrideByBranchId(Long branchId) {
        return branchConfigOverrides.stream()
                .filter(override -> override.getBranchId().equals(branchId))
                .findFirst()
                .orElse(null);
    }

    public void updateGlobalConfig(GlobalApplicationConfiguration newConfig) {
        this.globalConfig = newConfig;
        globalConfigRepo.save(newConfig);
    }

    public void updateBranchConfigOverrides(List<BranchConfigurationOverrides> newOverrides) {
        this.branchConfigOverrides = newOverrides;
        branchConfigRepo.saveAll(newOverrides);
    }

    public BranchConfigurationOverrides saveOrUpdateBranchConfigOverride(BranchConfigurationOverrides newOverride) {
        // If an override for this branch already exists, update it; otherwise, create
        // new
        BranchConfigurationOverrides existing = branchConfigOverrides.stream()
                .filter(override -> override.getBranchId().equals(newOverride.getBranchId()))
                .findFirst()
                .orElse(null);
        if (existing != null) {
            newOverride.setId(existing.getId()); // preserve the existing DB id
            branchConfigOverrides.remove(existing);
        }
        branchConfigOverrides.add(newOverride);
        branchConfigRepo.save(newOverride);
        return newOverride;
    }

    public void refresh() {
        globalConfig = globalConfigRepo.findAll().stream().findFirst().orElse(null);
        branchConfigOverrides = branchConfigRepo.findAll();
    }

}
