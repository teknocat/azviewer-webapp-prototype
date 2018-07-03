// @flow

'use strict';

import type { $Request, $Response } from 'express';

const models = require('../models/models');

module.exports = {
  listPeople, showPersonById,
};

function listPeople(req: $Request, res: $Response) {
  // バリデーションはスキーマ設計側で行っているので、この値が取れる時点で有効であることが保証されている
  const limit = req.swagger.params.limit.value;
  const page = req.swagger.params.page.value;
  const embed = req.swagger.params.embed.value;
  let query = buildQuery(req);

  let options = {
    select:   '-_id -__v -_works -id',  // paginateでundefinedなidが入る対策
    // sort:     { date: -1 },
    lean:     true,
    // offset:   1,
    page: page,
    limit:    limit,
    populate: undefined,
  };

  let populate = {};
  if (embed && embed.indexOf('_works') > -1) {
    Object.assign(populate, {path: '_works', model: 'Work', select: '-_id -__v -_person'});
  }
  if (Object.keys(populate).length) {
    Object.assign(options, {select: '-_id -__v -id', populate: populate});
  }

  models.Person.paginate(query, options, function (err, result) {
    if (err)
      res.send(err);

    res.json(result.docs);
  });
}

function buildQuery(req) {
  const familyName = req.swagger.params.familyName.value;
  const givenName = req.swagger.params.givenName.value;
  const index = req.swagger.params.index.value;
  const q = req.swagger.params.q.value;

  if (familyName) {
    return {familyName: {$regex: new RegExp(familyName, "i")}};
  } else if (givenName) {
    return {givenName: {$regex: new RegExp(givenName, "i")}};
  } else if (index) {
    return {familyNameSort: {$regex: new RegExp(`^${index}`, "i")}};
  } else if (q) {
    return {$or: [{familyName: {$regex: new RegExp(q, "i")}}, {givenName: {$regex: new RegExp(q, "i")}}]};
  } else {
    return {};
  }
}

function showPersonById(req: $Request, res: $Response) {
  const personId = req.swagger.params.personId.value;
  const embed = req.swagger.params.embed.value;

  const populateWorks = (embed && embed.indexOf('_works') > -1);
  let select = '-_id -__v';
  if (!populateWorks) {
    select += ' -_works';
  }
  models.Person.findOne({personId: personId}, select, function (err, person) {
    if (err)
    // res.send(err);
      console.log(err);

    if (person) {
      if (populateWorks) {
        models.Work.populate(person, {path: '_works', select: '-_id -__v -_person'}, function () {
          res.json(person);
        });
      } else {
        res.json(person);
      }
    } else {
      console.log("person not found");
      res.status(405).json({code: 10001, message: "person not found"});
    }
  });
}
