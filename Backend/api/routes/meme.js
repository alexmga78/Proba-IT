const express = require('express');
const router = express.Router();
const checkAuthMeme = require('../middleware/check-auth-meme');
const checkOwnershipMeme = require('../middleware/check-meme-ownership');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const fileFIlter = (req, file, cb) => {
	if (file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Upload only .png files'), false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 2
	},
	fileFilter: fileFIlter
});

const MemeController = require("../controllers/meme");


router.get('/', MemeController.meme_get_all);

router.get('/:id', checkOwnershipMeme, MemeController.meme_get_byId);

router.get('/image/:memeImage', MemeController.meme_get_image_byName);

router.post('/', checkAuthMeme, upload.single('memeImage'), MemeController.meme_create);

router.patch('/:id', checkOwnershipMeme, MemeController.meme_modify);

router.delete('/:id', checkOwnershipMeme, MemeController.meme_delete);

module.exports = router;
