"use strict";

var mongoose = require('mongoose');

var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var User = require("../models/user");

exports.user_get_all = function (req, res, next) {
  User.find().select('_id email username password').exec().then(function (docs) {
    console.log(docs);
    res.status(200).json(docs);
  })["catch"](function (err) {
    console.log(err), res.status(500).json({
      error: err
    });
  });
};

exports.user_get_byId = function (req, res, next) {
  var id = req.params.id;
  User.findById(id).select('_id email username password').exec().then(function (doc) {
    console.log("From MongoDB", doc);

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: "User doesn't exist (No valid entry found for provided ID)"
      });
    }
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.user_signin = function (req, res, next) {
  User.find({
    email: req.body.email
  }).exec().then(function (user) {
    if (user.length > 0) {
      return res.status(409).json({
        message: "Mail exists"
      });
    } else {
      bcrypt.hash(req.body.password, 12, function (err, hash) {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          if (req.body.username.length < 8) {
            return res.status(409).json({
              username: "username too short",
              hint: "username should be between 8 and 32 characters"
            });
          } else if (req.body.username.length > 32) {
            return res.status(409).json({
              username: "username too long",
              hint: "usernam should be between 8 and 32 characters"
            });
          } else if (req.body.password.length < 8) {
            return res.status(409).json({
              password: "password too short",
              hint: "password should be between 8 and 32 characters"
            });
          } else if (req.body.password.length > 32) {
            return res.status(409).json({
              password: "password too long",
              hint: "password should be between 8 and 32 characters"
            });
          } else if (req.body.username == req.body.password) {
            return res.status(409).json({
              same_credentials: "you cannot have the same password as username"
            });
          } else {
            var _user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              username: req.body.username,
              password: hash
            });

            _user.save().then(function (result) {
              console.log(result);
              res.status(201).json({
                message: "User created",
                createdUser: {
                  _id: result._id,
                  email: result.email,
                  username: result.username,
                  password: result.password
                }
              });
            })["catch"](function (err) {
              console.log(err);
              res.status(500).json({
                username: "Username exists"
              });
            });
          }
        }
      });
    }
  });
};

exports.user_login = function (req, res, next) {
  User.find({
    email: req.body.email
  }).exec().then(function (user) {
    if (user.length < 1) return res.status(401).json({
      info: "auth failed"
    });
    console.log(req.body.username, user[0].username);
    /*	+ login prin username
    if (req.body.username != user[0].username)
    	return res.status(401).json({ info: "auth failed" });	*/

    bcrypt.compare(req.body.password, user[0].password, function (err, result) {
      if (err) return res.status(401).json({
        info: "auth failed"
      });

      if (result) {
        var token = jwt.sign({
          email: user[0].email,
          _id: user[0]._id
        }, "" + process.env.JWT_KEY, {
          expiresIn: "1h"
        });
        return res.status(200).json({
          //	Nu dam ca parametru unde a dat fail autentificarea (email/username/parola) ca sa evitam un posibil brute-force
          info: "auth successful",
          token: token
        });
      }

      res.status(401).json({
        info: "auth failed"
      });
    });
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.user_modify = function (req, res, next) {
  var id = req.params.id;
  var updateOps = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = req.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ops = _step.value;
      updateOps[ops.prop] = ops.value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  User.updateOne({
    _id: id
  }, {
    $set: updateOps
  }).select('_id email username password').exec().then(function (result) {
    console.log(result);
    res.status(200).json(result);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.user_delete = function (req, res, next) {
  var id = req.params.id;
  User.findById(id).exec().then(function (user) {
    if (user) {
      User.remove({
        _id: id
      }).select('_id email username password').exec().then(function (result) {
        res.status(200).json({
          message: "User deleted",
          result: result
        });
      })["catch"](function (err) {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    } else {
      res.status(404).json({
        message: "User doesn't exist "
      });
    }
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};