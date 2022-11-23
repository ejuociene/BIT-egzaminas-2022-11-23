import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from "../../context/MainContext"

const AdminUsers = () => {
	const { setAlert } = useContext(MainContext);
	const navigate = useNavigate();
	const [ users, setUsers ] = useState([]);
	const [ refresh, setRefresh ] = useState(false);
	useEffect(
		() => {
			axios.get('/api/users').then((resp) => setUsers(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ alert, refresh ]
	);

	const handleDelete = (id) => {
		axios
			.delete(`/api/users/delete/${id}`)
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
					<h1 className="table-title">Visi vartotojai:</h1>
				</div>
				{users ? (
					<table className="table">
						<thead>
							<tr>
								<th className="narrow">ID</th>
								<th>Vardas</th>
								<th>Pavardė</th>
								<th>El. paštas</th>
								<th>Rolė</th>
								<th className="btn-row" />
								<th className="btn-row" />
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user.id}>
									<td className="narrow">{user.id}</td>
									<td className='highlight'>
										{user.firstName}
									</td>
									<td>{user.lastName}</td>
									<td>{user.email}</td>
									<td>{user.role === 0 ? "Vartotojas" : "Administratorius"}</td>
									<td className="btn-row">
										<Link to={`/user/edit/${user.id}`}>
											<button className="inline-btn">Redaguoti</button>
										</Link>
									</td>
									<td className="btn-row">
										<button className="inline-btn" onClick={() => handleDelete(user.id)}>
											Ištrinti
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<h3>Nėra sukurtų vartotojų</h3>
				)}
		</div>
	);
};

export default AdminUsers;
