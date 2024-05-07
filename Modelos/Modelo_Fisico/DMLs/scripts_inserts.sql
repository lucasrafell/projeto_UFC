INSERT INTO duration_type (type_name) VALUES
('minutes'),
('seasons');


INSERT INTO ufc.show_catalog (title_show, rating, listed_in, duration, duration_type_id, release_year, date_added, description_show)
SELECT st.title,
       st.rating,
       st.listed_in,
       st.duration,
       CASE 
           WHEN st.type_show = 'Movie' THEN 1  
           WHEN st.type_show = 'TV Show' THEN 2 
           ELSE NULL
       END AS duration_type_id,
       st.release_year,
       st.date_added,
       st.description_show
FROM ufc.show_temporaria st;


        -- "REGEXP_SUBSTR(cast, '[^,]+'" -- Busca por substrings que não tenham ','
        -- "DISTINCT" -- garante que apenas valores unicos sejam selecionados
        --  "TRIM" -- remove espacos em branco no nome do ator
        -- "JOIN(...) AS numbers" -- é uma subquerie usada para extrair elementos individualmente
        -- "CHAR_LENGTH(cast) - CHAR_LENGTH(REPLACE(cast, ',', ''))" -- pegar o elemento 1 ate o elemento n

INSERT INTO ufc.actor (actor_name)
SELECT DISTINCT TRIM(REGEXP_SUBSTR(cast, '[^,]+', 1, n)) AS actor_name 
FROM ufc.show_temporaria
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
    UNION ALL SELECT 9 UNION ALL SELECT 10
) AS numbers
ON CHAR_LENGTH(cast) - CHAR_LENGTH(REPLACE(cast, ',', '')) >= n - 1;




INSERT INTO cast (cast_names, fk_id_show_catalog, fk_id_actor)
SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(st.cast, ',', n.digit+1), ',', -1)) AS actor_name,
       sc.id_show_catalog,
       a.id_actor
FROM show_temporaria st
JOIN 
(
    SELECT 0 AS digit UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
) n
ON LENGTH(REPLACE(st.cast, ',' , '')) <= LENGTH(st.cast)-n.digit
JOIN actor a ON TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(st.cast, ',', n.digit+1), ',', -1)) = a.actor_name
JOIN show_catalog sc ON st.title = sc.title_show;




INSERT INTO ufc.country (name_country)
SELECT DISTINCT country
FROM ufc.show_temporaria;


INSERT INTO ufc.director (director_name)
SELECT DISTINCT director
FROM ufc.show_temporaria;



INSERT INTO ufc.show_type (show_type) VALUES
('movie'),
('TV series');


INSERT INTO ufc.show_catalog_country (fk_id_show_catalog, fk_id_country)
SELECT sc.id_show_catalog, c.id_country
FROM ufc.show_catalog sc
JOIN ufc.show_temporaria st ON sc.title_show = st.title
JOIN ufc.country c ON st.country = c.name_country;



INSERT INTO ufc.show_catalog_director (fk_id_show_catalog, fk_id_director)
SELECT sc.show_id, d.id_director
FROM ufc.show_temporaria sc
JOIN ufc.director d ON sc.director = d.director_name;


INSERT INTO ufc.show_catalog_show_type (fk_id_show_catalogs, fk_id_show_types)
SELECT sc.show_id, st.id_show_type
FROM ufc.show_temporaria sc
JOIN ufc.show_type st ON sc.type_show = st.show_type;
