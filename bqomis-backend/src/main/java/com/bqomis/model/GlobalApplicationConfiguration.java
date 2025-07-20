package com.bqomis.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;

import jakarta.persistence.*;

@Data
@Entity
@Table(name = "global_application_configuration")
@NoArgsConstructor
public class GlobalApplicationConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_window_days", nullable = false)
    private Integer bookingWindowDays; // Max days in advance a client can book.

    @Column(name = "min_booking_notice_hours", nullable = false)
    private Integer minBookingNoticeHours; // Min hours before appointment for booking.

    @Column(name = "default_queue_threshold_low", nullable = false)
    private Integer defaultQueueThresholdLow; // Max appts/hr for LOW traffic.

    @Column(name = "default_queue_threshold_moderate", nullable = false)
    private Integer defaultQueueThresholdModerate; // Max appts/hr for MODERATE traffic.

    @Column(name = "default_slot_duration_mins", nullable = false)
    private Integer defaultSlotDurationMins; // Default slot duration in minutes.

    @Column(name = "default_allow_cancellation_hours", nullable = false)
    private Integer allowCancellationHours; // Min hours before appointment for cancellation.

    @Column(name = "maintenance_mode_enabled", nullable = false)
    private Boolean maintenanceModeEnabled; // Is maintenance mode active?

    @Column(name = "last_updated", columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private ZonedDateTime lastUpdated;

}
