use ufc;

CREATE TABLE show_temporaria (
    show_id VARCHAR(255) PRIMARY KEY,
    type_show VARCHAR(100),
    title VARCHAR(255),
    director VARCHAR(255),
    cast TEXT,
    country VARCHAR(255),
    date_added DATE,
    release_year INT,
    rating VARCHAR(50),
    duration VARCHAR(100),
    listed_in TEXT,
    description_show TEXT,
    INDEX (release_year),
    INDEX (type_show),
    INDEX (rating)
);
