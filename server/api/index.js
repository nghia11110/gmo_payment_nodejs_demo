import express from 'express';
import bodyParser from 'body-parser';
import todos from './todos';
import gmoPayment from './gmo-payment/';

const Api = express();

// always send JSON headers
Api.use((req, res, next) => {
  res.contentType('application/json');
  next();
});

// parse JSON body
Api.use(bodyParser.json());

// Add all API endpoints here
Api.use('/todos', todos);
Api.use('/gmo-payment', gmoPayment);

export default Api;
