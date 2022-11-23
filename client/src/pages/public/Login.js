import React from "react";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import MainContext from "../../context/MainContext";

const Login = () => {
  const { userInfo, setAlert, setRefresh } =
    useContext(MainContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleForm = (e) => {
    setForm((prevform) => {
      return { ...prevform, [e.target.name]: e.target.value };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/login", form)
      .then((resp) => {
        setAlert({ message: resp.data, status: "success" });
        setRefresh((prevState) => !prevState);
        setTimeout(() => {
          userInfo.role === 1 ? navigate("/admin") : navigate("/books") }, 500);
      })
      .catch((err) => {
        console.log(err);
        setAlert({ message: err.response.data, status: "danger" });
      });
  };
  return (
    <main className="container">
      <h1 className="intro-heading">Sveiki atvykę į e-biblioteką!</h1>
      <h2 className="form-title">Prisijungti prie savo paskyros:</h2>
      <form className="form" onSubmit={(e) => handleSubmit(e)}>
        <div className="form--item">
          <label>El. paštas:</label>
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
            className="form-input"
            name="password"
            onChange={(e) => handleForm(e)}
            value={form.password}
          />
        </div>
        <button className="form--btn">Continue</button>
      </form>
      <div>
        Neturite paskyros?{" "}
        <Link to={"/register"} className="link bold">
          Registruotis
        </Link>
      </div>
      <br />
    </main>
  );
};

export default Login;
