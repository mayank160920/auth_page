import { Redirect } from "react-router-dom";
import style from "./home.module.css";

export function Home() {
  return (
    <div className={style.home__wrapper}>
      <Redirect to="/login" />
    </div>
  );
}
