import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import transition from "../transition";

const RegistrationPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(ev) {
    ev.preventDefault();
    try {
      const data = axios.post("/register", {
        login,
        password,
        name,
      });
      console.log(data);
    } catch (er) {
      console.error(er.data);
    }
  }

  return (
    <div className="flex mx-auto justify-center h-screen items-center bg-wh-user">
      <form
        onSubmit={(ev) => handleSubmit(ev)}
        className="p-10 bg-wh-dark-gray w-full max-w-sm mx-4 rounded-xl"
      >
        <div>
          <div>
            <input
              type="text"
              onChange={(ev) => setName(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Имя"
            />
            <input
              type="text"
              onChange={(ev) => setLogin(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Логин"
            />
            <input
              type="password"
              onChange={(ev) => setPassword(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Пароль"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button className="block mt-5 bg-wh-my-message px-5 py-2 rounded-lg text-white  w-36 font-semibold mb-4">
            Войти
          </button>
          <Link to="/" className="text-white font-semibold">
            У меня есть аккаунт
          </Link>
        </div>
      </form>
    </div>
  );
};

export default transition(RegistrationPage);
