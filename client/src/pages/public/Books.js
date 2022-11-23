import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';

const Books = () => {
	const { setAlert, userInfo } = useContext(MainContext);
	const navigate = useNavigate()
	const [searchData, setSearchData] = useState("")
	const [filterData, setFilterData] = useState("")
	const [categories, setCategories] = useState([])
	const [ books, setBooks ] = useState([]);
	const [refresh, setRefresh] = useState(false)
	useEffect(
		() => {
			let url = `/api/books/?filter=${filterData}&search=${searchData}`
			axios.get(url).then((resp) => setBooks(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ refresh, filterData, searchData ]
	);
	useEffect(() => {
		axios
			.get('/api/books/categories')
			.then((resp) => setCategories(resp.data))
	}, [refresh]);

	const handleReservation = (id) => {
		axios
			.put(`/api/books/reserve/${id}`)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'success' });
				setRefresh(prevState => !prevState)
				navigate('/books');
			})
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
				if (error.response.status === 401) {
					navigate('/');
				}
			});
	};
	const endSearch = () => {
		setSearchData("")
	}
	console.log(books)
	return (
		<div className="container">
			<div className="heading">
				<h1 className="intro-heading">Knygų sąrašas</h1>
				<form className='filter-form' onSubmit={(e) => e.preventDefault()}>
					<div>

					<label className='sort-label'>Rūšiuoti pagal kategoriją: </label>
					<select value={filterData} name="filter" defaultValue="0" className="form-select narrow-input" onChange={(e) => setFilterData(e.target.value)}>
						<option value='0'>Visos</option>
						{categories.map((category) => {
							return (
								<option key={category} value={category}>
									{category}
								</option>
							);
						})}
					</select>
						</div>
					<div><input type="text" name="search" placeholder='Ieškoti' className='search' value={searchData} onChange={(e) => setSearchData(e.target.value)}/>
					<span className='exit' onClick={endSearch}>x</span>
					</div>
			</form>
		</div><div className="books-list">
				{books.length > 0 ?
					books.map((book) => {
						return (
							<div key={book.id} className="book-card">
								<img src={book.image} alt={book.title} className="book-img" />
								<h3 className="book-title">{book.title}</h3>
								<h4 className='book-author'>{book.author}</h4>
								<p className='book-category'>{book.category}</p>
								<p className='book-ISBN'>ISBN: {book.ISBN}</p>
								{book.isReserved ?
									<p className='reserved'>Knyga rezervuota iki {book.reservationDate}</p>
									:
									<button className="btn book-btn" onClick={() => handleReservation(book.id)}>Rezervuoti</button>}
							</div>
						);
					}) : 
					<div>Rezultatų nėra</div>}
			</div>
		</div>
	);
};

export default Books;
