import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "../../shared/";
import style from "./home.module.css";

export function Home(props) {
  const history = useHistory();
  const [verified, setVerified] = useState(false);

  // utils functions 
  function logout() {
    if(!verified) {return}
    localStorage.removeItem("AUTH_TOKEN");
    history.push("/login");
  }

  // utill functions
  async function verifyToken() {
    try {
      const options = {
        method: "GET",
        headers: { "Content-Type": "application/json", "Accept": "*/*", "x-access-token": localStorage.getItem("AUTH_TOKEN") },
      };
      const response = await fetch("http://localhost:3001/dashboard", options);
      const json_res = await response.json();

      if (!json_res.status) {
        localStorage.removeItem("AUTH_TOKEN");
        history.push("/login");
      } else {
        setVerified(true);
      }

    } catch (error) {
      console.log(error);
    }
  }

  // useEffect hooks
  useEffect(() => {
    const auth_token = localStorage.getItem("AUTH_TOKEN");
    if (!auth_token) {
      history.push("/login");
    } else {
      verifyToken();
    }
  }, [])

  // jsx to render
  return (
    <div className={style.home__wrapper}>
      <h1 className={style.home__heading}>Dashboard</h1>
      <a className={style.home__logoutBtn} onClick={() => logout()}>{!verified ? <Spinner /> : "Logout"}</a>
    </div>
  );
}
