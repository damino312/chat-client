import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function RegistrationPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRedirected, setIsRedirected] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      await axios.post("/register", {
        login,
        password,
        name,
      });
      setIsRedirected(true);
    } catch (er) {
      console.error(er);
    }
  }

  if (isRedirected) return <Navigate to={"/"} />;

  return (
    <div className="flex mx-auto justify-center h-screen items-center bg-wh-user">
      <form
        onSubmit={(ev) => handleSubmit(ev)}
        className="p-10 bg-wh-dark-gray w-full max-w-sm mx-4 rounded-xl"
      >
        <div>
          <div>
            <input
              required
              type="text"
              onChange={(ev) => setName(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Имя"
            />
            <input
              required
              type="text"
              onChange={(ev) => setLogin(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Логин"
            />
            <input
              required
              type="password"
              onChange={(ev) => setPassword(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Пароль"
            />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <motion.button
            className="block mt-5 bg-wh-my-message px-5 py-2 rounded-lg text-white  w-36 font-semibold mb-4"
            whileHover={{ scale: 1.2 }}
          >
            Регистрация
          </motion.button>
          <motion.div whileHover={{ scale: 1.2 }}>
            <Link to="/" className="text-white font-semibold">
              У меня есть аккаунт
            </Link>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
