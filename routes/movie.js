const router = require('express').Router();
const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
const { validateCreateMovie, validateMovieId } = require('../middlewares/validate');

router.get('/', getMovie);

router.post('/', validateCreateMovie, createMovie);

router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
