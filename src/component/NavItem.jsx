import React, { useState } from "react";

export default function NavItem({ word, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="w-[calc(60px*0.8)] flex items-center justify-center relative"
      onClick={() => setOpen(!open)}
    >
      {word}
      {open && children}
    </div>
  );
}
