import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import { fetchUser } from "../feature/user/userSlice";
import { motion } from "framer-motion";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  async function handleSubmit(ev) {
    ev.preventDefault();
    try {
      await axios.post("/login", { login, password });
      dispatch(fetchUser());
      setRedirect(true);
    } catch (er) {}
  }

  if (redirect || Boolean(user)) {
    return <Navigate to="/chat" replace={true} />;
  }

  return (
    <div className="flex mx-auto justify-center h-screen items-center bg-wh-user">
      <form
        onSubmit={(ev) => handleSubmit(ev)}
        className=" p-10 bg-wh-dark-gray w-full max-w-sm mx-4 rounded-xl"
      >
        <div>
          <div>
            <input
              id="login"
              type="text"
              onChange={(ev) => setLogin(ev.target.value)}
              className="  rounded-md  block mb-4 w-full h-10 pl-4 box-border text-white  placeholder:font-semibold font-semibold bg-wh-selected border-0 "
              placeholder="Логин"
            />
            <input
              id="password"
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
            Войти
          </motion.button>
          <motion.div whileHover={{ scale: 1.2 }}>
            <Link to="/registration" className="text-white font-semibold">
              Регистрация
            </Link>
          </motion.div>
        </div>
      </form>
    </div>
  );
}
