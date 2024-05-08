const showRouter     = require('express').Router();
const showController = require('../controllers/showController')

showRouter
.route('/show/add')
.post((req, res) => showController.create(req, res));

showRouter
.route('/show/getAll')
.get((req, res) => showController.getAll(req, res));

showRouter
.route('/show/find')
.get((req, res) => showController.getById(req, res));

showRouter
.route('/show/update')
.put((req, res) => showController.update(req, res));

showRouter
.route('/show/delete')
.delete((req, res) => showController.delete(req, res));

module.exports = showRouter