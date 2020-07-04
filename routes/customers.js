const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = (server) => {
	//Get Customers
	server.get('/customers', async (req, res, next) => {
		try {
			const customers = await Customer.find({});
			res.send(customers);
			next();
		} catch (err) {
			return next(new errors.InvalidContentError(err));
		}
	});

	//Get a single customer

	server.get('/customers/:id', async (req, res, next) => {
		let id = req.params.id;
		try {
			const customer = await Customer.findById(id);
			res.send(customer);
			next();
		} catch (err) {
			return next(
				new errors.InvalidContentError(`There is no customer by id: ${id}`)
			);
		}
	});

	//Add Customer

	server.post('/customers', async (req, res, next) => {
		//check for json
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json' ")
			);
		}

		const { name, email, balance } = req.body;
		const customer = new Customer({
			name,
			email,
			balance,
		});

		try {
			const newCustomer = await customer.save();
			res.send(201);
		} catch (err) {
			return next(new errors.InternalError(error.message));
		}
	});

	//Update customer
	server.put('/customers/:id', async (req, res, next) => {
		//check for json
		if (!req.is('application/json')) {
			return next(
				new errors.InvalidContentError("Expects 'application/json' ")
			);
		}
		let id = req.params.id;
		try {
			const customer = await Customer.findOneAndUpdate({ _id: id }, req.body);
			res.send(200);
			next();
		} catch (err) {
			return next(
				new errors.ResourceNotFoundError(`wrong id can't update customer`)
			);
		}
	});

	//Delete customer

	server.del('/customers/:id', async (req, res, next) => {
		let id = req.params.id;
		try {
			const customer = await Customer.findOneAndRemove(id);
			res.send(204);
			next();
		} catch (err) {
			return next(
				new errors.ResourceNotFoundError(`invalid id can't find customer`)
			);
		}
	});
};
