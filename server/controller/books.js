import express from 'express';
import db from '../database/connect.js';
import upload from "../middleware/multer.js"
import { booksValidator } from '../middleware/validate.js';
import { adminAuth, auth } from '../middleware/auth.js';
import {Op} from 'sequelize'

const router = express.Router();

router.get('/', auth, async (req, res) => {
	const options = {};
	if (req.query.filter && req.query.filter !== "0") {
		{options.where = { category: req.query.filter }}}
	if (req.query.search) {
		options.where = {
			...options.where,
			[Op.or]: [
				{ title: { [Op.like]: `%${req.query.search}%` } },
				{ author: { [Op.like]: `%${req.query.search}%` } },
				{ ISBN: { [Op.like]: `%${req.query.search}%` } }
			]
		};
	}
	try {
		const books = await db.Books.findAll(options);
		res.json(books);
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.get('/user', auth, async (req, res) => {
	try {
		const books = await db.Books.findAll({ where: { userId: req.session.user.id, isReserved: true  } });
		res.json(books);
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.get('/categories', async (req, res) => {
	try {
		let categories = await db.Books.findAll({ attributes: [ 'category' ] });
		categories = categories.map((item) => item.category);
		const unique = (value, index, self) => {
			return self.indexOf(value) === index;
		};
		const uniqueCategories = categories.filter(unique);
		res.json(uniqueCategories);
	} catch (err) {
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.post('/new', upload.single("image"), adminAuth, booksValidator, async (req, res) => {
    console.log(req.body)
	try {
        if (req.file) req.body.image = '/uploads/' + req.file.filename;
		await db.Books.create(req.body);
		res.send('Nauja knyga sėkmingai pridėta');
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.get('/:id', adminAuth, async (req, res) => {
	try {
		const book = await db.Books.findByPk(req.params.id)
		res.json(book);
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.put('/edit/:id', adminAuth, booksValidator, async (req, res) => {
	try {
		const book = await db.Books.findByPk(req.params.id);
		await book.update(req.body);
		res.send('Knygos informacija sėkmingai atnaujinta');
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.put('/reserve/:id', auth, async (req, res) => {
	try {
		const date = new Date();
		date.setDate(date.getDate() + 7);
		const book = await db.Books.findByPk(req.params.id);
		await book.update({
			userId: req.session.user.id,
			reservationDate: date,
			isReserved: true
		});
		res.send('Knyga sėkmingai rezervuota');
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});


router.put('/return/:id', auth, async (req, res) => {
	try {
		const book = await db.Books.findByPk(req.params.id);
		await book.update({
			isReserved: 0,
			extendedTimes: 0
		});
		res.send('Knyga sėkmingai grąžinta');
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.put('/extend/:id', auth, async (req, res) => {
	try {
		const book = await db.Books.findByPk(req.params.id);
		const reservedDate = new Date(book.reservationDate)
		const newDate = reservedDate.setDate(reservedDate.getDate() + 7);
		if (book.extendedTimes === 2) {
			throw "Daugiau pratęsti negalima" }
		const extendedTimesUpdated = book.extendedTimes + 1
		await book.update({
			reservationDate: newDate,
			extendedTimes: extendedTimesUpdated
		});
		res.send('Knyga sėkmingai pratęsta');
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

router.delete('/delete/:id', adminAuth, async (req, res) => {
	try {
		const book = await db.Books.findByPk(req.params.id);
		await book.destroy();
		res.send('Knyga ištrinta');
	} catch (err) {
		console.log(err);
		res.status(500).send('Įvyko serverio klaida');
	}
});

export default router;
