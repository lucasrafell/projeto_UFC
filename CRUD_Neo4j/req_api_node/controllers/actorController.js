const neo4j = require('neo4j-driver');
const dbConfig = require('../config/db/dbConfig');

const driver = neo4j.driver(dbConfig.URI, neo4j.auth.basic(dbConfig.USER, dbConfig.PASSWORD));

const actorController = {

  // cria um novo ator 
  create: async (req, res) => {
    const session = driver.session();
    try {
      const name = req.body.name;

      // valida se o nome recebido está em formato válido.

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/

      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "um dos parâmetros não foi informado ou possui valor inválido." })
      }
      const result = await session.run(
        `MERGE (a:Actor {actor_name: "${name}"}) RETURN a`
      );

      const response = {
        records: result.records,
      };

      res.status(201).json({ response, msg: "Ator criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a criação do ator." });
    } finally {
      if (session) await session.close();
    }
  },

  // busca o ator pelo nome
  getActorByName: async (req, res) => {
    const session = driver.session();
    try {
      const name = req.query.name

      if (!name || name === 'undefined') {
        return res.status(403).json({ msg: "O parâmetro solicitado não se encontra na requisição." })
      }

      const result = await session.run(
        `MATCH (a:Actor {actor_name: "${name}"}) RETURN a`
      );
      if (result.records.length === 0) {
        return res.status(404).json({ msg: "ator não encontrado." });
      }

      const response = {
        records: result.records,
      };

      res.status(200).json({ response, msg: "Ator encontrado com sucesso." });

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a busca." });
    }
    finally {
      if (session) await session.close();
    }
  },

  // busca um conjunto de atores com a quantia determinada nos parâmetros da requisição.
  getAllActorsInRange: async (req, res) => {
    const session = driver.session()
    try {
      const range = req.query.range

      if (!range || range === 'undefined' || isNaN(range)) {
        const result = await session.run(
          `MATCH (a:Actor) RETURN a LIMIT 10`
        )
        const response = {
          totalRecords: result.records.length,
          records: result.records,
        };

        return res.status(200).json({ response, msg: "Usuários retornados com sucesso." })
      }
      const query = `MATCH (a:Actor) RETURN a LIMIT ${range}`
      const result = await session.run(query)

      const response = {
        totalRecords: result.records.length,
        records: result.records,
      };
      res.status(200).json({ response, msg: "Atores retornados com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a busca." });
    }
    finally {
      if (session) await session.close();
    }
  },

  // busca os filmes que um determinado ator participou.
  getFilmsActorRel: async (req, res) => {
    const session = driver.session()
    try {
      const { name, range } = req.query

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/
      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }

      if (!range || range === 'undefined') {
        const result = await session.run(`MATCH (a:Actor {actor_name: "${name}"})<-[r:HAS_CAST]-(s:ShowCatalog) RETURN a, r, s`)
        const response = {
          totalRecords: result.records.length,
          records: result.records,
        };
        res.status(200).json({ response, msg: "Busca concluída com sucesso." });
      }
      const query = `MATCH (a:Actor {actor_name: "${name}"})<-[r:HAS_CAST]-(s:ShowCatalog) RETURN a, r, s LIMIT ${range} `
      const result = await session.run(query)

      const response = {
        totalRecords: result.records.length,
        records: result.records,
      };
      res.status(200).json({ response, msg: "Busca concluída com sucesso." });


    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a busca." });
    } finally {
      if (session) await session.close();
    }
  },

  update: async (req, res) => {
    const session = driver.session()
    try {
      const { name, newName } = req.body;

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/

      if (!name || name === 'undefined' || !newName || newName === 'undefined' || !validateName.test(name) || !validateName.test(newName)) {
        return res.status(403).json({ msg: "um dos parâmetros não foi informado ou possui valor inválido." })
      }
      const query = `MATCH (a:Actor) 
                    WHERE a.actor_name = "${name}"
                    SET a.actor_name = "${newName}" 
                    RETURN a`
      const result = await session.run(query)
      if(result.records.length === 0){
        res.status(404).json({msg: "Não foi possível encontrar o ator para realizar a atualização."})
      }

      const updateCastQuery = `
      MATCH (sc:ShowCatalog)
      WHERE "${name}" IN split(sc.cast, ', ')
      SET sc.cast = REPLACE(sc.cast, "${name}", "${newName}")
      RETURN sc`

      const updateResult = await session.run(updateCastQuery)

      if(updateResult.records.length === 0){
        return res.status(200).json({msg: "O ator mencionado foi atualizado, mas não possui relacioanmentos."})
      }
      const response = {
        records: updateResult.records,
      };

      res.status(201).json({ response, msg: "Ator atualizado com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a busca." });
    } finally {
      if (session) await session.close();
    }
  },

  // apaga um registro
  delete: async (req, res) => {
    const session = driver.session();
    try {
      const name = req.query.name;

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/
      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }

      // verifica se o ator possui relacionamentos.


      const query = `MATCH(a:Actor)
      WHERE a.actor_name = "${name}"
      DETACH DELETE a 
      RETURN a`
      const result = await session.run(query)
      const response = {
        records: result.records,
      }
      res.status(200).json({ response, msg: "ator apagado com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível encontrar o ator especificado." });
    } finally {
      if (session) await session.close();
    }
  }

};

module.exports = actorController;
