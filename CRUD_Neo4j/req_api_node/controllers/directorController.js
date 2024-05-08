const neo4j = require('neo4j-driver');
const dbConfig = require('../config/db/dbConfig');

const driver = neo4j.driver(dbConfig.URI, neo4j.auth.basic(dbConfig.USER, dbConfig.PASSWORD));

const directorController = {

  // cria um novo diretor
  create: async (req, res) => {
    const session = driver.session();
    try {
      const name = req.body.name;

      // valida se o nome recebido está em formato válido.
      
      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/
      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }
      const result = await session.run(
        `MERGE (d:Director {director_name: "${name}"}) RETURN d`
      );

      const response = {
        records: result.records,
      };

      res.status(201).json({ response, msg: "diretor criado com sucesso." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a criação do diretor." });
    } finally {
      if (session) await session.close();
    }
  },

  // busca o diretor pelo nome
  getDirectorByName: async (req, res) => {
    const session = driver.session();
    try {
      const name = req.query.name

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/


      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }

      const result = await session.run(
        `MATCH (d:Director {director_name: "${name}"}) RETURN d`
      );

      if (result.records.length === 0) {
        return res.status(404).json({ msg: "diretor não encontrado." });
      }

      const response = {
        records: result.records,
      };

      res.status(200).json({ response, msg: "Diretor encontrado com sucesso." });

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a busca." });
    }
    finally {
      if (session) await session.close();
    }
  },

  // busca um conjunto de diretores com a quantia determinada nos parâmetros da requisição.
  getAllDirectorsInRange: async (req, res) => {
    const session = driver.session()
    try {
      const range = req.query.range

      if (!range || range === 'undefined' || isNaN(range)) {
        const result = await session.run(
          `MATCH (d:Director) RETURN d LIMIT 10`
        )
        const response = {
          totalRecords: result.records.length,
          records: result.records,
        };

        return res.status(200).json({ response, msg: "Diretores retornados com sucesso." })
      }
      const query = `MATCH (d:Director) RETURN d LIMIT ${range}`
      const result = await session.run(query)

      const response = {
        totalRecords: result.records.length,
        records: result.records,
      };
      res.status(200).json({ response, msg: "Diretores retornados com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível realizar a busca." });
    }
    finally {
      if (session) await session.close();
    }
  },

  // busca os filmes que um determinado diretor dirigiu.
  getFilmsDirectorRel: async (req, res) => {
    const session = driver.session()
    try {
      const { name, range } = req.query

      // valida se o nome é válido

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/
      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }

      // checa se a requisição possui o "range".

      if (!range || range === 'undefined') {
        const result = await session.run(`MATCH (d:Director {director_name: "${name}"})<-[r:DIRECTED_BY]-(s:ShowCatalog) RETURN d, r, s`)
        const response = {
          totalRecords: result.records.length,
          records: result.records,
        };
        res.status(200).json({ response, msg: "Busca concluída com sucesso." });
      }

      // Query caso tenha todos os dados da requisição.
      const query = `MATCH (d:Director {director_name: "${name}"})<-[r:DIRECTED_BY]-(s:ShowCatalog) RETURN d, r, s LIMIT ${range} `
      const result = await session.run(query)

      // verifica se ele já existe.

      if (result.records.length === 0) {
        return res.status(404).json({ msg: "diretor não encontrado." });
      }
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
      
      const query = `MATCH (d:Director) 
                    WHERE d.director_name = "${name}"
                    SET d.director_name = "${newName}" 
                    RETURN d`

      const result = await session.run(query)
      if (result.records.length === 0) {
        return res.status(404).json({ msg: "diretor não encontrado." });
      }

      const updateDirectorQuery = `
      MATCH (sc:ShowCatalog)
      WHERE "${name}" = sc.director
      SET sc.director = "${newName}"`

      const updateResult = await session.run(updateDirectorQuery)

      if(updateResult.records.length === 0){
        return res.status(200).json({msg: "O diretor mencionado foi atualizado, mas não possui relacioanmentos."})
      }
      const response = {
        records: updateResult.records,
      };


      res.status(201).json({ response, msg: "Diretor atualizado com sucesso." })
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

      const name = req.body.name;

      const validateName = /^[a-zA-ZÀ-ÿ\s]+$/
      if (!name || name === 'undefined' || !validateName.test(name)) {
        return res.status(403).json({ msg: "O parâmetro não foi informado ou possui valor inválido." })
      }

      const query = `MATCH(d:Director)
      WHERE d.director_name = "${name}"
      DETACH DELETE d
      RETURN d`
      const result = await session.run(query)

      if (result.records.length === 0) {
        return res.status(404).json({ msg: "diretor não encontrado." });
      }

      const response = {
        records: result.records,
      }
      res.status(200).json({ response, msg: "diretor apagado com sucesso." })

    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Não foi possível encontrar o diretor especificado." });
    } finally {
      if (session) await session.close();
    }
  }

};

module.exports = directorController;
