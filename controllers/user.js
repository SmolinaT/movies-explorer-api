const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const MONGO_DUPLICATE_KEY_ERROR = 11000;
const SALT_ROUNDS = 10;

const getUserMe = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => {
      console.log(hash);

      userModel.create({
        name,
        email,
        password: hash,
      })
        .then(() => {
          res.status(201).send({
            name,
            email,
          });
        })
        .catch((err) => {
          if (err.name === MONGO_DUPLICATE_KEY_ERROR || err.code === 11000) {
            next(new ConflictError('Such a user already exists'));
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError('Invalid data to create user'));
          } else {
            next(err);
          }
        });
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  userModel.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data to update user'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User with _id cannot be found'));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError('Email or password is incorrect');
    })
    .then((user) => Promise.all([user, bcrypt.compare(password, user.password)]))
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new UnauthorizedError('Email or password is incorrect');
      }

      const token = signToken({ _id: user._id });
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserMe,
  createUser,
  updateUser,
  loginUser,
};
