CREATE TABLE user (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    email VARCHAR(50) UNIQUE NOT NULL,
    Phone BIGINT NOT NULL,
    address VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50) NOT NULL, 
    image VARCHAR(50),
);