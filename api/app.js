// @flow

'use strict';

import SwaggerExpress from 'swagger-express-mw';
const app = require('express')();
export default app; // for testing
import auth from "./api/helpers/auth";

// https://stackoverflow.com/questions/39071430/enabling-cross-origin-resource-sharing-cors-in-expressjs-framework-on-nodejs-d
import cors from 'cors';

app.use(cors());

const config = {
  appRoot: __dirname, // required config

  // https://github.com/swagger-api/swagger-node/issues/228#issuecomment-163805253
  // https://github.com/miguelduarte42/swagger-jwt-example/blob/master/app.js
  swaggerSecurityHandlers: {
    Bearer: auth.verifyToken
    // api_key: function (req, authOrSecDef, scopesOrApiKey, cb) {
    //   // your security code
    //   if ('1234' === scopesOrApiKey) {
    //     cb(true);
    //   } else {
    //     cb(new Error('access denied!'));
    //   }
    // }
  }
};

import mongoose from 'mongoose';

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  connect()

  const port = process.env.PORT || 10010;
  app.listen(port);
});

function connect () {
  // https://github.com/madhums/node-express-mongoose-demo/blob/master/server.js
  const options = {
    useMongoClient: true,
    server: {socketOptions: {keepAlive: 1}},
  };
  // return mongoose.connect(config.db, options).connection;

  // http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);
  return mongoose.connect('mongodb://localhost/azviewer', options).connection;
}