-- Migration: Update Events Table
-- Created: 2024-01-01
-- Description: Updates the Events table with new fields for enhanced event management

-- Add new columns to Events table
ALTER TABLE Events 
ADD COLUMN event_time VARCHAR(20) AFTER event_date,
ADD COLUMN status ENUM('Pending', 'Complete') DEFAULT 'Pending' AFTER description;

-- Update existing EventType enum to include new values
ALTER TABLE Events 
MODIFY COLUMN type ENUM('training','match','Trial','Showcase','GuestSessions') NOT NULL;

-- Add index for better performance
ALTER TABLE Events 
ADD INDEX idx_status (status),
ADD INDEX idx_event_time (event_time);

-- Update existing records to have default status
UPDATE Events 
SET status = 'Complete' 
WHERE status IS NULL;
