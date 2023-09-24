import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../component/Contact";
import DropdownMenu from "../component/DropdownMenu";
import moment from "moment/moment";
import { motion } from "framer-motion";
import { LINK } from "../config/config";

import { logout } from "../feature/user/userSlice";

export default function ChatPage() {
  const [ws, setWs] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const myId = useSelector((state) => state.user.user?.id);
  const myLogin = useSelector((state) => state.user.user?.name);
  const dispatch = useDispatch();

  // Не удается обратиться к текущим значения state'ов в ws функциях onmessage и onclose, поэтому использовал ref для передачи значений в них
  const wsRef = useRef(null);
  const selectedUserIdRef = useRef(null);

  // users component
  const [offlinePeople, setOfflinePeople] = useState({});
  const [sortedOfflinePeople, setSortedOfflinePeople] = useState({});
  const [onlinePeople, setOnlinePeople] = useState({});
  const [sortedOnlinePeople, setsSortedOnlinePeople] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const lastMessagesRef = useRef(null);

  // chat component
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef(); // для прокрутки на последнее сообщение

  useEffect(() => {
    connectToWs();
  }, []);

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

      selectedUserIdRef.current = selectedUserId;
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
        setSortedOfflinePeople(offlinePeople);
      });
    }
  }, [onlinePeople, myId]);

  // Получение последних сообщений каждого юзера
  useEffect(() => {
    axios.post("/getlastmessages", { data: "lol" }).then((res) => {
      // -_- Заменить пост на гет
      setLastMessages(res.data);
      lastMessagesRef.current = res.data;
    });
  }, []);

  // Т.к. handleMessage не видит текущие состояния state'ов, приходится использовать ref и помещать его в handleMessage. Чтобы держать актуальное значение lastMessages в ref используется этот useEffect
  useEffect(() => {
    lastMessagesRef.current = lastMessages;
  }, [lastMessages]);

  function connectToWs() {
    if (wsRef.current != null) return; // Чтобы избежать создание повторного ws при ререндеринг компонента

    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;
    setWs(ws);
    ws.onmessage = handleMessage;
    ws.onclose = function (ev) {
      if (!ev.wasClean) {
        wsRef.current = null;
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
      const onlineUsersWithoutMe = { ...onlinePeople };
      delete onlineUsersWithoutMe[myId];
      setOnlinePeople(onlineUsersWithoutMe);
      setsSortedOnlinePeople(onlineUsersWithoutMe);
    } else if ("text" in messageData) {
      // Условие чтобы в messages записывались только сообщения из текущего открытого чата, а не из всех
      const messages1 = lastMessagesRef.current;
      messages1[messageData.sender] = {
        text: messageData.text,
        owner: false,
        file: messageData.file,
      };
      setLastMessages((prev) => {
        return { ...prev, ...messages1 };
      });
      console.log(messageData);

      if (messageData.sender === selectedUserIdRef.current) {
        setMessages((prev) => [
          {
            text: messageData.text,
            sender: messageData.sender,
            recipient: messageData.recipient,
            _id: messageData._id,
            file: messageData.file,
          },
          ...prev,
        ]);
      }
    }
  }

  function setLastestMessages(userId, text, owner, file) {
    const messages = lastMessages;
    messages[userId] = {
      text: text,
      owner: owner,
      file: { fileName: file },
    };
    lastMessagesRef.current = messages;
  }

  async function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    if (newMessage === "" && file === null) {
      return;
    } // надо доработать и написать чтобы, если только пробелы, то не отправлять

    if (file) {
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: "",
          _id: Date.now(), // надо ли это поле?
          file,
        })
      );

      setMessages((prev) => [
        {
          text: newMessage,
          _id: Date.now(),
          sender: myId,
          recipient: selectedUserId,
          file: file,
        },
        ...prev,
      ]);
    } else if (newMessage) {
      ws.send(
        JSON.stringify({
          recipient: selectedUserId,
          text: newMessage,
          _id: Date.now(), // надо ли это поле?
          file: null, // нужно ли указывать это если в модели по дефолту стоит null?
        })
      );
      setNewMessage("");
      setMessages((prev) => [
        {
          text: newMessage,
          _id: Date.now(),
          sender: myId,
          recipient: selectedUserId,
          file: null,
        },
        ...prev,
      ]);
    }
    setLastestMessages(selectedUserId, newMessage, true, file?.info);
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        info: ev.target.files[0].name,
        data: reader.result,
      });
      ev.target.value = null;
    };
  }

  function sortOfflineUsers(value) {
    const offline = {};
    for (let user in offlinePeople) {
      const userName = offlinePeople[user]; // имя пользователя
      const userKey = user; // ключ пользователя
      const regexp = new RegExp(value, "gi");
      if (userName.match(regexp)) {
        offline[userKey] = userName;
      }
    }
    setSortedOfflinePeople(offline);
  }

  function sortOnlineUsers(value) {
    const online = {};
    for (let user in onlinePeople) {
      const userName = onlinePeople[user]; // имя пользователя
      const userKey = user; // ключ пользователя
      const regexp = new RegExp(value, "gi");
      if (userName.match(regexp)) {
        online[userKey] = userName;
      }
    }
    setsSortedOnlinePeople(online);
  }

  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <div className=" bg-wh-bg">
      <div className="max-w-screen-xl w-full mx-auto h-screen flex p-4 box-border">
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
            <p className="font-bold text-xl flex-grow">{myLogin}</p>
            <DropdownMenu logOut={logOut} />
          </div>
          <div className="h-8 relative  ">
            <input
              type="text"
              className="h-full w-full block text-black pl-2 pr-8 box-border"
              onChange={(ev) => {
                sortOfflineUsers(ev.target.value);
                sortOnlineUsers(ev.target.value);
              }}
            />
            <motion.button
              className=" absolute top-1 right-1"
              whileHover={{ scale: 1.2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg "
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </motion.button>
          </div>

          {Object.keys(sortedOnlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              username={sortedOnlinePeople[userId]}
              lastMessages={lastMessages}
            />
          ))}
          {Object.keys(sortedOfflinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              username={sortedOfflinePeople[userId]}
              lastMessages={lastMessages}
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
                  {messagesWithoutDupes.map((message, index) => {
                    // Формат даты из монго для единого стиля
                    const mongoFormatOfCurrentDate = moment(
                      new Date()
                    ).toISOString();

                    const currentDate =
                      message.createdAt?.slice(0, 10) ??
                      mongoFormatOfCurrentDate.slice(0, 10);
                    // Для сообщений, который были только что написаны, а не подгружены (у них нет createdAt)
                    if (!message.createdAt) {
                      message.createdAt = mongoFormatOfCurrentDate;
                    }
                    const dateOfUpperIndex = messagesWithoutDupes[
                      index + 1
                    ]?.createdAt.slice(0, 10);

                    const currentTime = message.createdAt.slice(11, 16);

                    return (
                      <div key={message._id}>
                        {currentDate !== dateOfUpperIndex && (
                          <div className=" text-center text-sm my-6">
                            <span className=" px-2 py-1 bg-slate-600  rounded-md font-semibold">
                              {currentDate?.replace(/-/g, "/")}
                            </span>
                          </div>
                        )}
                        <div
                          className={
                            message.sender === myId
                              ? "text-right "
                              : "text-left "
                          }
                        >
                          <p
                            className={
                              " inline-block pl-2 pr-10 py-2 rounded-lg mb-4 max-w-md break-words text-left leading-5 relative " +
                              (message.sender === myId
                                ? " bg-wh-my-message "
                                : "bg-wh-selected ")
                            }
                          >
                            {message.file ? (
                              <a
                                href={
                                  LINK + "/uploads/" + message.file.filePath
                                }
                                className=" underline
                              "
                              >
                                {message.file.fileName ?? message.file.info}
                              </a>
                            ) : (
                              message.text
                            )}
                            <span className="absolute bottom-1 right-1 text-xs text-white">
                              {currentTime}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form
                  className="flex py-4 box-border bg-wh-dark-gray"
                  onSubmit={sendMessage}
                >
                  <input
                    type="text"
                    className="mx-4 flex-grow rounded-md pl-4 bg-wh-selected"
                    value={newMessage}
                    onChange={(ev) => setNewMessage(ev.target.value)}
                  />
                  <label className=" h-12 w-12 bg-wh-selected text-white flex justify-center items-center mr-4 flex-shrink rounded-md cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(ev) => sendFile(ev)}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 m-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                      />
                    </svg>
                  </label>
                  <button className=" h-12 w-12 bg-wh-selected text-white block mr-4 flex-shrink rounded-md ">
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
