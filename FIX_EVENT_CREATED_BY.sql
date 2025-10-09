-- Run this SQL directly on your database to fix the event creation issue
-- This makes the created_by field nullable so events can be created without user reference

ALTER TABLE Events 
MODIFY COLUMN created_by INT NULL;

-- Verify the change
DESCRIBE Events;

