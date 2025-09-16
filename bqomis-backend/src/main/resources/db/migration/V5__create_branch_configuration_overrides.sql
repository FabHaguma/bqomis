-- V5: Create branch_configuration_overrides table to match JPA entity BranchConfigurationOverrides
-- This table stores per-branch override settings. All nullable columns fall back to global settings when NULL.

BEGIN;

CREATE TABLE IF NOT EXISTS branch_configuration_overrides (
    id BIGSERIAL PRIMARY KEY,
    branch_id BIGINT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    queue_threshold_low INT NULL,
    queue_threshold_moderate INT NULL,
    slot_duration_mins INT NULL,
    max_appointments_per_slot INT NULL,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index to quickly fetch overrides for a given branch
CREATE INDEX IF NOT EXISTS idx_bco_branch_id ON branch_configuration_overrides(branch_id);

-- Optional: enforce single row per branch (uncomment if desired)
-- CREATE UNIQUE INDEX IF NOT EXISTS ux_bco_single_per_branch ON branch_configuration_overrides(branch_id);

-- Trigger to auto-update last_updated on modification
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'bco_set_last_updated') THEN
        CREATE OR REPLACE FUNCTION bco_set_last_updated()
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
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_bco_set_last_updated'
    ) THEN
        CREATE TRIGGER trg_bco_set_last_updated
        BEFORE UPDATE ON branch_configuration_overrides
        FOR EACH ROW EXECUTE FUNCTION bco_set_last_updated();
    END IF;
END$$;

COMMIT;
