const relController = require('../controllers/relController');

const relationRouter = require('express').Router();

relationRouter
.route('/relation/create')
.post((req, res) => relController.create(req, res))

relationRouter
.route('/relation/director-show')
.post((req, res) => relController.createRelDirectorShow(req, res))

relationRouter
.route('/relation/actor-show')
.post((req, res) => relController.createRelActorShow(req, res));

relationRouter
.route('/relation/country-show')
.post((req, res) => relController.createRelCountryShow(req, res));

relationRouter
.route('/relation/find-actor')
.get((req, res) => relController.getActorShows(req, res));

relationRouter
.route('/relation/find-director')
.get((req, res) => relController.getDirectorShows(req, res));

relationRouter
.route('/relation/find-country')
.get((req, res) => relController.getCountryShows(req, res));


module.exports = relationRouter