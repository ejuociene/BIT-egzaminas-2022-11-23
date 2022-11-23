import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from "../../context/MainContext"

const MyAccount = () => {
	const { setAlert } = useContext(MainContext);
	const navigate = useNavigate();
	const [ books, setBooks ] = useState([]);
	const [ refresh, setRefresh ] = useState(false);
	useEffect(
		() => {
			axios.get('/api/books/user').then((resp) => setBooks(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ alert, refresh ]
	);
    const handleReturn = (id) => {
        axios
        .put(`/api/books/return/${id}`)
        .then((resp) => {
            setAlert({ message: resp.data, status: 'success' });
            setRefresh(prevState => !prevState)
        })
        .catch((error) => {
            console.log(error);
            setAlert({ message: error.response.data, status: 'danger' });
            window.scrollTo(0, 0);
            if (error.response.status === 401) {
                navigate('/login');
            }
        });
    };
    const handleExtend = (id) => {
        axios
        .put(`/api/books/extend/${id}`)
        .then((resp) => {
            setAlert({ message: resp.data, status: 'success' });
            setRefresh(prevState => !prevState)
        })
        .catch((error) => {
            console.log(error);
            setAlert({ message: error.response.data, status: 'danger' });
            window.scrollTo(0, 0);
            if (error.response.status === 401) {
                navigate('/login');
            }
        });
    }
    console.log(books)
	return (
		<div className='container'>
				<div className="table-heading">
					<h1 className="table-title">Mano knygos:</h1>
				</div>
				{books.length > 0 ? (
					<table className="table">
						<thead>
							<tr>
								<th className="narrow">ID</th>
								<th>Pavadinimas</th>
								<th>Autorius</th>
								<th>Kategorija</th>
								<th>ISBN</th>
                                <th>Rezervuota iki</th>
                                <th>Pratęsta kartų</th>
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
									<td>{book.reservationDate}</td>
									<td>{book.extendedTimes} / 2</td>
									<td className="btn-row">
											<button className="inline-btn" onClick={() => handleReturn(book.id)}>Grąžinti</button>
									</td>
									<td className="btn-row">
										<button className={book.extendedTimes === 2 ? "disabled-btn" : 'inline-btn'} disabled={book.extendedTimes === 2} onClick={() => handleExtend(book.id)}>
											Pratęsti
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<h3>Nėra rezervuotų knygų</h3>
				)}
		</div>
	);
};

export default MyAccount;
