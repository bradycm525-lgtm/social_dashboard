CREATE DATABASE social_dashboard;

\c social_dashboard;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT
);

CREATE TABLE connected_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL, -- 'Facebook', 'Twitter', 'Instagram'
    account_handle VARCHAR(100) NOT NULL,
    access_token TEXT DEFAULT 'mock_token_123'
);

CREATE TABLE social_posts (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES connected_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL,
    post_type VARCHAR(20) NOT NULL, -- 'feed' or 'own_post'
    author VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial profile and mock API data for Phase 1 testing
INSERT INTO users (username, email, bio) 
VALUES ('Brady Monroe', 'bcm343@nau.edu', 'CS 312 Student & Developer');

INSERT INTO connected_accounts (user_id, platform, account_handle) VALUES 
(1, 'Facebook', '@bradymonroe.fb'),
(1, 'Twitter', '@brady_codes'),
(1, 'Instagram', '@brady.captures');

INSERT INTO social_posts (account_id, platform, post_type, author, content) VALUES
(1, 'Facebook', 'feed', 'NAU School of Informatics', 'Welcome to the Fall semester! Check out the upcoming CS 312 project showcase.'),
(1, 'Facebook', 'own_post', 'Brady Monroe', 'Just started building my Social Media Dashboard for CS 312!'),
(2, 'Twitter', 'feed', '@TechDaily', 'PostgreSQL + Express + React remains one of the cleanest full-stack architectures.'),
(2, 'Twitter', 'own_post', '@brady_codes', 'Working on Phase 1 API integrations today. #webdev'),
(3, 'Instagram', 'feed', '@flagstaff_views', 'Morning snow on the San Francisco Peaks!'),
(3, 'Instagram', 'own_post', '@brady.captures', 'Late night coding setup.');