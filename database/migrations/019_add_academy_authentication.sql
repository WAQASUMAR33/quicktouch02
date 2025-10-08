-- Migration: Add Academy Authentication Fields
-- Created: 2025-10-08
-- Description: Adds authentication and email verification fields to Academies table

-- Add password field (required)
ALTER TABLE Academies
MODIFY COLUMN email VARCHAR(150) NOT NULL UNIQUE,
ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN email_verification_token VARCHAR(255) NULL,
ADD COLUMN email_verification_expiry DATETIME NULL,
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry DATETIME NULL;

-- Add indexes for better performance
CREATE INDEX idx_academy_email_verification_token ON Academies(email_verification_token);
CREATE INDEX idx_academy_reset_token ON Academies(reset_token);
CREATE INDEX idx_academy_email_verified ON Academies(email_verified);

-- Update existing records to set a default password (should be changed immediately)
-- You may want to set this to a secure random value or require password reset
UPDATE Academies SET password = '$2b$10$defaultPasswordHashPlaceholder' WHERE password = '';

