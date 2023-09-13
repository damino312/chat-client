import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/user/userSlice";

export default function DropdownMenu({ setWs }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function logOut() {
    await axios.get("/logout");
    setWs();
    dispatch(logout());
    // navigate("/");
  }

  function DropdownItem({ onClick, children }) {
    return (
      <button
        className=" h-12 flex items-center justify-center p-2 border-b"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="absolute top-8 -right-8 w-48 transform -translate-x-11 p-4 overflow-hidden bg-wh-selected rounded-lg">
      <DropdownItem>Мой профиль</DropdownItem>
      <DropdownItem onClick={() => logOut()}>Выйти из профиля</DropdownItem>
    </div>
  );
}
