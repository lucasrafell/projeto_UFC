CREATE DATABASE IF NOT EXISTS ufc;
USE ufc;


CREATE TABLE IF NOT EXISTS duration_type (
    id_duration_type INT NOT NULL AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_duration_type)
);

CREATE TABLE IF NOT EXISTS show_catalog (
  id_show_catalog INT NOT NULL AUTO_INCREMENT,
  title_show VARCHAR(255) NOT NULL,
  rating VARCHAR(45) NOT NULL,
  listed_in VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  duration_type_id INT NOT NULL,
  release_year INT,
  date_added DATE,
  description_show TEXT,
  PRIMARY KEY (id_show_catalog),
  FOREIGN KEY (duration_type_id) REFERENCES duration_type(id_duration_type)
);




CREATE TABLE IF NOT EXISTS actor (
  id_actor INT NOT NULL AUTO_INCREMENT,
  actor_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_actor)
);


CREATE TABLE IF NOT EXISTS cast (
  id_cast INT NOT NULL AUTO_INCREMENT,
  cast_names TEXT,
  fk_id_show_catalog INT NOT NULL,
  fk_id_actor INT NOT NULL,
  PRIMARY KEY (id_cast),
  INDEX fk_id_actor_idx (fk_id_actor ASC),
  INDEX fk_id_show_catalog_idx (fk_id_show_catalog ASC),
  CONSTRAINT fk_id_show_catalog
    FOREIGN KEY (fk_id_show_catalog)
    REFERENCES show_catalog (id_show_catalog)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_id_actor
    FOREIGN KEY (fk_id_actor)
    REFERENCES actor (id_actor)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


CREATE TABLE IF NOT EXISTS country (
  id_country INT NOT NULL AUTO_INCREMENT,
  name_country VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_country)
);


CREATE TABLE IF NOT EXISTS director (
  id_director INT NOT NULL AUTO_INCREMENT,
  director_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_director)
);



CREATE TABLE IF NOT EXISTS show_catalog_country (
  fk_id_show_catalog INT NOT NULL,
  fk_id_country INT NOT NULL,
  INDEX fk_id_country_idx (fk_id_country ASC),
  CONSTRAINT fk_id_country_catalog
    FOREIGN KEY (fk_id_country)
    REFERENCES country (id_country),
  CONSTRAINT fk_id_show_catalog_country
    FOREIGN KEY (fk_id_show_catalog)
    REFERENCES show_catalog (id_show_catalog)
);


CREATE TABLE IF NOT EXISTS show_catalog_director (
  fk_id_show_catalog INT NOT NULL,
  fk_id_director INT NOT NULL,
  INDEX fk_id_director_idx (fk_id_director ASC),
  CONSTRAINT fk_id_director_show_catalog
    FOREIGN KEY (fk_id_director)
    REFERENCES director (id_director),
  CONSTRAINT fk_id_show_catalog_director
    FOREIGN KEY (fk_id_show_catalog)
    REFERENCES show_catalog (id_show_catalog)
);


CREATE TABLE IF NOT EXISTS show_type (
  id_show_type INT NOT NULL AUTO_INCREMENT,
  show_type VARCHAR(45) NOT NULL,
  PRIMARY KEY (id_show_type)
);


CREATE TABLE IF NOT EXISTS show_catalog_show_type (
  fk_id_show_catalogs INT NOT NULL,
  fk_id_show_types INT NOT NULL,
  CONSTRAINT fk_id_show_catalogs
    FOREIGN KEY (fk_id_show_catalogs)
    REFERENCES show_catalog (id_show_catalog),
  CONSTRAINT fk_id_show_types
    FOREIGN KEY (fk_id_show_types)
    REFERENCES show_type (id_show_type),
  PRIMARY KEY (fk_id_show_catalogs, fk_id_show_types)
);


