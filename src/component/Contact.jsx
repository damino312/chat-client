import React from "react";
import { motion } from "framer-motion";

export default function Contact({
  id,
  selectedUserId,
  setSelectedUserId,
  username,
  online,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={
        "py-4 border-b border-wh-selected flex gap-2 items-center cursor-pointer " +
        (id === selectedUserId ? " bg-wh-selected" : "")
      }
      onClick={() => setSelectedUserId(id)}
    >
      <div className=" rounded-full bg-wh-dark-gray p-1 ml-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <div>
        <p className=" font-bold text-lg">{username}</p>
        <p className=" text-gray-400 text-sm  ">Message</p>
      </div>
      <div className="flex-grow flex justify-end ">
        <div
          className={
            "h-3 w-3 rounded-full mr-4 " +
            (online === true ? " bg-green-600" : "bg-gray-500")
          }
        ></div>
      </div>
    </motion.div>
  );
}
