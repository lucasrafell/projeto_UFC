const neo4j = require('neo4j-driver');
const dbConfig = require('../config/db/dbConfig');

const driver = neo4j.driver(dbConfig.URI, neo4j.auth.basic(dbConfig.USER, dbConfig.PASSWORD));


const relController = {


  // Cria o relacionamento entre os atributos director, cast e country do show.

  create: async (req, res) => {
    const session = driver.session()
    try {
      const id = req.body.id
      const newId = parseInt(id)

      const query = `
      MATCH (sc:ShowCatalog {id: ${newId}})
      MERGE (d:Director {director_name: sc.director})
      MERGE (c:Country {name_country: sc.country})
      WITH sc, d, c
      UNWIND split(sc.cast, ', ') AS actor_name
      MERGE (a:Actor {actor_name: actor_name})
      MERGE (sc)-[:DIRECTED_BY]->(d)
      MERGE (sc)-[:LOCATED_IN]->(c)
      MERGE (sc)-[:HAS_CAST]->(a)
      RETURN sc, d, c, a;
      
      `;
      
      const result = await session.run(query)
  
      const response = {
        result: result.records.map(record => ({
          sc: record.get('sc').properties
        }))[0] 
      }
  
      res.status(201).json({ response, msg: "Ligação entre os nós criada com sucesso." })
    } catch (error) {
      console.error("Erro ao criar relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao criar relacionamento." });
    } finally {
      await session.close()
    }
  },

  // Cria relacionamento entre diretor e show, além de adicionar o diretor na prop director
  createRelDirectorShow: async (req, res) => {
    const session = driver.session()
    try {
      const {showId, director_name} = req.body;

      const id = parseInt(showId)

      const query = `MATCH (d:Director {director_name: "${director_name}"})
      MATCH (sc:ShowCatalog {id: ${id}})
      MERGE (d)-[:DIRECTED_BY]->(sc)
      RETURN d, sc;
      `
      const result = await session.run(query)
      if (result.records.length === 0) {
        return res.status(404).json({ msg: "Um dos nós informados não existe ou não foi encontrado." });
    }

    const updateDiretorShowQuery = `
    MATCH (d:Director {director_name: "${director_name}"})
    MATCH (sc:ShowCatalog {id: ${id}})

SET sc.director = 
  CASE 
    WHEN sc.director IS NOT NULL THEN sc.director + ", ${director_name}"
    ELSE "${director_name}"
  END

RETURN d, sc`

    const resultSecondQuery = await session.run(updateDiretorShowQuery)

      const response = {
        record: resultSecondQuery.records
      }
      res.status(201).json({response, msg: "Relacionamento criado com sucesso!."})

    } catch (error) {
      console.error("Erro ao criar relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao criar relacionamento." });
    } finally {
      await session.close()
    }
  },

  // Cria relacionamento entre diretor e show, além de adicionar o diretor na prop director
  
  createRelActorShow: async (req, res) => {
    const session = driver.session()
    try {
      const {showId, actor_name} = req.body;

      const id = parseInt(showId)

      const query = `MATCH (a:Actor {actor_name: "${actor_name}"})
      MATCH (sc:ShowCatalog {id: ${id}})
      MERGE (a)-[:HAS_CAST]->(sc)
      RETURN a, sc;
      `
      
      const result = await session.run(query)
      if (result.records.length === 0) {
        return res.status(404).json({ msg: "Um dos nós informados não existe ou não foi encontrado." });
    }

    const updateActorShowQuery = `
    MATCH (a:Actor {actor_name: "${actor_name}"})
    MATCH (sc:ShowCatalog {id: ${id}})

SET sc.cast = 
  CASE 
    WHEN sc.cast IS NOT NULL THEN sc.cast + ", ${actor_name}"
    ELSE "${actor_name}"
  END

RETURN a, sc`

      const resultSecondQuery = await session.run(updateActorShowQuery)

      const response = {
        record: resultSecondQuery.records
      }
      res.status(201).json({response, msg: "Relacionamento criado com sucesso!."})

    } catch (error) {
      console.error("Erro ao criar relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao criar relacionamento." });
    } finally {
      await session.close()
    }
  },

  createRelCountryShow: async (req, res) => {
    const session = driver.session()
    try {
      const {showId, name_country} = req.body;

      const id = parseInt(showId)

      const query = `MATCH (c:Country {name_country: "${name_country}"})
      MATCH (sc:ShowCatalog {id: ${id}})
      MERGE (c)-[:LOCATED_IN]->(sc)
      RETURN c, sc;
      `
      const result = await session.run(query)
      if (result.records.length === 0) {
        return res.status(404).json({ msg: "Um dos nós informados não existe ou não foi encontrado." });
    }


    // Pega a country e adiciona na lista de países na propriedade country de ShowCatalog, 
    // Além disso, cria os relacionamentos entre country e show.

    const updateCountryShowQuery = `
    MATCH (c:Country {name_country: "${name_country}"})
    MATCH (sc:ShowCatalog {id: ${id}})

SET sc.country = 
  CASE 
    WHEN sc.country IS NOT NULL THEN sc.country + ", ${name_country}"
    ELSE "${name_country}"
  END

RETURN c, sc`

      const resultSecondQuery = await session.run(updateCountryShowQuery)

      const response = {
        record: resultSecondQuery.records
      }
      res.status(201).json({response, msg: "Relacionamento criado com sucesso!."})
      

    } catch (error) {
      console.error("Erro ao criar relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao criar relacionamento." });
    } finally {
      await session.close()
    }
  },


  getActorShows: async (req, res) => {
    const session = driver.session()
    try {
      const name = req.query.name
      console.log(name)

      if (name === 'undefined') {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }
      const query = `MATCH (a:Actor {actor_name: "${name}"})<-[r:HAS_CAST]-(sc:ShowCatalog) 
                      RETURN a, r, sc`

      const result = await session.run(query)

      if(result.records.length === 0){
        return res.status(404).json({msg: "Não foi possível encontrar o ator mencionado no relacionamento"})
      }

      const response = {
        record: result.records
      }
      
      res.status(200).json({response, msg: "Relacionamento entre ator e show retornado com sucesso!"})

    } catch (error) {
      console.error("Erro ao retornar relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao retornar relacionamento." });
    }finally{
      await session.close()
    }
  },


  getDirectorShows: async (req, res) => {
    const session = driver.session()
    try {
      const name = req.query.name

      if (name === 'undefined') {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }
      const query = `MATCH (d:Director {director_name: "${name}"})<-[r:DIRECTED_BY]-(sc:ShowCatalog) 
                      RETURN d, r, sc`

      const result = await session.run(query)

      if(result.records.length === 0){
        return res.status(404).json({msg: "Não foi possível encontrar o diretor mencionado no relacionamento"})
      }

      const response = {
        record: result.records
      }
      
      res.status(200).json({response, msg: "Relacionamento entre diretor e show retornado com sucesso!"})
      
    } catch (error) {
      console.error("Erro ao retornar relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao retornar o relacionamento." });
    }finally{
      await session.close()
    }
  },


  getCountryShows: async (req, res) => {
    const session = driver.session()
    try {
      const name = req.query.name

      if (name === 'undefined') {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }
      const query = `MATCH (c:Country {name_country: "${name}"})<-[r:LOCATED_IN]-(sc:ShowCatalog) 
                      RETURN c, r, sc`

      const result = await session.run(query)

      if(result.records.length === 0){
        return res.status(404).json({msg: "Não foi possível encontrar o país mencionado no relacionamento"})
      }

      const response = {
        record: result.records
      }
      
      res.status(200).json({response, msg: "Relacionamento entre país e show retornado com sucesso!"})

    } catch (error) {
      console.error("Erro ao retornar o relacionamento:", error);
      res.status(500).json({ msg: "Erro interno do servidor ao retornar relacionamento." });
    }finally{
      await session.close()
    }
  }
  
}
  

module.exports = relController





