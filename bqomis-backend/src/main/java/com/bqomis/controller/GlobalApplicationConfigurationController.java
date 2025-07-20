package com.bqomis.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.bqomis.model.GlobalApplicationConfiguration;
import com.bqomis.util.AppSettingsUtil;

@RestController
@RequestMapping("/api/settings/global")
public class GlobalApplicationConfigurationController {

    @Autowired
    private AppSettingsUtil appSettingsUtil;

    @GetMapping
    public ResponseEntity<GlobalApplicationConfiguration> getGlobalConfig() {
        GlobalApplicationConfiguration config = appSettingsUtil.getGlobalConfig();
        if (config == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(config);
    }

    @PutMapping
    public ResponseEntity<GlobalApplicationConfiguration> updateGlobalConfig(
            @RequestBody GlobalApplicationConfiguration newConfig) {
        appSettingsUtil.updateGlobalConfig(newConfig);
        return ResponseEntity.ok(newConfig);
    }
}
