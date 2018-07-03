// @flow

'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
mongoose.plugin(mongoosePaginate);

const fs = require('fs');
const swaggerMongoose = require('swagger-mongoose');
const swagger = fs.readFileSync('api/swagger/swagger.json');

const compiled = swaggerMongoose.compile(swagger);
const models = compiled.models;
// const schemas = compiled.schemas;

module.exports = {
  Person: models.Person,
  Work: models.Work,
  Favorite: models.Favorite,
  User: models.User,
};

