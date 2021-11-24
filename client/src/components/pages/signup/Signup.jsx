import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Spinner } from "../../shared";
import { MdOutlineVpnKey, MdOutlineMail } from "react-icons/md";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import style from "./signup.module.css";

export function Signup() {
  // declaring consts
  const [input, setInput] = useState({});
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  // utill functions
  async function signUp() {
    const emailObj = input.signup__email;
    const passwordObj = input.signup__password;

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
      const response = await fetch("http://localhost:3001/signup", options);
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
      case "signup__email":
        const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(value);

      case "signup__password":
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
    <div className={style.signup__wrapper}>
      <h1 className={style.signup__heading}>SignUp</h1>

      <div
        className={
          input.signup__email?.validationPassed
            ? style.signup__inputContainer__validated
            : style.signup__inputContainer
        }
      >
        <MdOutlineMail
          className={
            input.signup__email?.validationPassed
              ? style.signup__inputIcon__validated
              : style.signup__inputIcon
          }
        />
        <input
          className={style.signup__inputField}
          id="signup__email"
          name="signup__email"
          type="email"
          placeholder="Email"
          value={getInputValue("signup__email")}
          onFocus={(e) => setFocus(e, true)}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => setFocus(e, false)}
        />
      </div>

      <div
        className={
          input.signup__password?.validationPassed
            ? style.signup__inputContainer__validated
            : style.signup__inputContainer
        }
      >
        <MdOutlineVpnKey
          className={
            input.signup__password?.validationPassed
              ? style.signup__inputIcon__validated
              : style.signup__inputIcon
          }
        />
        <input
          className={style.signup__inputField}
          id="signup__password"
          name="signup__password"
          type="text"
          placeholder="Password"
          value={getInputValue("signup__password")}
          onFocus={(e) => setFocus(e, true)}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => setFocus(e, false)}
        />
      </div>

      <a
        className={`${style.signup__signupBtn} ${loader ? "bgHidden" : ""}`}
        onClick={() => signUp()}
      >
        {loader ? <Spinner /> : "Signup"}
      </a>

      {error ? <div className="error_wrapper"><p>* {error}</p></div> : null}
      <p>or signup with</p>

      <div className={style.signup__socialLogin__wrapper}>
        <div className={style.signup__socialLoginBtn}>
          <BsGoogle />
          <a>Google</a>
        </div>
        <div className={style.signup__socialLoginBtn}>
          <BsFacebook />
          <a>Facebook</a>
        </div>
      </div>

      <div className={style.signup__signupContainer}>
        <span>Already have an account? </span>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
