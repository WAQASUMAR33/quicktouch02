-- Migration: Make created_by field nullable in Events table
-- This allows events to be created by academies without requiring a user_id reference

ALTER TABLE Events 
MODIFY COLUMN created_by INT NULL;

