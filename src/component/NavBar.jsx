import React from "react";

export default function NavBar({ children }) {
  return (
    <nav className="flex-grow block ">
      <ul className="max-w-full h-full flex justify-end">{children}</ul>
    </nav>
  );
}
