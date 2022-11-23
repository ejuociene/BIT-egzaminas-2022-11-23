import Joi from 'joi';

const validate = (schema, req, res, next) => {
	console.log(req.body);
	const options = {
		abortEarly: true,
		stripUnknown: true
	};
	const { error, value } = schema.validate(req.body, options);
	let message = '';
	if (error) {
		console.log(error.details[0].path[0]);
		switch (error.details[0].path[0]) {
			case 'email':
				message = 'Neteisingas el.pašto adresas';
				break;
			case 'password':
				message = 'Slaptažodis turi turėti nuo 5 iki 12 ženklų';
				break;
			default:
				message = 'Prašome užpildyti visus laukelius';
				break;
		}
		return res.status(500).send(message);
	}
	req.body = value;
	next();
};

export const registerValidator = (req, res, next) => {
	const schema = Joi.object({
		firstName: Joi.string().min(1).max(255).required(),
		lastName: Joi.string().min(1).max(255).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(5).max(12).required(),
		role: Joi.number().allow('')
	});
	validate(schema, req, res, next);
};

export const loginValidator = (req, res, next) => {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(5).max(12).required()
	});
	validate(schema, req, res, next);
};

export const booksValidator = (req, res, next) => {
	const schema = Joi.object({
		title: Joi.string().min(1).required(),
		author: Joi.string().min(1).required(),
		ISBN: Joi.string().min(1).required(),
		image: Joi.string().allow(''),
		category: Joi.string().required(),
		isReserved: Joi.boolean().allow(''),
		reservationDate: Joi.date().allow(''),
		extendedTimes: Joi.number().integer().allow(""),
	});
	validate(schema, req, res, next);
}

export default validate;
