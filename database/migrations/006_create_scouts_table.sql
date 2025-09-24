-- Migration: Create Scouts Table
-- Created: 2024-01-01
-- Description: Creates the Scouts table for scout-specific information

CREATE TABLE IF NOT EXISTS Scouts (
    scout_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    organization VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_scout (user_id),
    INDEX idx_organization (organization),
    INDEX idx_verified (verified)
);

