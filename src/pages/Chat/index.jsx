import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import sortIcon from "../../assets/icons/Sort.svg";
import emptyChat from "../../assets/images/emptyChat.svg";
import Menu from "../../assets/icons/Menu.svg";
import camera from "../../assets/icons/camera.svg";
import telephone from "../../assets/icons/telephone.svg";
import smile from "../../assets/icons/Smile.svg";
import send from "../../assets/icons/Send.svg";
import attachment from "../../assets/icons/Attachment.svg";
import { Link } from "react-router-dom";

const Chat = () => {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Marc Jacobs",
      messages: [
        { text: "Hi!", author: "user", date: "04:45 PM" },
        { text: "Hi, what are u doing?", author: "other", date: "04:45 PM" },
        { text: "...", author: "user", date: "04:45 PM" },
        { text: "Ok?", author: "other", date: "04:45 PM" },
        { text: "Hi!", author: "user", date: "04:45 PM" },
        { text: "Hi, what are u doing?", author: "other", date: "04:46 PM" },
        { text: "...", author: "user", date: "04:46 PM" },
        { text: "Ok?", author: "other", date: "04:47 PM" },
      ],
    },
    {
      id: 4,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other", date: "04:45 PM" },
        { text: "Ready for the meeting?", author: "user", date: "04:45 PM" },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "other",
          date: "04:45 PM",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
          date: "04:45 PM",
        },
      ],
    },
    {
      id: 3,
      name: "Maria Gouse",
      messages: [
        { text: "Hello!", author: "user" },
        { text: "How are you?", author: "other" },
        { text: "Hello!", author: "user" },
        { text: "How are you?", author: "other" },
      ],
    },
    {
      id: 2,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other" },
        { text: "Ready for the meeting?", author: "user" },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "other",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
        },
      ],
    },
    {
      id: 5,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other" },
        { text: "Ready for the meeting?", author: "user" },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "other",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
        },
      ],
    },
    {
      id: 6,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other" },
        { text: "Ready for the meeting?", author: "user" },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "other",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
        },
      ],
    },
    {
      id: 7,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other" },
        { text: "Ready for the meeting?", author: "user" },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "other",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
        },
      ],
    },
    {
      id: 8,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other" },
        { text: "Ready for the meeting?", author: "user" },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "other",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
        },
      ],
    },
    {
      id: 9,
      name: "Livia Mango",
      messages: [
        { text: "Good morning!", author: "other" },
        { text: "Ready for the meeting?", author: "user" },
        {
          text: " will check it and get back to you soon",
          author: "other",
        },
        {
          text: "Oh, hello! All perfectly I will check it and get back to you soon",
          author: "user",
        },
      ],
    },
  ]);
  const [activeChat, setActiveChat] = useState(null);

  const handleChatSelect = (params) => {
    setActiveChat(params);
  };
  const renderMessages = () => {
    const activateChat = chats.find((chat) => chat.id === activeChat?.id);
    if (!activateChat)
      return (
        <div className="emptyChat">
          <img src={emptyChat} />
          <p>Lorem ipsum dolor sit amet consectetur</p>
        </div>
      );

    return activateChat?.messages.map((message, index) => (
      <>
        <div className="message-item">
          <p
            key={index}
            className={`message-text ${
              message.author === "user" ? "user" : "other"
            }`}
          >
            {message.text}
          </p>
          <span
            style={{ alignSelf: message.author === "user" ? "end" : "start" }}
          >
            {message?.date}
          </span>
        </div>
      </>
    ));
  };

  const chatRef = useRef();
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [activeChat]);

  const containerHeight = activeChat?.name ? "48vh" : "75vh";
  const containerPadding = activeChat?.name ? "48px" : "0";
  return (
    <>
      <section className="chat_section">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className="col-lg-4 h-100">
              <div className="chats_list">
                <h1>Chat</h1>
                <div className="chatBox mt-3 mb-3">
                  <input type="text" name="" id="" placeholder="Search here" />
                  <button>
                    <img src={sortIcon} alt="" />
                  </button>
                </div>
                <div className="chats">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`chat-item ${
                        activeChat?.id === chat.id ? "active" : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="nickname">MG</div>
                      <div className="d-flex flex-column">
                        <h2>{chat.name}</h2>
                        <p>Lorem ipsum dolor sit amet cons...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-8 h-100">
              {activeChat?.name && (
                <div className="chat_messages_header">
                  <div className="d-flex align-items-center gap-3 message__user">
                    <div className="nickname">MG</div>
                    <div className="d-flex flex-column">
                      <h1>{activeChat.name}</h1>
                      <p>liviamango</p>
                    </div>
                  </div>
                  <div className="nick_icons">
                    <Link>
                      <img src={telephone} alt="" />
                    </Link>
                    <Link to='/call'>
                      <img src={camera} alt="" />
                    </Link>
                    <Link>
                      <img src={Menu} alt="" />
                    </Link>
                  </div>
                </div>
              )}
              <div
                className="chat_messages"
                ref={chatRef}
                style={{
                  height: containerHeight,
                  padding: containerPadding,
                  borderRadius: activeChat === null ? "24px" : "0",
                }}
              >
                {renderMessages()}
              </div>
              {activeChat?.name && (
                <div className="chat_messages_footer">
                  <button>
                    <img src={attachment} alt="" />
                  </button>
                  <input type="text" placeholder="Write a message" />
                  <img src={smile} alt="" className="smile" />
                  <img src={send} alt="" className="send" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Chat;
