import { useState } from "react";
import { Spinner } from "../../shared";
import { MdOutlineMail } from "react-icons/md";
import style from "./resetPassword.module.css";

export function ResetPassword() {
  // declaring consts
  const [input, setInput] = useState({});
  const [loader, setLoader] = useState(false);

  // utill functions
  function validateInput(identifier, value) {
    switch (identifier) {
      case "resetPassword__email":
        const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return email_regex.test(value);

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
    <div className={style.resetPassword__wrapper}>
      <h1 className={style.resetPassword__heading}>Reset Password</h1>

      <div
        className={
          input.resetPassword__email?.validationPassed
            ? style.resetPassword__inputContainer__validated
            : style.resetPassword__inputContainer
        }
      >
        <MdOutlineMail
          className={
            input.resetPassword__email?.validationPassed
              ? style.resetPassword__inputIcon__validated
              : style.resetPassword__inputIcon
          }
        />
        <input
          className={style.resetPassword__inputField}
          id="resetPassword__email"
          name="resetPassword__email"
          type="email"
          placeholder="Email"
          value={getInputValue("resetPassword__email")}
          onFocus={(e) => setFocus(e, true)}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => setFocus(e, false)}
        />
      </div>

      <a
        className={`${style.resetPassword__resetBtn} ${
          loader ? "bgHidden" : ""
        }`}
        onClick={() => setLoader(!loader)}
      >
        {loader ? <Spinner /> : "Reset Password"}
      </a>
    </div>
  );
}
