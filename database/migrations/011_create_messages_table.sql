-- Migration: Create Messages Table
-- Created: 2024-01-01
-- Description: Creates the Messages table for future messaging functionality

CREATE TABLE IF NOT EXISTS Messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (sender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    INDEX idx_chat_id (chat_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_sent_at (sent_at),
    INDEX idx_read_at (read_at)
);




