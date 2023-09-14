import { useState, useEffect } from "react";

function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  // Функция для обработки нажатия клавиши
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // Функция для обработки отпускания клавиши
  function upHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  }

  useEffect(() => {
    // Добавляем слушатели событий
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Убираем слушатели событий при размонтировании компонента
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keyPressed;
}

export { useKeyPress };
