import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import MainContext from "../../context/MainContext";

const Register = () => {
  const { setAlert } = useContext(MainContext);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const handleForm = (e) => {
    setForm((prevform) => {
      return { ...prevform, [e.target.name]: e.target.value };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/register", form)
      .then((resp) => {
        setAlert({ message: resp.data, status: "success" });
        navigate("/");
      })
      .catch((err) => {
        setAlert({ message: err.response.data, status: "danger" });
      });
  };
  return (
    <main className="container">
      <h1 className="title">Registruotis:</h1>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form--item">
          <label>Vardas:</label>
          <input
            type="text"
            className="form-input"
            name="firstName"
            onChange={(e) => handleForm(e)}
            value={form.firstName}
          />
        </div>
        <div className="form--item">
          <label>Pavardė:</label>
          <input
            type="text"
            className="form-input"
            name="lastName"
            onChange={(e) => handleForm(e)}
            value={form.lastName}
          />
        </div>
        <div className="form--item">
          <label>El.paštas:</label>
          <input
            type="email"
            className="form-input"
            name="email"
            onChange={(e) => handleForm(e)}
            value={form.email}
          />
        </div>
        <div className="form--item">
          <label>Slaptažodis:</label>
          <input
            type="password"
            minLength={5}
            name="password"
            className="form-input"
            onChange={(e) => handleForm(e)}
            value={form.password}
          />
        </div>
        <button className="form--btn">Tęsti</button>
      </form>
      <Link to={"/"} className="link">
        ← Atgal
      </Link>
    </main>
  );
};

export default Register;
