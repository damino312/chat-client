import React, { useState } from "react";
import axios from "axios";

export default function RegistrationPage() {
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
    <div className="flex mx-auto justify-center h-screen items-center bg-slate-400">
      <form
        onSubmit={(ev) => handleSubmit(ev)}
        className=" p-10 bg-white   w-full max-w-md m-2 rounded-xl"
      >
        <div className="flex justify-between ">
          <div>
            <label className="flex gap-3 mb-1" htmlFor="name">
              <span className=" text-xl">Имя:</span>
            </label>
            <label className="flex gap-3 mb-1" htmlFor="login">
              <span className=" text-xl">Логин:</span>
            </label>
            <label className="flex gap-3 mb-1" htmlFor="password">
              <span className=" text-xl">Пароль:</span>
            </label>
          </div>
          <div>
            <input
              id="name"
              type="text"
              onChange={(ev) => setName(ev.target.value)}
              className=" border rounded-md pl-2 block mb-2"
            />
            <input
              id="login"
              type="text"
              onChange={(ev) => setLogin(ev.target.value)}
              className=" border rounded-md pl-2 block mb-2"
            />
            <input
              id="password"
              type="password"
              onChange={(ev) => setPassword(ev.target.value)}
              className=" border rounded-md pl-2 block mb-2"
            />
          </div>
        </div>

        <button className="block mt-5 bg-slate-400 px-5 py-2 rounded-lg text-white hover:bg-red-800">
          Регистрация
        </button>
      </form>
    </div>
  );
}
