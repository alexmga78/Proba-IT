"use strict";

var express = require('express');

var router = express.Router();

var checkAuthMeme = require('../middleware/check-auth-meme');

var checkOwnershipMeme = require('../middleware/check-meme-ownership');

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

var fileFIlter = function fileFIlter(req, file, cb) {
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Upload only .png files'), false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: fileFIlter
});

var MemeController = require("../controllers/meme");

router.get('/', MemeController.meme_get_all);
router.get('/:id', checkOwnershipMeme, MemeController.meme_get_byId);
router.get('/image/:memeImage', MemeController.meme_get_image_byName);
router.post('/', checkAuthMeme, upload.single('memeImage'), MemeController.meme_create);
router.patch('/:id', checkOwnershipMeme, MemeController.meme_modify);
router["delete"]('/:id', checkOwnershipMeme, MemeController.meme_delete);
module.exports = router;