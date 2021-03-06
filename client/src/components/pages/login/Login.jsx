import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Spinner } from "../../shared";
import { MdOutlineVpnKey, MdOutlineMail } from "react-icons/md";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import style from "./login.module.css";

export function Login() {
  // declaring consts
  const [input, setInput] = useState({});
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  // utill functions
  async function logIn() {
    const emailObj = input.login__email;
    const passwordObj = input.login__password;

    if (!emailObj?.validationPassed || !passwordObj?.validationPassed) {
      return;
    }

    try {
      setLoader(true);
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "*/*" },
        body: JSON.stringify({
          email: emailObj.value,
          password: passwordObj.value
        })
      };
      const response = await fetch("http://localhost:3001/login", options);
      const json_res = await response.json();

      setLoader(false);
      if (json_res.status) {
        if (json_res.token) {
          localStorage.setItem("AUTH_TOKEN", json_res.token)
          history.push("/")
        }
      } else {
        console.log(json_res);
        setError(String(json_res.error))
      }

    } catch (error) {
      console.log(error);
    }
  }

  function validateInput(identifier, value) {
    switch (identifier) {
      case "login__email":
        const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(value);

      case "login__password":
        const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        return password_regex.test(value);

      default:
        break;
    }
  }

  function getInputValue(identifier) {
    return input[identifier]?.value ? input[identifier].value : "";
  }

  function handleChange(event) {
    setInput({
      ...input,
      [event.target.id]: {
        value: event.target.value,
        isFocused: true,
        validationPassed: validateInput(event.target.id, event.target.value)
      }
    });
  }

  function setFocus(event, status) {
    setInput({
      ...input,
      [event.target.id]: {
        ...input[event.target.id],
        isFocused: status,
        validationPassed: validateInput(event.target.id, event.target.value)
      }
    });
  }

  // jsx element to render
  return (
    <div className={style.login__wrapper}>
      <h1 className={style.login__heading}>Login</h1>

      <div
        className={
          input.login__email?.validationPassed
            ? style.login__inputContainer__validated
            : style.login__inputContainer
        }
      >
        <MdOutlineMail
          className={
            input.login__email?.validationPassed
              ? style.login__inputIcon__validated
              : style.login__inputIcon
          }
        />
        <input
          className={style.login__inputField}
          id="login__email"
          name="login__email"
          type="email"
          placeholder="Email"
          value={getInputValue("login__email")}
          onFocus={(e) => setFocus(e, true)}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => setFocus(e, false)}
        />
      </div>

      <div
        className={
          input.login__password?.validationPassed
            ? style.login__inputContainer__validated
            : style.login__inputContainer
        }
      >
        <MdOutlineVpnKey
          className={
            input.login__password?.validationPassed
              ? style.login__inputIcon__validated
              : style.login__inputIcon
          }
        />
        <input
          className={style.login__inputField}
          id="login__password"
          name="login__password"
          type="text"
          placeholder="Password"
          value={getInputValue("login__password")}
          onFocus={(e) => setFocus(e, true)}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => setFocus(e, false)}
        />
      </div>

      <Link className={style.login__forgetPassword} to="/resetPassword">
        Forgot Password?
      </Link>

      <a
        className={`${style.login__loginBtn} ${loader ? "bgHidden" : ""}`}
        onClick={() => logIn()}
      >
        {loader ? <Spinner /> : "Login"}
      </a>

      {error ? <div className="error_wrapper"><p>* {error}</p></div> : null}
      <p>or login with</p>

      <div className={style.login__socialLogin__wrapper}>
        <div className={style.login__socialLoginBtn}>
          <BsGoogle />
          <a>Google</a>
        </div>
        <div className={style.login__socialLoginBtn}>
          <BsFacebook />
          <a>Facebook</a>
        </div>
      </div>

      <div className={style.login__signupContainer}>
        <span>Don't have an account? </span>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}
