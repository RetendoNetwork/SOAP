import express, { Request, Response } from 'express';
import xmlbuilder from 'xmlbuilder';
import logger from './logger';

const config = require('../config.json');
const { config: { port } } = config;
const app = express();

import wup from './wup';

app.use(wup)

app.listen(port, () => {
  logger.log(`The server was started on http://localhost:${port}`);
});