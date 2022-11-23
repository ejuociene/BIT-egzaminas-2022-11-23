import { useEffect, useContext } from "react";
import MainContext from "../../context/MainContext";

const Alert = () => {
  const { alert, setAlert } = useContext(MainContext);
  useEffect(() => {
    if (alert?.message !== "") {
      setTimeout(() => {
        setAlert({ message: "" });
      }, 5000);
    }
  }, [alert, setAlert]);
  return (
    alert?.message && (
      <div className={"alert alert-" + alert.status}>{alert.message}</div>
    )
  );
};

export default Alert;
