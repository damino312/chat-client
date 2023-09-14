import React from "react";
import { useDispatch } from "react-redux";

export default function DropdownMenu({ logOut }) {
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
      <DropdownItem onClick={logOut}>Выйти из профиля</DropdownItem>
    </div>
  );
}
