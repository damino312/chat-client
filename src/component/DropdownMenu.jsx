import React, { useEffect, useState, useRef } from "react";

export default function DropdownMenu({ logOut }) {
  const [open, setOpen] = useState(false);
  const ulRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    ulRef.current.classList.add("hidden");
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  function addHidden() {
    timerRef.current = setTimeout(() => {
      ulRef.current?.classList.add("hidden");
    }, 290);
    return "";
  }
  function deleteHidden() {
    clearTimeout(timerRef.current);
    ulRef.current.classList.remove("hidden");
    return "";
  }

  return (
    <div className=" flex-grow relative">
      <div className="flex justify-end ">
        <button className="" onClick={() => setOpen(!open)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      <ul
        ref={ulRef}
        className={
          (open
            ? " animate-open " + deleteHidden()
            : " animate-close " + addHidden()) +
          " absolute bg-wh-selected w-24 right-0 top-8 py-2 px-8 text-center rounded-lg "
        }
      >
        <DropdownMenuItem>Профиль</DropdownMenuItem>
        <DropdownMenuItem onClick={() => logOut()}>Выйти</DropdownMenuItem>
      </ul>
    </div>
  );
}

function DropdownMenuItem({ children, onClick }) {
  return (
    <li className="border-b pb-1 mb-2 cursor-pointer" onClick={onClick}>
      <span>{children}</span>
    </li>
  );
}
