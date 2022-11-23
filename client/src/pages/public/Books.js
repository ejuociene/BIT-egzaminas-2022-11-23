import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';
import addressImg from '../../images/address.svg';
import phoneImg from '../../images/phone.svg';

const Books = () => {
	const { setAlert, userInfo } = useContext(MainContext);
	const [ sort, setSort ] = useState('');
	const [ salons, setBooks ] = useState([]);
	useEffect(
		() => {
			let url = '/api/books/';
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
							<div key={book.id} className="books-card">
								<h2 className="title">{book.title}</h2>
								{/* <h4 className="info-text">
									<img src={addressImg} alt="address" className="info-icon" />
									{salon.address}
								</h4>
								<h4 className="info-text">
									<img src={phoneImg} alt="phone" className="info-icon" />
									{salon.phone}
								</h4>
								<Link to={userInfo.id ? '/new-order/' + salon.id : '/'} className="link">
									<button className="form--btn long">Rezervuoti laiką </button>
								</Link> */}
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default Books;
