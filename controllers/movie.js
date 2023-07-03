const movieModel = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovie = (req, res, next) => {
  movieModel.find({owner: req.user._id}).then((movie) => {
    res.send(movie);
  })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId, } = req.body;

    movieModel
    .create({
      owner: req.user._id,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data to create movie'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Not found: Invalid _id');
      }
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        next(new ForbiddenError('Movie cannot be deleted'));
      }

      return movie.deleteOne()
        .then(() => res.send({
          message: 'Movie was deleted',
        }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Movie with _id cannot be found'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovie,
};
