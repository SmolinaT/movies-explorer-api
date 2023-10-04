require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const centralizedError = require('./middlewares/centralized-error');
const { DB_ADDRESS } = require('./utils/config');

mongoose.connect(DB_ADDRESS);

const app = express();

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(centralizedError);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
