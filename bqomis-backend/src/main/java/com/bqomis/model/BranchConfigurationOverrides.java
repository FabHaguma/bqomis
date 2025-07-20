package com.bqomis.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Data
@Entity
@Table(name = "branch_configuration_overrides")
@NoArgsConstructor
public class BranchConfigurationOverrides {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique ID for the override record.

    @Column(name = "branch_id", nullable = false)
    private Long branchId; // The branch these settings apply to.

    @Column(name = "queue_threshold_low")
    private Integer queueThresholdLow; // Branch-specific low queue threshold. NULL means use global.

    @Column(name = "queue_threshold_moderate")
    private Integer queueThresholdModerate; // Branch-specific moderate queue threshold. NULL means use global.

    @Column(name = "slot_duration_mins")
    private Integer slotDurationMins; // Branch-specific slot duration. NULL means use global.

    @Column(name = "max_appointments_per_slot")
    private Integer maxAppointmentsPerSlot; // Max appointments per slot for this branch (could be per service link
                                            // too).

    @Column(name = "last_updated", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private ZonedDateTime lastUpdated; // When this override was last modified.
}
