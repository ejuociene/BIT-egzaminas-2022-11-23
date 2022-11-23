export const auth = (req, res, next) => {
	if (req.session.id) return next();
	return res.status(401).send('Vartotojo sesijos laikas pasibaigė');
};

