-- Migration V4: Normalize foreign key integer sizes to BIGINT for scalability
-- and to align with entity field types (Long) used in JPA.
-- This migration converts integer-based FK columns to BIGINT where referenced
-- primary keys were created as BIGSERIAL (BIGINT).

-- 1. Ensure prior transactions complete
BEGIN;

-- Appointments.branch_service_id -> BIGINT
-- Drop FK first (constraint name is auto-generated; we find and drop dynamically)
DO $$
DECLARE
    fk_name text;
BEGIN
    SELECT tc.constraint_name INTO fk_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'appointments'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'branch_service_id'
    LIMIT 1;
    IF fk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE appointments DROP CONSTRAINT %I', fk_name);
    END IF;
END$$;

-- Alter column type (cast existing data)
ALTER TABLE appointments
    ALTER COLUMN branch_service_id TYPE BIGINT USING branch_service_id::bigint;

-- Also adjust user_id if needed (users.id is BIGSERIAL already)
DO $$
BEGIN
    -- Only change if current type is integer
    IF (SELECT data_type FROM information_schema.columns WHERE table_name='appointments' AND column_name='user_id') = 'integer' THEN
        ALTER TABLE appointments ALTER COLUMN user_id TYPE BIGINT USING user_id::bigint;
    END IF;
END$$;

-- Adjust branch_services FK columns if they are still INT
DO $$
BEGIN
    IF (SELECT data_type FROM information_schema.columns WHERE table_name='branch_services' AND column_name='branch_id') = 'integer' THEN
        ALTER TABLE branch_services ALTER COLUMN branch_id TYPE BIGINT USING branch_id::bigint;
    END IF;
    IF (SELECT data_type FROM information_schema.columns WHERE table_name='branch_services' AND column_name='service_id') = 'integer' THEN
        ALTER TABLE branch_services ALTER COLUMN service_id TYPE BIGINT USING service_id::bigint;
    END IF;
END$$;

-- Recreate foreign keys with consistent BIGINT types
ALTER TABLE appointments
    ADD CONSTRAINT fk_appointments_branch_service_id FOREIGN KEY (branch_service_id) REFERENCES branch_services(id) ON DELETE CASCADE;

-- (Re)create FKs for altered branch_services columns if they were dropped implicitly
DO $$
DECLARE
    fk_branch_id_exists boolean;
    fk_service_id_exists boolean;
BEGIN
    -- Recreate branch_id FK if missing
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name='branch_services' AND tc.constraint_type='FOREIGN KEY' AND kcu.column_name='branch_id'
    ) INTO fk_branch_id_exists;
    IF NOT fk_branch_id_exists THEN
        ALTER TABLE branch_services ADD CONSTRAINT fk_branch_services_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE;
    END IF;

    -- Recreate service_id FK if missing
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name='branch_services' AND tc.constraint_type='FOREIGN KEY' AND kcu.column_name='service_id'
    ) INTO fk_service_id_exists;
    IF NOT fk_service_id_exists THEN
        ALTER TABLE branch_services ADD CONSTRAINT fk_branch_services_service_id FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;
    END IF;
END$$;

COMMIT;
