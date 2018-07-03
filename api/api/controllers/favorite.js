// @flow

'use strict';

import type { $Request, $Response } from 'express';

const crypto = require('crypto');
const models = require('../models/models');

module.exports = {
  listFavorites,
  addFavorite,
  removeFavorite,
};

function listFavorites(req: $Request, res: $Response) {
  // バリデーションはスキーマ設計側で行っているので、この値が取れる時点で有効であることが保証されている
  const limit = req.swagger.params.limit.value;
  const page = req.swagger.params.page.value;
  const embed = req.swagger.params.embed.value;
  let query = buildQuery(req, res);

  if (!query) {
    return;
  }

  let options = {
    select:   '-_id -__v -_work',
    // sort:     { date: -1 },
    lean:     true,
    // offset:   1,
    page: page,
    limit:    limit,
    populate: undefined,
  };

  let populate = {};
  if (embed && embed.indexOf('_work') > -1) {
    Object.assign(populate, {path: '_work', model: 'Work', select: '-_id -__v'});
  }
  if (Object.keys(populate).length) {
    Object.assign(options, {select: '-_id -__v -id', populate: populate});
  }

  models.Favorite.paginate(query, options, function (err, result) {
    if (err)
      res.send(err);

    // embed指定あり
    if (Object.keys(populate).length) {
      const options2 = {
        path: '_work._person',
        model: 'Person',
        select: '-_id -__v -_works',
      };

      models.Favorite.populate(result.docs, options2, function (err, favorites) {
        res.json(favorites);
      });

    } else {
      res.json(result.docs);
    }

  });
}

function buildQuery(req, res) {
  const userId = req.auth.userId;

  if (!userId) {
    res.status(405).json({code: 10000, message: "insufficient parameters"});
    return null;
  }

  let query = {};
  if (userId) {
    Object.assign(query, {userId: userId});
  }
  return query;
}

function addFavorite(req: $Request, res: $Response) {
  let favorite = req.swagger.params.body.value;

  console.log("addFavorite");
  console.log(favorite);

  favorite.userId = req.auth.userId;

  models.Favorite.find({userId: favorite.userId, workId: favorite.workId}, function (err, favorites) {
    // 同じuserId+workIdがない場合のみ追加
    if (favorites.length === 0) {
      models.Work.findOne({workId: favorite.workId}, function (err, work) {
        if (work) {
          // ID自動発行
          // https://scotch.io/tutorials/speed-up-your-restful-api-development-in-node-js-with-swagger
          // TODO 要件見直し
          // favorite.id = crypto.randomBytes(20).toString('hex');
          favorite.favoriteId = crypto.randomBytes(20).toString('hex');
          favorite._work = work._id;
          models.Favorite.create(favorite, function (err, model) {
            // if (err) return handleError(err);

            // TODO 以下を参考にしているが、実装古いので見なおしたい
            // https://scotch.io/tutorials/speed-up-your-restful-api-development-in-node-js-with-swagger
            // res.json({success: 1, description: "Favorite added to the list!"});

            // TODO 作成したオブジェクトとエラーコードは別プロパティとして同一構造で返したい
            console.log(model);
            res.json(model);
          });
        } else {
          console.log("work not found");
          res.status(405).json({code: 10001, message: "work not found"});
        }

      });

    } else {
      // TODO 存在した場合のエラー処理を改善
      console.log("duplicate");
      res.status(405).json({code: 10000, message: "duplicate"});
    }
  });
}

function removeFavorite(req: $Request, res: $Response) {
  const favoriteId = req.swagger.params.favoriteId.value;

  console.log("removeFavorite");
  console.log(favoriteId);

  // トークンのuserIdと一致する場合のみ削除対象
  models.Favorite.findOneAndRemove({
    favoriteId: favoriteId,
    userId: req.auth.userId,
  }, function (err, favorite) {
    console.log(favorite);
    if (err)
      res.send(err);

    if (favorite) {
      res.json({success: 1, description: "Favorite removed from the list!"});
    } else {
      console.log("favorite not found");
      res.status(405).json({code: 10001, message: "favorite not found"});
    }
  });
}