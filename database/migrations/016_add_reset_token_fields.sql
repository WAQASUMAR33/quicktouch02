-- Migration: Add Password Reset Token Fields
-- Created: 2025-10-07
-- Description: Adds reset_token and reset_token_expiry fields to Users table for password reset functionality

ALTER TABLE Users
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;

-- Add index for faster lookups
CREATE INDEX idx_reset_token ON Users(reset_token);

