import React from "react";
import Login from "./LoginPage";
import { useDispatch, useSelector } from "react-redux";

export default function ChatPage() {
  return (
    <div className="flex mx-auto  h-screen">
      <div className=" w-1/3 bg-slate-400"> contacts </div>
      <div className="w-2/3 bg-black "></div>
    </div>
  );
}
