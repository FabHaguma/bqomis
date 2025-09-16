-- V6: Create global_application_configuration table for GlobalApplicationConfiguration entity
-- Stores system-wide booking & scheduling defaults.

BEGIN;

CREATE TABLE IF NOT EXISTS global_application_configuration (
    id BIGSERIAL PRIMARY KEY,
    booking_window_days INT NOT NULL,
    min_booking_notice_hours INT NOT NULL,
    default_queue_threshold_low INT NOT NULL,
    default_queue_threshold_moderate INT NOT NULL,
    default_slot_duration_mins INT NOT NULL,
    default_allow_cancellation_hours INT NOT NULL,
    maintenance_mode_enabled BOOLEAN NOT NULL,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Optional: enforce single-row semantics if you only expect one global config row
-- Uncomment the next two lines to ensure at most one row exists
-- CREATE UNIQUE INDEX IF NOT EXISTS ux_gac_single_row ON global_application_configuration((true));
-- ALTER TABLE global_application_configuration ADD CONSTRAINT chk_gac_single_row CHECK ( (SELECT COUNT(*) FROM global_application_configuration) <= 1 );

-- Trigger to update last_updated timestamp on modification
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'gac_set_last_updated') THEN
        CREATE OR REPLACE FUNCTION gac_set_last_updated()
        RETURNS TRIGGER AS $f$
        BEGIN
            NEW.last_updated = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $f$ LANGUAGE plpgsql;
    END IF;
END$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_gac_set_last_updated'
    ) THEN
        CREATE TRIGGER trg_gac_set_last_updated
        BEFORE UPDATE ON global_application_configuration
        FOR EACH ROW EXECUTE FUNCTION gac_set_last_updated();
    END IF;
END$$;

COMMIT;
