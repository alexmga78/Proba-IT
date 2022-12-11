"use strict";

var mongoose = require("mongoose");

var Meme = require("../models/meme");

exports.meme_get_all = function (req, res, next) {
  Meme.find().select("_id, description owner memeImage").exec().then(function (docs) {
    console.log(docs);
    res.status(200).json(docs);
  })["catch"](function (err) {
    console.log(err), res.status(500).json({
      error: err
    });
  });
};

exports.meme_get_byId = function (req, res, next) {
  var id = req.params.id;
  Meme.findById(id).select("_id description owner memeImage").exec().then(function (doc) {
    console.log("From MongoDB", doc);

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: "Meme doesn't exist (No valid entry found for provided ID)"
      });
    }
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.meme_get_image_byName = function (req, res, next) {
  var name_memeImage = req.params.memeImage;
  Meme.find({
    memeImage: name_memeImage
  }).select("_id description owner memeImage").exec().then(function (doc) {
    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({
        message: "Meme doesn't exist (No valid entry found for provided ID)"
      });
    }
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.meme_create = function (req, res, next) {
  var description_max_len = 2500;
  var len = req.body.description.length;

  if (len > description_max_len) {
    return res.status(409).json({
      description: "description too long",
      hint: "description should be under " + description_max_len + " characters"
    });
  } else {
    if (req.file) {
      console.log(req.file);
      var meme = new Meme({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
        owner: req.body.owner,
        memeImage: req.file.originalname
      });
      meme.save().then(function (result) {
        console.log(result);
        res.status(201).json({
          message: "Handling POST request to /products",
          createdMeme: {
            _id: result._id,
            description: result.description,
            owner: result.owner,
            memeImage: req.file.originalname
          }
        });
      })["catch"](function (err) {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    } else {
      console.log(req.file);

      var _meme = new Meme({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
        owner: req.body.owner
      });

      _meme.save().then(function (result) {
        console.log(result);
        res.status(201).json({
          message: "Handling POST request to /products",
          createdMeme: {
            _id: result._id,
            description: result.description,
            owner: result.owner
          }
        });
      })["catch"](function (err) {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    }
  }
};

exports.meme_modify = function (req, res, next) {
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

  Meme.updateOne({
    _id: id
  }, {
    $set: updateOps
  }).select("_id description owner memeImage").exec().then(function (result) {
    console.log(result);
    res.status(200).json(result);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};

exports.meme_delete = function (req, res, next) {
  var id = req.params.id;
  Meme.findById(id).exec().then(function (meme) {
    if (meme) {
      Meme.remove({
        _id: id
      }).select('_id email username password').exec().then(function (result) {
        res.status(200).json({
          message: "Meme deleted",
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
        message: "Meme doesn't exist "
      });
    }
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};