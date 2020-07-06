const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

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
};
