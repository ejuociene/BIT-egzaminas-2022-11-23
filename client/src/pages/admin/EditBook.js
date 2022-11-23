import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MainContext from '../../context/MainContext';

const EditBook = () => {
	const navigate = useNavigate();
    const {id} = useParams()
  const { setAlert, userInfo } = useContext(MainContext);
	const [ message, setMessage ] = useState('');
	const [ book, setBook ] = useState({
		title: '',
		author: '',
		ISBN: '',
		image: '',
    category: ""
	});
    useEffect(
		() => {
			axios.get(`/api/books/${id}`).then((resp) => setBook(resp.data)).catch((error) => {
				console.log(error);
				setAlert({ message: error.response.data, status: 'danger' });
				window.scrollTo(0, 0);
			});
		},
		[ id, setAlert ]
	);    
	const handleForm = (e) => {
		console.log(e.target);
		setBook((prevData) => {
			return { ...prevData, [e.target.name]: e.target.name === 'image' ? e.target.files[0] : e.target.value };
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		for (const key in book) {
			formData.append(key, book[key]);
		}
		axios
			.put(`/api/books/edit/${id}`, formData)
			.then((resp) => {
				setAlert({ message: resp.data, status: 'success' });
				navigate('/admin');
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
	return (
		<div className="container">
      <h2 className="intro-heading">Redaguoti knygą:</h2>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form--item">
          <label>Pavadinimas:</label>
          <input
            type="text"
            className="form-input"
            name="title"
            onChange={(e) => handleForm(e)}
            value={book.title}
          />
        </div>
        <div className="form--item">
          <label>Autorius:</label>
          <input
            type="text"
            className="form-input"
            name="author"
            onChange={(e) => handleForm(e)}
            value={book.author}
          />
        </div>
        <div className="form--item">
          <label>ISBN:</label>
          <input
            type="text"
            className="form-input"
            name="ISBN"
            onChange={(e) => handleForm(e)}
            value={book.ISBN}
          />
        </div>
        <div className="form--item">
          <label>Kategorija:</label>
          <input
            type="text"
            className="form-input"
            name="category"
            value={book.category}
            onChange={(e) => handleForm(e)}
          />
        </div>
        <div className="form--item">
          <label>Nuotrauka:</label>
          <img src={book.image} alt={book.title} className="small-icon"></img>
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

export default EditBook;
