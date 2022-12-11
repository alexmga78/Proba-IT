const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.user_get_all = (req, res, next) => {
	User.find()
	.select('_id email username password')
	.exec()
	.then(docs => {
		console.log(docs);
		res.status(200).json(docs);
	})
	.catch(err => {
		console.log(err),
		res.status(500).json({ error: err });
	});
};

exports.user_get_byId = (req, res, next) => {
	const id = req.params.id;
	User.findById(id)
	.select('_id email username password')
	.exec()
	.then(doc => {
		console.log("From MongoDB", doc);
		if (doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json({ message: "User doesn't exist (No valid entry found for provided ID)"});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};

exports.user_signin = (req, res, next) => {
	User.find({ email: req.body.email })
	.exec()
	.then(user => {
		if (user.length > 0) {
			return res.status(409).json({ message: "Mail exists"});
		} else {
			bcrypt.hash(req.body.password, 12, (err, hash) => {
				if (err) {
					return res.status(500).json({ error: err });
				} else {
					if (req.body.username.length < 8) {
						return res.status(409).json({ username: "username too short", hint: "username should be between 8 and 32 characters"});
					} else if (req.body.username.length > 32) {
						return res.status(409).json({ username: "username too long", hint: "usernam should be between 8 and 32 characters"});
					} else if (req.body.password.length < 8) {
						return res.status(409).json({ password: "password too short", hint: "password should be between 8 and 32 characters"});
					} else if (req.body.password.length > 32) {
						return res.status(409).json({ password: "password too long", hint: "password should be between 8 and 32 characters"});
					} else if (req.body.username == req.body.password) {
						return res.status(409).json({ same_credentials: "you cannot have the same password as username" });
					} else {
						const user =  new User ({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							username: req.body.username,
							password: hash
						});
						user
						.save()
						.then(result => {
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
						})
						.catch(err => {
							console.log(err);
							res.status(500).json({ username: "Username exists" });
						});
					}
				}
			});
		}
	});
};


exports.user_login = (req, res, next) => {
	User.find({ email: req.body.email })
	.exec()
	.then(user => {
		if (user.length < 1)
			return res.status(401).json({ info: "auth failed" });
		console.log(req.body.username, user[0].username);	
		/*	+ login prin username
		if (req.body.username != user[0].username)
			return res.status(401).json({ info: "auth failed" });	*/
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if (err)
				return res.status(401).json({ info: "auth failed" });
			if (result) {
				const token = jwt.sign(
					{
						email: user[0].email,
						_id: user[0]._id
					},
					"" + process.env.JWT_KEY,
					{
						expiresIn: "1h"
					}
				);
				return res.status(200).json({
					//	Nu dam ca parametru unde a dat fail autentificarea (email/username/parola) ca sa evitam un posibil brute-force
					info: "auth successful",
					token: token
				});
			}
			res.status(401).json({ info: "auth failed" });
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};

exports.user_modify = (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.prop] = ops.value;
	}
	User.updateOne({ _id: id }, { $set: updateOps })
	.select('_id email username password')
	.exec()
	.then(result => {
		console.log(result);
		res.status(200).json(result);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};

exports.user_delete = (req, res, next) => {
	const id = req.params.id;
	User.findById(id)
	.exec()
	.then(user => {
		if (user) {
			User.remove({ _id: id })
			.select('_id email username password')
			.exec()
			.then(result => {
				res.status(200).json({
					message: "User deleted",
					result
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({ error: err });
			});
		} else {
			res.status(404).json({ message: "User doesn't exist "});
		}
		
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};