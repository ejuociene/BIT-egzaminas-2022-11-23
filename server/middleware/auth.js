export const auth = (req, res, next) => {
	if (req.session.user.id) return next();
	return res.status(401).send('Vartotojo sesijos laikas pasibaigė');
};

export const adminAuth = (req, res, next) => {
	console.log(req.session)
	if (req.session.user.id && req.session.user.role === 1) return next();
	return res.status(401).send('Vartotojo sesijos laikas pasibaigė');
};
