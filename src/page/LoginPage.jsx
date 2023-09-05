import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Link } from "react-router-dom";
import { fetchUser } from "../feature/user/userSlice";

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
      console.log("LoginPage.jsx: Залогинился");
      setRedirect(true);
    } catch (er) {
      console.log(er.response.data);
    }
  }

  if (redirect || Boolean(user)) {
    console.log("Redirect ", redirect, Boolean(user));
    return <Navigate to="/chat" replace={true} />;
  }

  return (
    <div className="flex mx-auto justify-center h-screen items-center bg-slate-400">
      <form
        onSubmit={(ev) => handleSubmit(ev)}
        className=" p-10 bg-white   w-full max-w-md m-2 rounded-xl"
      >
        <div className="flex justify-between ">
          <div>
            <label className="flex gap-3 mb-1" htmlFor="login">
              <span className=" text-xl">Логин:</span>
            </label>
            <label className="flex gap-3 mb-1" htmlFor="password">
              <span className=" text-xl">Пароль:</span>
            </label>
          </div>
          <div>
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
        <button className="block mt-5 bg-slate-400 px-5 py-2 rounded-lg text-white hover:bg-red-800 ">
          Войти
        </button>
      </form>
      <Link to="/chat">hey</Link>
    </div>
  );
}
