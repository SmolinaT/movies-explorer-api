const router = require('express').Router();
const {
  getUserMe,
  updateUser,
} = require('../controllers/user');
const { validateUserUpdate } = require('../middlewares/validate');

router.get('/me', getUserMe);

router.patch('/me', validateUserUpdate, updateUser);

module.exports = router;
