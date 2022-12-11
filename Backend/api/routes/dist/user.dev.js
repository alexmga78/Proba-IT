"use strict";

var express = require('express');

var router = express.Router();

var UserController = require("../controllers/user");

router.get('/', UserController.user_get_all);
router.get('/:id', UserController.user_get_byId);
router.post('/signin', UserController.user_signin);
router.post("/login", UserController.user_login);
router.patch('/:id', UserController.user_modify);
router["delete"]('/:id', UserController.user_delete);
module.exports = router;