const mongoose = require("mongoose");

const Meme = require("../models/meme");

exports.meme_get_all = (req, res, next) => {
	Meme.find()
	.select("_id, description owner memeImage")
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

exports.meme_get_byId = (req, res, next) => {
	const id = req.params.id;
	Meme.findById(id)
	.select("_id description owner memeImage")
	.exec()
	.then(doc => {
		console.log("From MongoDB", doc);
		if (doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json({ message: "Meme doesn't exist (No valid entry found for provided ID)"});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};

exports.meme_get_image_byName = (req, res, next) => {
	const name_memeImage = req.params.memeImage;
	Meme.find({ memeImage: name_memeImage })
	.select("_id description owner memeImage")
	.exec()
	.then(doc => {
		if (doc) {
			res.status(200).json(doc);
		} else {
			res.status(404).json({ message: "Meme doesn't exist (No valid entry found for provided ID)"});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};

exports.meme_create = (req, res, next) => {
	const description_max_len = 2500;
	const { length: len } = req.body.description;
	if (len > description_max_len) {
		return res.status(409).json({ description: "description too long", hint: "description should be under " + description_max_len + " characters"});
	} else {
		if (req.file) {
			console.log(req.file);
			const meme =  new Meme ({
				_id: new mongoose.Types.ObjectId(),
				description: req.body.description,
				owner: req.body.owner,
				memeImage: req.file.originalname
			});
			meme
			.save()
			.then(result => {
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
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({ error: err });
			});
		} else {
			console.log(req.file);
			const meme =  new Meme ({
				_id: new mongoose.Types.ObjectId(),
				description: req.body.description,
				owner: req.body.owner
			});
			meme
			.save()
			.then(result => {
				console.log(result);
				res.status(201).json({
					message: "Handling POST request to /products",
					createdMeme: {
						_id: result._id,
						description: result.description,
						owner: result.owner
					}
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({ error: err });
			});
		}
	}
};


exports.meme_modify = (req, res, next) => {
	const id = req.params.id;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.prop] = ops.value;
	}
	Meme.updateOne({ _id: id }, { $set: updateOps })
	.select("_id description owner memeImage")
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

exports.meme_delete = (req, res, next) => {
	const id = req.params.id;
	Meme.findById(id)
	.exec()
	.then(meme => {
		if (meme) {
			Meme.remove({ _id: id })
			.select('_id email username password')
			.exec()
			.then(result => {
				res.status(200).json({
					message: "Meme deleted",
					result
				});
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({ error: err });
			});
		} else {
			res.status(404).json({ message: "Meme doesn't exist "});
		}
		
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({ error: err });
	});
};
