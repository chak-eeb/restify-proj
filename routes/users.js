const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

module.exports = (server) => {
	// Register User route

	server.post('/register', async (req, res, next) => {
		const { email, password } = req.body;
		const user = new User({
			email,
			password,
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, async (err, hash) => {
				//hash password
				user.password = hash;
				try {
					const newUser = await user.save();
					res.send(200);
					next();
				} catch (err) {
					return next(new errors.InternalError(err.message));
				}
			});
		});
	});

	//Auth User
	server.post('/auth', async (req, res, next) => {
		const { email, password } = req.body;
		try {
			const user = await auth.authenticate(email, password);

			//jwt
			const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
				expiresIn: '15m',
			});

			const { iat, exp } = jwt.decode(token); //iat = issued at
			res.send({ iat, exp, token });

			next();
		} catch (err) {
			return next(new errors.NotAuthorizedError(err));
		}
	});
};
