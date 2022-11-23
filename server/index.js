import express from 'express';
import session from 'express-session';
import cors from 'cors';
import Users from './controller/users.js';
import Books from "./controller/books.js"

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.set('trust proxy', 1);
app.use(
	session({
		secret: 'labai slapta fraze',
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: false,
			maxAge: 6000000
		}
	})
);

app.use('/api/users', Users);
app.use('/api/books', Books);

app.listen(3000);
