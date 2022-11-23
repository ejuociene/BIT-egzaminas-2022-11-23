import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';

const Books = () => {
	const { setAlert, userInfo } = useContext(MainContext);
	const navigate = useNavigate()
	const [ sort, setSort ] = useState('');
	const [ books, setBooks ] = useState([]);
	useEffect(
		() => {
			let url = '/api/books';
			// if (sort == '1' || sort == '2') {
			// 	url += '?sort=' + sort;
			// }
			axios.get(url).then((resp) => setBooks(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ sort ]
	);
	const handleReservation = (id) => {
		axios
			.put(`/api/books/reserve/${id}`)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'success' });
				navigate('/books');
			})
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
				if (error.response.status === 401) {
					navigate('/books');
				}
			});
	};
	console.log(books)
	return (
		<div className="container">
			<div className="heading">
				<h1 className="title">Knygų sąrašas</h1>
				{/* <select className="form-select narrow-input" onChange={(e) => setSort(e.target.value)}>
					<option>Numatytasis</option>
					<option value="1">Pagal pavadinimą A-Ž</option>
					<option value="2">Pagal pavadinimą Ž-A</option>
				</select> */}
			</div>
			<div className="books-list">
				{books &&
					books.map((book) => {
						return (
							<div key={book.id} className="book-card">
								<img src={book.image} alt={book.title} className="book-img"/> 
								<h3 className="book-title">{book.title}</h3>
								<h4 className='book-author'>{book.author}</h4>
								<p className='book-category'>{book.category}</p>
								<p className='book-ISBN'>ISBN: {book.ISBN}</p>
								{book.reservationDate ? 
								<p className='reserved'>Knyga rezervuota iki {book.reservationDate}</p>
							:
							<button className="btn book-btn" onClick={() => handleReservation(book.id)}>Rezervuoti</button>}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Books;
