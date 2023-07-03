const router = require('express').Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/card');
const { validateCreateCard, validateCardId } = require('../middlewares/validate');

router.get('/', getMovie);

router.post('/', validateCreateCard, createMovie);

router.delete('/:movieId', validateCardId, deleteMovie);

module.exports = router;
