import style from "./spinner.module.css";

export function Spinner(props) {
  return (
    <div className={style.spinner__wrapper} style={{ ...props.style }}>
      <div className={style.spinner__db1}></div>
      <div className={style.spinner__db2}></div>
    </div>
  );
}
