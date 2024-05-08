const directorController = require('../controllers/directorController');

const directorRouter     = require('express').Router();

directorRouter
.route('/director/add')
.post((req,res) => directorController.create(req, res));

directorRouter
.route('/director/find')
.get((req, res) => directorController.getDirectorByName(req, res));

directorRouter
.route('/director/findMany')
.get((req, res) => directorController.getAllDirectorsInRange(req, res));

directorRouter
.route('/director/find-films')
.get((req, res) => directorController.getFilmsDirectorRel(req, res))

directorRouter
.route('/director/update')
.put((req, res) => directorController.update(req, res));

directorRouter
.route('/director/delete')
.delete((req, res) => directorController.delete(req, res));
 

module.exports = directorRouter