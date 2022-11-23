import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import MainContext from "./context/MainContext";
import Header from "./components/Header/Header";
import Alert from "./components/Alert/Alert";
import Books from "./pages/public/Books"
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Admin from "./pages/admin/Admin";
import EditBook from "./pages/admin/EditBook";
import NewBook from "./pages/admin/NewBook";
import EditUser from "./pages/admin/EditUser";
import MyAccount from "./pages/public/MyAccount";
import "./App.css";

function App() {
  const [alert, setAlert] = useState({
    message: "",
    status: "",
  });
  const [userInfo, setUserInfo] = useState({});
  const [refresh, setRefresh] = useState(false);
  const contextValues = { userInfo, setUserInfo, alert, setAlert, setRefresh };
  useEffect(() => {
    axios
      .get("/api/users/check-auth/")
      .then((resp) => {
        setUserInfo(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);
  console.log(userInfo)
  return (
    <BrowserRouter>
      <MainContext.Provider value={contextValues}>
        <Header />
        <Alert />
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          {userInfo.id && 
          <>
          <Route path="/books" element={<Books />} />
          <Route path="/myAccount" element={<MyAccount />} />
          </>}
           {userInfo.role === 1 && 
            <>
            <Route path="/admin" element={<Admin />}/>
            <Route path="/books/new" element={<NewBook />}/>
            <Route path="/books/edit/:id" element={<EditBook />}/>
            <Route path="/user/edit/:id" element={<EditUser />}/>
            </>
            }
          </Routes>
        </div>
      </MainContext.Provider>
    </BrowserRouter>
  );
}

export default App;
