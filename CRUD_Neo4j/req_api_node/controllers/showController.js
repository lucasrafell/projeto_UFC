const neo4j = require('neo4j-driver');
const dbConfig = require('../config/db/dbConfig');

const driver = neo4j.driver(dbConfig.URI, neo4j.auth.basic(dbConfig.USER, dbConfig.PASSWORD));

const showController = {

  create: async (req, res) => {
    const session = driver.session();
    try {
      const { id, title, description_show, duration, date_added, country, rating, director, type_show, release_year,
        cast, listed_in } = req.body
      const validateIfIsString = /^[a-zA-ZÀ-ÿ\s]+$/;
      const validateData = /^(?:20\d{2})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
      const validateRating = /^(PG-13|TV-Y|TV-14|TV-MA|TV-PG|R|TV-G)$/;
      const validateTypeShow = /^(TV Show|movie)$/;
      const validateYear = /^\d{4}$/;

      // verifica se o id já existe.

      checkId = `MATCH (s:ShowCatalog {id: ${id}}) RETURN s.id`
      const checkIdQuery = await session.run(checkId)

      if (checkIdQuery.records.length !== 0) {
        return res.status(400).json({ msg: "O id mencionado já existe." })
      }

      if (isNaN(id)) {
        return res.status(403).json({ msg: "o id passado na requisição está em um formato inválido." });

      } else if (!validateIfIsString.test(title)) {

        return res.status(403).json({ msg: "o titulo passado na requisição está em um formato inválido." });
      } else if (!validateIfIsString.test(description_show)) {
        return res.status(403).json({ msg: "A descrição do show passada na requisição está em um formato inválido." });

      } else if (duration.length > 45) {
        return res.status(403).json({ msg: "A duração do show passada na requisição está em um formato inválido." });
      }

      else if (!validateData.test(date_added)) {
        return res.status(403).json({ msg: "A data de adição do show informada  está em um formato inválido." });
      }

      else if (!validateIfIsString.test(country)) {
        return res.status(403).json({ msg: "O país informado  está em um formato inválido." });


      } else if (!validateRating.test(rating)) {
        return res.status(403).json({ msg: "A classificação indicativa está em um formato inválido." });


      } else if (!validateIfIsString.test(director)) {
        return res.status(403).json({ msg: "O diretor está em um formato inválido." });


      } else if (!validateTypeShow.test(type_show)) {
        return res.status(403).json({ msg: "O tipo de show informado está em um formato inválido." });


      } else if (!validateYear.test(release_year)) {
        return res.status(403).json({ msg: "o ano de lançamento está em um formato inválido." });


      } else if (typeof cast !== 'string') {
        return res.status(403).json({ msg: "O formato do elenco passado está em um formato inválido." });


      } else if (!validateIfIsString.test(listed_in)) {
        return res.status(403).json({ msg: "O listed_in passado está em um formato inválido." });
      }

      const query = `CREATE (s:ShowCatalog {
        id: toInteger(${id}),
        type_show: "${type_show}",
        title: "${title}",
        director: "${director}",
        cast: "${cast}",
        country: "${country}",
        date_added: "${date_added}",
        release_year: toInteger(${release_year}),
        rating: "${rating}",
        duration: "${duration}",
        listed_in: "${listed_in}",
        description_show: "${description_show}"
    })
        `
      await session.run(query)

      const response = {
        id: id,
        title: title,
        description_show: description_show,
        duration: duration,
        date_added: date_added,
        country: country,
        rating: rating,
        director: director,
        type_show: type_show,
        release_year: release_year,
        cast: cast,
        listed_in: listed_in
      }
      res.status(201).json({ response, msg: "Show criado com sucesso." });

    } catch (error) {

      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a criação do show." });
    } finally {
      if (session) await session.close();
    }
  },

  getAll: async (req, res) => {
    const session = driver.session()
    try {

      const query = `MATCH (s:ShowCatalog) RETURN s`
      const result = await session.run(query)

      const response = {
        record: result.records
      }

      res.status(200).json({ response, msg: "Shows encontrados com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Ocorreu um erro interno no servidor." });
    } finally {
      if (session) await session.close();
    }
  },

  getById: async (req, res) => {
    const session = driver.session()
    try {
      const id = req.query.id

      const query = `MATCH (s:ShowCatalog {id: ${id}}) RETURN s`
      const result = await session.run(query)
      if (result.records.length === 0) {
        return res.status(404).json({ msg: "Não foi possível encontrar o show informado." })
      }
      const response = {
        records: result.records
      }
      res.status(200).json({ response, msg: "Show encontrado com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a criação do show." });
    } finally {
      if (session) await session.close();
    }
  },

  update: async (req, res) => {
    const session = driver.session()
    try {
      const { id, title, description_show, duration, date_added, country, rating, director, type_show, release_year,
        cast, listed_in } = req.body
      const validateIfIsString = /^[a-zA-ZÀ-ÿ\s]+$/;
      const validateData = /^(?:20\d{2})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;
      const validateRating = /^(PG-13|TV-Y|TV-14|TV-MA|TV-PG|R|TV-G)$/;
      const validateTypeShow = /^(TV Show|movie)$/;
      const validateYear = /^\d{4}$/;

      // verifica se o id já existe.

      checkId = `MATCH (s:ShowCatalog {id: ${id}}) RETURN s.id`
      const checkIdQuery = await session.run(checkId)

      if (checkIdQuery.records.length === 0) {
        return res.status(404).json({ msg: "o show mencionado não existe." })
      }

      if (isNaN(id)) {
        return res.status(403).json({ msg: "o id passado na requisição está em um formato inválido." });

      } else if (!validateIfIsString.test(title)) {

        return res.status(403).json({ msg: "o titulo passado na requisição está em um formato inválido." });
      } else if (!validateIfIsString.test(description_show)) {
        return res.status(403).json({ msg: "A descrição do show passada na requisição está em um formato inválido." });

      } else if (duration.length > 45) {
        return res.status(403).json({ msg: "A duração do show passada na requisição está em um formato inválido." });
      }

      else if (!validateData.test(date_added)) {
        return res.status(403).json({ msg: "A data de adição do show informada  está em um formato inválido." });
      }

      else if (!validateIfIsString.test(country)) {
        return res.status(403).json({ msg: "O país informado  está em um formato inválido." });


      } else if (!validateRating.test(rating)) {
        return res.status(403).json({ msg: "A classificação indicativa está em um formato inválido." });


      } else if (!validateIfIsString.test(director)) {
        return res.status(403).json({ msg: "O diretor está em um formato inválido." });


      } else if (!validateTypeShow.test(type_show)) {
        return res.status(403).json({ msg: "O tipo de show informado está em um formato inválido." });


      } else if (!validateYear.test(release_year)) {
        return res.status(403).json({ msg: "o ano de lançamento está em um formato inválido." });


      } else if (typeof cast !== 'string') {
        return res.status(403).json({ msg: "O formato do elenco passado está em um formato inválido." });


      } else if (!validateIfIsString.test(listed_in)) {
        return res.status(403).json({ msg: "O listed_in passado está em um formato inválido." });
      }

      const query = `MATCH (s:ShowCatalog {id: ${id}})
          SET s.type_show = "${type_show}",
              s.title = "${title}",
              s.director = "${director}",
              s.cast = "${cast}",
              s.country = "${country}",
              s.date_added = "${date_added}",
              s.release_year = ${release_year},
              s.rating = "${rating}",
              s.duration = "${duration}",
              s.listed_in = "${listed_in}",
              s.description_show = "${description_show}"
          RETURN s
         
            `

      const result = await session.run(query)
      if (result.records.length === 0) {
        res.status(400).json({ msg: "Não foi possível atualizar o show." })
      }

      const updateRelQuery = `

      MATCH (s:ShowCatalog {id: ${id}})
      OPTIONAL MATCH (s)-[:HAS_CAST]->(oldActor)
      OPTIONAL MATCH (s)-[:DIRECTED_BY]->(oldDirector)
      OPTIONAL MATCH (s)-[:LOCATED_IN]->(oldCountry)
      DETACH DELETE oldActor
      DETACH DELETE oldDirector
      DETACH DELETE oldCountry
      WITH s, split("${cast}", ', ') as newCast
      UNWIND newCast as newActorName
      MERGE (a:Actor {actor_name: newActorName})
      MERGE (s)-[:HAS_CAST]->(a)
      MERGE (s)-[:DIRECTED_BY]->(d:Director {director_name: "${director}"})
      MERGE (s)-[:LOCATED_IN]->(c:Country {name_country: "${country}"})      
      RETURN s`

      const updateShowRelQuery = await session.run(updateRelQuery)
      if (updateShowRelQuery.records.length === 0) {
        res.status(400).json({ msg: "Não foi possível atualizar os relacionamentos de show." })
      }

      const response = {
        records: updateShowRelQuery.records
      }
      res.status(201).json({ response, msg: "Show atualizado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a criação do show." });
    } finally {
      if (session) await session.close();
    }
  },

  delete: async (req, res) => {
    const session = driver.session()
    try {
      const id = req.body.id;

      const query = `MATCH(s:ShowCatalog)
        WHERE s.id = ${id}
        DETACH DELETE s
        RETURN s`
      const result = await session.run(query)

      if (result.records.length === 0) {
        return res.status(404).json({ msg: "show não encontrado." });
      }

      const response = {
        records: result.records,
      }
      res.status(200).json({ response, msg: "show apagado com sucesso." })
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a deleção do show." });
    } finally {
      if (session) await session.close();
    }
  }
}

module.exports = showController;