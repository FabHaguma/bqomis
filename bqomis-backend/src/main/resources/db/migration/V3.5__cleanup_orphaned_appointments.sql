-- V3.5: Cleanup orphaned appointments before schema changes in V4
-- This script deletes any records from the 'appointments' table that have a 'branch_service_id'
-- which does not exist in the 'branch_services' table. This prevents foreign key constraint
-- violations during the V4 migration, which alters and recreates constraints.

DELETE FROM appointments
WHERE branch_service_id NOT IN (SELECT id FROM branch_services);
