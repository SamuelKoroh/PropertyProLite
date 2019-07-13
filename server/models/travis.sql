DROP DATABASE IF EXISTS travis_ci_test;
CREATE DATABASE travis_ci_test;
\c travis_ci_test;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS flag;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS deals;
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
    is_admin boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_on date DEFAULT CURRENT_DATE,
    reset_password_token VARCHAR,
    reset_password_expires VARCHAR
 );
CREATE TABLE properties
(
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    owner integer,
    status VARCHAR DEFAULT 'available',
    price numeric,
    state VARCHAR,
    city VARCHAR,
    address VARCHAR,
    type VARCHAR,
    deal_type VARCHAR,
    billing_type VARCHAR,
    image_url character varying[],
    description text,
    is_active boolean DEFAULT true,
    created_on date DEFAULT CURRENT_DATE
);
CREATE TABLE favourites
(
    id SERIAL,
    user_id integer NOT NULL,
    property_id integer NOT NULL,
    CONSTRAINT favourites_pkey PRIMARY KEY (user_id, property_id)
);
CREATE TABLE flag
(
    id SERIAL,
    property_id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    reason character varying NOT NULL,
    description character varying(500),
    created_on date DEFAULT CURRENT_DATE,
    CONSTRAINT flag_pkey PRIMARY KEY (id)
);
CREATE TABLE deals
(
    id character varying NOT NULL,
    name character varying NOT NULL,
    description character varying,
    CONSTRAINT deals_pkey PRIMARY KEY (id)
);
CREATE TABLE types
(
    id character varying NOT NULL,
    name character varying NOT NULL,
    description character varying,
    CONSTRAINT types_pkey PRIMARY KEY (id)
);
INSERT INTO users(first_name, last_name, email, phone_number, is_admin, password) 
VALUES('admin','admin','admin@gmail.com','0803',true,'$2b$10$6MAXFQLCsGWW7JBvnwCks.y1NobKqvd2csveJYK6YWthyNoP2ig9i');