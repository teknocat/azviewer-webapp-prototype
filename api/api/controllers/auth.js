// @flow

// https://github.com/miguelduarte42/swagger-jwt-example/blob/master/api/controllers/main-controller.js
'use strict';

import type { $Request, $Response } from 'express';
import bcrypt from 'bcrypt';

const auth = require("../helpers/auth");
const models = require('../models/models');

exports.loginPost = function(req: $Request, res: $Response) {
  const role = req.swagger.params.role.value;
  const userName = req.body.userName;
  const password = req.body.password;

  console.log(role);
  console.log(req.body);

  let response;

  if (role !== "user" && role !== "admin") {
    response = {message: 'Error: Role must be either "admin" or "user"'};
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
  }

  models.User.findOne({userName: userName, role: role}, null, function (err, user) {
    if (err)
      console.log(err);

    if (user && bcrypt.compareSync(password, user.password)) {
      const tokenString = auth.issueToken(user.userId, userName, role);
      response = { token: tokenString };
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(response));
    } else {
      response = { message: "Error: Credentials incorrect" };
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(response));
    }
  });
};