import React, { useEffect, useState, useRef } from "react";
import { useKeyPress } from "../hooks";

export default function DropdownMenu({ logOut }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timerRef = useRef(null);
  const btnRef = useRef(null);
  const isEscPressed = useKeyPress("Escape");

  // Выключение dropdown по нажатии на левое место на экране
  useEffect(() => {
    if (!open) return;

    function handleClick(ev) {
      if (
        !dropdownRef.current.contains(ev.target) &&
        !btnRef.current.contains(ev.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [open]);

  // Устрание анимации при первом рендеринге страницы
  useEffect(() => {
    dropdownRef.current.classList.add("hidden");
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);
  // Выключение dropdown по нажатии на клавишу
  useEffect(() => {
    if (isEscPressed) {
      setOpen(false);
    }
  }, [isEscPressed]);

  // Выбран подход через функции , потому что небыло варика по условию open добавлять hidden,
  // анимации не работали, нужна была задержка, чтобы анимация успела пройти

  // Функция позволяет пройти анимации закрытия dropdown и потом только скрыть сам dropdown
  // добавлением hidden
  function addHidden() {
    timerRef.current = setTimeout(() => {
      dropdownRef.current?.classList.add("hidden");
    }, 290);
    return "";
  }

  // Функция отображения dropdown
  function deleteHidden() {
    clearTimeout(timerRef.current);
    dropdownRef.current.classList.remove("hidden");
    return "";
  }

  return (
    <div className="  relative z-10 flex-1">
      <div className="flex justify-end " ref={btnRef}>
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
        ref={dropdownRef}
        className={
          (open
            ? " animate-open " + deleteHidden()
            : " animate-close " + addHidden()) +
          " absolute bg-wh-selected w-24 right-0 top-8 py-2 px-8 text-center rounded-lg border "
        }
      >
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
