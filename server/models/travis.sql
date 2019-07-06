DROP DATABASE IF EXISTS travis_ci_test;
CREATE DATABASE travis_ci_test;
\c travis_ci_test;
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    email VARCHAR (40) NOT NULL,
    password VARCHAR NOT NULL,
    phone_number VARCHAR (24) ,
    address VARCHAR,
    image VARCHAR,
    user_type VARCHAR (8),
    is_admin boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_on date DEFAULT CURRENT_DATE,
    reset_password_token VARCHAR,
    reset_password_expires bigint
);