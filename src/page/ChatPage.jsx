import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { uniqBy } from "lodash";

export default function ChatPage() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const myId = useSelector((state) => state.user.user?.id);

  // users component

  // chat component
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef(); // для прокрутки на последнее сообщение

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  function showOnlinePeople(peopleOnline) {
    const people = {};
    peopleOnline.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    return people;
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log(messageData);
    if ("online" in messageData) {
      const onlinePeople = showOnlinePeople(messageData.online);
      setOnlinePeople(onlinePeople);
    } else if ("text" in messageData) {
      setMessages((prev) => [
        {
          text: messageData.text,
          sender: messageData.sender,
          recipient: messageData.recipient,
          messageId: messageData.messageId,
        },
        ...prev,
      ]);
    }
  }

  function sendMessage(ev) {
    ev.preventDefault();
    if (newMessage === "") return; // надо доработать и написать чтобы, если только пробелы, то не отправлять
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      })
    );
    setNewMessage("");
    setMessages((prev) => [
      {
        text: newMessage,
        messageId: Date.now(),
        sender: myId,
        recipient: selectedUserId,
      },
      ...prev,
    ]);
  }

  useEffect(() => {
    // Прокрутка контейнера вниз после добавления новых сообщений
    const div = messageContainerRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]); // Добавьте messagesWithoutDupes в зависимости

  const usersWithoutMe = { ...onlinePeople };
  delete usersWithoutMe[myId];

  const messagesWithoutDupes = uniqBy(messages, "messageId");
  console.log(messages);

  return (
    <div className=" bg-wh-bg box-border">
      <div className="max-w-screen-xl w-full mx-auto h-screen flex p-4">
        <div className=" w-1/3 bg-wh-user text-white border-r border-wh-selected">
          <div className="flex py-6 px-4 gap-4 bg-wh-dark-gray">
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
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            <p className="font-bold text-xl">Чат РМЦ</p>
          </div>
          {Object.keys(usersWithoutMe).map((userId) => (
            <div
              key={userId}
              className={
                "py-4 border-b border-wh-selected flex gap-2 items-center cursor-pointer " +
                (userId === selectedUserId ? " bg-wh-selected" : "")
              }
              onClick={() => setSelectedUserId(userId)}
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
                <p className=" font-bold text-lg">{onlinePeople[userId]}</p>
                <p className=" text-gray-400 text-sm  ">Message</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 bg-wh-dark-gray text-white">
          <div className="flex flex-col h-full ">
            {!selectedUserId ? (
              <div className=" text-gray-300  flex items-center h-full justify-center">
                <p>&larr; Выберите пользователя из списка</p>
              </div>
            ) : (
              <>
                <div
                  ref={messageContainerRef}
                  className="flex-grow relative bg-[url('/1.png')] bg-repeat px-4 over overflow-y-auto flex flex-col-reverse"
                >
                  {messagesWithoutDupes.map((message) => {
                    console.log(message, myId);
                    return (
                      <div
                        key={message.messageId}
                        className={
                          message.sender === myId ? "text-right " : "text-left "
                        }
                      >
                        <p
                          className={
                            " inline-block px-4 py-2 rounded-lg mb-4 max-w-md break-words text-left leading-5 " +
                            (message.sender === myId
                              ? " bg-wh-my-message "
                              : "bg-wh-selected ")
                          }
                        >
                          {message.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <form
                  className="h-20 flex py-4 box-border bg-wh-dark-gray "
                  onSubmit={sendMessage}
                >
                  <input
                    type="text"
                    className="mx-4 flex-grow rounded-md pl-4 bg-wh-selected  "
                    value={newMessage}
                    onChange={(ev) => setNewMessage(ev.target.value)}
                  />
                  <button className=" w-12 bg-wh-selected text-white block mr-4 flex-shrink rounded-md ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 m-0 inline"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        className="m-0"
                      />
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
