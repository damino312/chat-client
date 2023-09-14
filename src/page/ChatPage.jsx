import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../component/Contact";
import NavBar from "../component/NavBar";
import NavItem from "../component/NavItem";
import DropdownMenu from "../component/DropdownMenu";

import { logout } from "../feature/user/userSlice";

export default function ChatPage() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const myId = useSelector((state) => state.user.user?.id);
  const myLogin = useSelector((state) => state.user.user?.name);

  const dispatch = useDispatch();
  const wsRef = useRef(null); // Чтобы избежать создание повторного ws при ререндеринг компонента
  // users component
  const [offlinePeople, setOfflinePeople] = useState({});

  // chat component
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef(); // для прокрутки на последнее сообщение

  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    if (wsRef.current != null) return; // Чтобы избежать создание повторного ws при ререндеринг компонента

    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.onclose = function (e) {
      if (!e.wasClean) {
        setTimeout(() => {
          console.log("Disconnected, trying to reconnect");
          connectToWs();
        }, 1000);
      }
    };
  }

  async function logOut() {
    await axios.get("/logout");
    dispatch(logout());
    ws.close();
  }

  function showOnlinePeople(peopleOnline) {
    const people = {};
    peopleOnline.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    return people;
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      const onlinePeople = showOnlinePeople(messageData.online);
      setOnlinePeople(onlinePeople);
      console.log(onlinePeople);
    } else if ("text" in messageData) {
      setMessages((prev) => [
        {
          text: messageData.text,
          sender: messageData.sender,
          recipient: messageData.recipient,
          _id: messageData.messageId,
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
        _id: Date.now(),
        sender: myId,
        recipient: selectedUserId,
      },
      ...prev,
    ]);
  }
  // Прокрутка контейнера вниз после добавления новых сообщений
  useEffect(() => {
    const div = messageContainerRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Загрузка истории сообщений выбраного юзера
  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  // Получение юзеров оффлайн
  useEffect(() => {
    if (myId) {
      axios.get("/people").then((res) => {
        const onlinePeopleIds = Object.keys(onlinePeople);
        const offlinePeopleArr = res.data
          .filter((user) => user._id !== myId)
          .filter((user) => !onlinePeopleIds.includes(user._id));
        const offlinePeople = {};
        offlinePeopleArr.forEach(
          (user) => (offlinePeople[user._id] = user.name)
        );
        setOfflinePeople(offlinePeople);
      });
    }
  }, [onlinePeople, myId]);

  const onlineUsersWithoutMe = { ...onlinePeople };
  delete onlineUsersWithoutMe[myId];

  const messagesWithoutDupes = uniqBy(messages, "_id");
  console.log("render");

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
            <p className="font-bold text-xl">{myLogin}</p>
            <NavBar>
              <NavItem
                word={
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
                      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                    />
                  </svg>
                }
              >
                <DropdownMenu logOut={() => logOut()}></DropdownMenu>
              </NavItem>
            </NavBar>
          </div>
          {Object.keys(onlineUsersWithoutMe).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              username={onlineUsersWithoutMe[userId]}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              username={offlinePeople[userId]}
            />
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
                    return (
                      <div
                        key={message._id}
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
