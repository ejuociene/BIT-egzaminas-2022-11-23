import express from 'express';
import bcrypt from 'bcrypt';
import db from '../database/connect.js';
// import { loginValidator, registerValidator } from '../middleware/validate.js';

const router = express.Router();
const saltRounds = 10;

router.post('/register', 
// registerValidator, 
async (req, res) => {
	try {
		const userExists = await db.Users.findOne({ where: { email: req.body.email } });
		if (userExists) {
			res.status(401).send('Šis el.paštas jau registruotas anksčiau');
			return;
		}
		req.body.password = await bcrypt.hash(req.body.password, saltRounds);
		await db.Users.create(req.body);
		res.send('Registracija sėkminga');
	} catch (err) {
		console.log(err);
		res.status(400).send('Registracija nesėkminga');
	}
});

router.post('/login', 
// loginValidator, 
async (req, res) => {
	try {
		const user = await db.Users.findOne({ where: { email: req.body.email } });
		if (!user) {
			return res.status(401).send('Toks vartotojas neegzistuoja');
		}
		if (await bcrypt.compare(req.body.password, user.password)) {
			req.session.user = {
				id: user.id,
				email: user.email,
			};
			return res.send('Prisijungimas sėkmingas');
		} else {
			return res.status(401).send('Prisijungimas nesėkmingas');
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send('Įvyko serverio klaida');
	}
});

router.get('/logout', (req, res) => {
	req.session.destroy();
	return res.send('Vartotojas išregistruotas');
});

router.get('/check-auth', async (req, res) => {
	try {
		res.send(req.session.user);
	} catch (err) {
		console.log(err);
		res.send('Įvyko serverio klaida');
	}
});

export default router;
