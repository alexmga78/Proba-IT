const { config } = require("dotenv");
config();
const express = require("express");
const index = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./api/routes/user");
const memeRoutes = require("./api/routes/meme");

mongoose.connect('mongodb://127.0.0.1:27017/Users', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

index.use(morgan("dev"));
index.use(bodyParser.urlencoded({ extended: true }));
index.use(bodyParser.json());

index.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "http://127.0.0.1:27017");
	res.header(
	"Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === 'OPTIONS') {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
		return res.status(200).json();
	}
	next();
});

//	Trimite request-urile (organizat)
index.use("/user", userRoutes);
index.use("/meme", memeRoutes);

index.use((req, res, next) => {
	const error = new Error("Not found");
	error.status = 404;
	next(error);
});

index.use((error, req, res, next) => {
res.status(error.status || 500);
	res.json({
		error: { message: error.message }
	});
});

module.exports = index;