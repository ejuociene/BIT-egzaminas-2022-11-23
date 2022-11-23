import multer from 'multer';
import { access, mkdir } from 'fs/promises';

const uploadFolder = './uploads';

const storage = multer.diskStorage({
	destination: async function(req, file, cb) {
		try {
			await access(uploadFolder);
			cb(null, uploadFolder);
		} catch (err) {
			await mkdir(uploadFolder);
			cb(null, uploadFolder);
		}
	},
	filename: function(req, file, cb) {
		const ext = file.originalname.split('.');
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.' + ext[ext.length - 1];
		cb(null, uniqueSuffix);
	}
});
const upload = multer({
	storage: storage,
	fileFilter: function(req, file, next) {
		if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/webp') {
			next(null, true);
		} else {
			next(null, false);
		}
	}
});

export default upload;
