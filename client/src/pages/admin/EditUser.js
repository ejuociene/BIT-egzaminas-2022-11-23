import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';

const EditUser = () => {
	const navigate = useNavigate();
    const {id} = useParams()
  const { setAlert, userInfo } = useContext(MainContext);
	const [ user, setUser ] = useState({
		firstName: '',
		lastName: '',
		email: '',
        role: ''
	});
    useEffect(
		() => {
			axios.get(`/api/users/${id}`).then((resp) => setUser(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ id, setAlert ]
	);    
	const handleForm = (e) => {
		console.log(e.target);
		setUser((prevData) => {
			return { ...prevData, [e.target.name]: e.target.value };
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.put(`/api/users/edit/${id}`, user)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'success' });
				navigate('/admin');
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
    console.log(user)
	return (
		<div className="container">
      <h2 className="intro-heading">Redaguoti vartotojo paskyrą:</h2>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form--item">
          <label>Vardas:</label>
          <input
            type="text"
            className="form-input"
            name="firstName"
            onChange={(e) => handleForm(e)}
            value={user.firstName}
          />
        </div>
        <div className="form--item">
          <label>Pavardė:</label>
          <input
            type="text"
            className="form-input"
            name="lastName"
            onChange={(e) => handleForm(e)}
            value={user.lastName}
          />
        </div>
        <div className="form--item">
          <label>El. paštas:</label>
          <input
            type="email"
            className="form-input"
            name="email"
            onChange={(e) => handleForm(e)}
            value={user.email}
          />
        </div>
        <div className="form--item">
          <label>Rolė:</label>
          <select
						name="role"
						className="form-select"
						onChange={(e) => handleForm(e)}
						defaultValue="0"
					>
						<option value="0"> Vartotojas
						</option>
                        <option value="1"> Administratorius
						</option>;
					</select>
        </div>
        <button className="form--btn">Išsaugoti</button>
      </form>
		</div>
	);
};

export default EditUser;
