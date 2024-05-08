const router         = require('express').Router()
const actorRouter    = require('./actor');
const directorRouter = require('./director');
const relationRouter = require('./relations');
const showRouter     = require('./showCatalog');


router.use('/', actorRouter);
router.use('/', directorRouter);
router.use('/', showRouter);
router.use('/', relationRouter);

module.exports = router;