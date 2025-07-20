package com.bqomis.repository;

import com.bqomis.model.GlobalApplicationConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalApplicationConfigurationRepository extends JpaRepository<GlobalApplicationConfiguration, Long> {
}
