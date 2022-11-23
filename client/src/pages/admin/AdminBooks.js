import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from "../../context/MainContext"

const AdminBooks = () => {
	const { setAlert } = useContext(MainContext);
	const navigate = useNavigate();
	const [ books, setBooks ] = useState([]);
	const [ refresh, setRefresh ] = useState(false);
	useEffect(
		() => {
			axios.get('/api/books').then((resp) => setBooks(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ alert ]
	);

	const handleDelete = (id) => {
		axios
			.delete(`/api/books/delete/${id}`)
			.then((resp) => setAlert({ message: resp.data, status: 'success' }))
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				setRefresh((prevState) => !prevState);
				window.scrollTo(0, 0);
				if (error.response.status === 401) {
					navigate('/login');
				}
			});
	};
	return (
		<div className='admin-section'>
				<div className="table-heading">
					<h1 className="table-title">Visos knygos:</h1>
					<Link to={'/books/new'} className="add-new link">
						+ Pridėti naują knygą
					</Link>
				</div>
				{books ? (
					<table className="table">
						<thead>
							<tr>
								<th className="narrow">ID</th>
								<th>Pavadinimas</th>
								<th>Autorius</th>
								<th>Kategorija</th>
								<th>ISBN</th>
								<th className="btn-row" />
								<th className="btn-row" />
							</tr>
						</thead>
						<tbody>
							{books.map((book) => (
								<tr key={book.id}>
									<td className="narrow">{book.id}</td>
									<td className='highlight'>
										{book.title}
									</td>
									<td>{book.author}</td>
									<td>{book.category}</td>
									<td>{book.ISBN}</td>
									<td className="btn-row">
										<Link to={`/books/edit/${book.id}`}>
											<button className="inline-btn">Redaguoti</button>
										</Link>
									</td>
									<td className="btn-row">
										<button className="inline-btn" onClick={() => handleDelete(book.id)}>
											Ištrinti
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<h3>Nėra pridėtų knygų</h3>
				)}
		</div>
	);
};

export default AdminBooks;
