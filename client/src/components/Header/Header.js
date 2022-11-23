import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import axios from "axios";
import MainContext from "../../context/MainContext";

const Header = () => {
  const { userInfo, setAlert, setUserInfo } = useContext(MainContext);
  const navigate = useNavigate();
  const logout = () => {
    axios
      .get("api/users/logout")
      .then((resp) => {
        setUserInfo({});
        setAlert({ message: resp.data, status: "success" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setAlert({ message: error.response.data, status: "danger" });
      });
  };
  return (
    <header className="header">
      <nav className="nav">
        <div className="logo-container">
          <div className="logo">E-Biblioteka</div>
        </div>
        <ul className="nav-list">
          {userInfo.id? (
            <>
                  <li>
            <Link to="/books" className="nav-link">
             Visos knygos
            </Link>
          </li>
            {userInfo.role === 1 ? <li>
                <Link to="/admin" className="nav-link">
                  Administratorius
                </Link>
              </li> 
              : 
              <>
              <li>
              <Link to="/myAccount" className="nav-link">
                Mano Paskyra
              </Link>
            </li>  
            </>        
              }
            <li className="nav-link" onClick={() => logout()}>
                Atsijungti
              </li>
            </>
          ) : (
            <li>
              <Link to="/" className="nav-link">
                Prisijungti
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
