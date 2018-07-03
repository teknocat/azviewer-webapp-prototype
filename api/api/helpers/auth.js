// https://github.com/miguelduarte42/swagger-jwt-example/blob/master/api/helpers/auth.js
"use strict";

import jwt from "jsonwebtoken";
const sharedSecret = process.env.AZVIEWER_SECRET;

//Here we setup the security checks for the endpoints
//that need it (in our case, only /protected). This
//function will be called every time a request to a protected
//endpoint is received
exports.verifyToken = function(req, authOrSecDef, token, callback) {
  if (sharedSecret == null) {
    console.error("sharedSecret is empty");
    return req.res.status(403).json({ message: "Error: sharedSecret is empty" });
  }

  console.log("verifyToken: " + token);

  //these are the scopes/roles defined for the current endpoint
  const currentScopes = req.swagger.operation["x-security-scopes"];

  function sendError() {
    return req.res.status(403).json({ message: "Error: Access Denied" });
  }

  //validate the 'Authorization' header. it should have the following format:
  //'Bearer tokenString'
  if (token && token.indexOf("Bearer ") === 0) {
    const tokenString = token.split(" ")[1];

    jwt.verify(tokenString, sharedSecret, (verificationError, decodedToken) => {
      //check if the JWT was verified correctly
      if (
        verificationError === null &&
        Array.isArray(currentScopes) &&
        decodedToken &&
        decodedToken.role
      ) {
        // check if the role is valid for this endpoint
        const roleMatch = currentScopes.indexOf(decodedToken.role) !== -1;

        // you can add more verification checks for the
        // token here if necessary, such as checking if
        // the username belongs to an active user

        if (roleMatch) {
          //add the token to the request so that we
          //can access it in the endpoint code if necessary
          req.auth = decodedToken;
          //if there is no error, just return null in the callback
          return callback(null);
        } else {
          //return the error in the callback if there is one
          return callback(sendError());
        }
      } else {
        //return the error in the callback if the JWT was not verified
        return callback(sendError());
      }
    });
  } else {
    //return the error in the callback if the Authorization header doesn't have the correct format
    return callback(sendError());
  }
}

exports.issueToken = function(userId, userName, role) {
  if (sharedSecret == null) {
    console.error("sharedSecret is empty");
    return;
  }

  const token = jwt.sign(
    {
      userId: userId,
      // sub: username,
      userName: userName,
      role: role
    },
    sharedSecret
  );
  return token;
}