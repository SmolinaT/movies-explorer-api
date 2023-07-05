const router = require('express').Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const { validateCreateUser, validateLoginUser } = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const { createUser, loginUser } = require('../controllers/user');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLoginUser, loginUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
