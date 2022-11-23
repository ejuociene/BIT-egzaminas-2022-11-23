import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';

const NewBook = () => {
	const navigate = useNavigate();
  const { setAlert, userInfo } = useContext(MainContext);
	const [ message, setMessage ] = useState('');
	const [ form, setForm ] = useState({
		title: '',
		author: '',
		ISBN: '',
		image: '',
    category: ""
	});
	const handleForm = (e) => {
		console.log(e.target);
		setForm((prevData) => {
			return { ...prevData, [e.target.name]: e.target.name === 'image' ? e.target.files[0] : e.target.value };
		});
	};
	const handleSubmit = (e) => {
    e.preventDefault();
		const formData = new FormData();
		for (const key in form) {
			formData.append(key, form[key]);
		}
		axios
			.post('/api/books/new', formData)
      .then((resp) => {
        setAlert({ message: resp.data, status: "success" });
        navigate("/admin");
      })
			.catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				if (error.response.status === 401) {
					setTimeout(() => {
						navigate('/');
					}, 1000);
				}
			});
	};
	return (
		<div className="container">
      <h2 className="intro-heading">Pridėti naują knygą:</h2>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form--item">
          <label>Pavadinimas:</label>
          <input
            type="text"
            className="form-input"
            name="title"
            onChange={(e) => handleForm(e)}
            value={form.title}
          />
        </div>
        <div className="form--item">
          <label>Autorius:</label>
          <input
            type="text"
            className="form-input"
            name="author"
            onChange={(e) => handleForm(e)}
            value={form.author}
          />
        </div>
        <div className="form--item">
          <label>ISBN:</label>
          <input
            type="text"
            className="form-input"
            name="ISBN"
            onChange={(e) => handleForm(e)}
            value={form.ISBN}
          />
        </div>
        <div className="form--item">
          <label>Kategorija:</label>
          <input
            type="text"
            className="form-input"
            name="category"
            value={form.category}
            onChange={(e) => handleForm(e)}
          />
        </div>
        <div className="form--item">
          <label>Nuotrauka:</label>
          <input
            type="file"
            className="form-input"
            name="image"
            onChange={(e) => handleForm(e)}
          />
        </div>
        <button className="form--btn">Išsaugoti</button>
      </form>
		</div>
	);
};

export default NewBook;
