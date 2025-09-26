-- Migration: Create Academies Table
-- Created: 2024-01-01
-- Description: Creates the Academies table for football academies

CREATE TABLE IF NOT EXISTS Academies (
    academy_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(150),
    website VARCHAR(255),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
);

-- Add foreign key constraint to Users table
ALTER TABLE Users 
ADD CONSTRAINT fk_users_academy 
FOREIGN KEY (academy_id) REFERENCES Academies(academy_id) ON DELETE SET NULL;
