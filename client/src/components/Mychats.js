import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import {getSender} from '../config/ChatLogics'
import GroupchatModel from "./GroupchatModel";

const Mychats = ({showAlert,fetchChatagain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChat = async () => {
    const response = await fetch("http://localhost:5000/api/chat/fetchchat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": JSON.parse(localStorage.getItem("token")),
      },
    });
    const json = await response.json();
    setChats(json);
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user-info")));
    fetchChat();
  }, [fetchChatagain]);

  return (
    <div
      className={`${
        selectedChat?"hidden":"flex"} md:flex items-center h-[100%] md:w-[31%] w-[100%] p-3 flex-col bg-white rounded `}
    >
      <div className="pb-3 text-xl px-3 flex w-[100%] justify-between items-center">
        My Chats
        <GroupchatModel showAlert={showAlert} >
        <button className="flex items-center bg-gray-200 px-2 py-1 rounded">
          New Group Chat
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button></GroupchatModel>
      </div>
      <div className="flex flex-col p-3 w-[100%] h-[100%] overflow-hidden rounded">
        {chats ? (
          <div className="overflow-y-scroll m-2">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 my-2 rounded bg-${
                  selectedChat === chat ? "[#0dd3ff]" : "gray-200"
                } text-${selectedChat === chat ? "white" : "black"}`}
             key={chat._id} >
              <p>
                {!chat.isGroupChat?(
                  getSender(loggedUser,chat.users)
                ):chat.chatName}
              </p>
             </div>
            ))}
          </div>
        ) : (
          <h1>loading</h1>
        )}
      </div>
    </div>
  );
};

export default Mychats;
