// @flow

'use strict';

import type { $Request, $Response } from 'express';

const models = require('../models/models');

module.exports = {
  listWorks, showWorkById,
};

function listWorks(req: $Request, res: $Response) {
  // バリデーションはスキーマ設計側で行っているので、この値が取れる時点で有効であることが保証されている
  const limit = req.swagger.params.limit.value;
  const page = req.swagger.params.page.value;
  const embed = req.swagger.params.embed.value;
  let query = buildQuery(req);

  let options = {
    select:   '-_id -__v -_person -id',  // paginateでundefinedなidが入る対策
    // sort:     { date: -1 },
    lean:     true,
    // offset:   1,
    page: page,
    limit:    limit,
    populate: undefined,
  };

  let populate = {};
  if (embed && embed.indexOf('_person') > -1) {
    Object.assign(populate, { path: '_person', select: '-_id -__v -_works' });
  }
  if (Object.keys(populate).length) {
    Object.assign(options, {select: '-_id -__v -id', populate: populate});
  }

  models.Work.paginate(query, options, function (err, result) {
    if (err)
      res.send(err);

    res.json(result.docs);
  });
}

function buildQuery(req) {
  const title = req.swagger.params.title.value;
  const personId = req.swagger.params.personId.value;
  const index = req.swagger.params.index.value;
  const q = req.swagger.params.q.value;

  if (title) {
    return {title: {$regex: new RegExp(title, "i")}};
  } else if (personId) {
    return {personId: personId};
  } else if (index) {
    return {titleSort: {$regex: new RegExp(`^${index}`, "i")}};
  } else if (q) {
    return {title: {$regex: new RegExp(q, "i")}};
  } else {
    return {}
  }
}

function showWorkById(req: $Request, res: $Response) {
  const workId = req.swagger.params.workId.value;
  const embed = req.swagger.params.embed.value;

  const populatePerson = (embed && embed.indexOf('_person') > -1);
  let select = '-_id -__v';
  if (!populatePerson) {
    select += ' -_person';
  }

  models.Work.findOne({workId: workId}, select, function (err, work) {
    if (err)
    // res.send(err);
      console.log(err);

    if (work) {
      if (populatePerson) {
        models.Person.populate(work, {path: '_person', select: '-_id -__v -_works'}, function () {
          res.json(work);
        });
      } else {
        res.json(work);
      }
    } else {
      console.log("work not found");
      res.status(405).json({code: 10001, message: "work not found"});
    }
  })
}
