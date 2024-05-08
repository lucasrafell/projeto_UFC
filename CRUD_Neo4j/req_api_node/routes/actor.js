const actorController = require('../controllers/actorController')

const actorRouter = require('express').Router()

// cria ator
actorRouter
.route('/actor/add')
.post((req, res) => actorController.create(req, res));

//retorna ator específico
actorRouter
.route('/actor/find')
.get((req, res) => actorController.getActorByName(req, res));

// retorna vários atores.
actorRouter
.route('/actor/findMany')
.get((req,res) => actorController.getAllActorsInRange(req, res))

// retorna um ator e os filmes relacionados a ele
actorRouter
.route('/actor/find-films')
.get((req, res) => actorController.getFilmsActorRel(req, res))

// atualiza um ator.

actorRouter
.route('/actor/update')
.put((req, res) => actorController.update(req, res));

// deleta um ator.
actorRouter
.route('/actor/delete')
.delete((req, res) => actorController.delete(req, res));

module.exports = actorRouter