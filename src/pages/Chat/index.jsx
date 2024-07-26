import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.scss";
import sortIcon from "../../assets/icons/Sort.svg";
import emptyChat from "../../assets/images/emptyChat.svg";
import Menu from "../../assets/icons/Menu.svg";
import camera from "../../assets/icons/camera.svg";
import telephone from "../../assets/icons/telephone.svg";
import smile from "../../assets/icons/Smile.svg";
import send from "../../assets/icons/Send.svg";
import attachment from "../../assets/icons/Attachment.svg";
import useAxios from "../../utils/useAxios";
import axios from "axios";
import empyAvatar from './../../assets/images/user-empty-avatar.png'
import { ChatContext } from "../../context/ChatContext";
import { Modal } from 'antd';
import EmojiPicker from "emoji-picker-react";
import { BASE_URL } from "../../api/baseUrl";



const Chat = () => {
  const axiosInstance = useAxios();
  const { USER_TOKKEN, myId, CHAT_API,  allChats, chatId, messages, setMessages, newMessage,  lastMessages, setNewMessage, socket, newChatUser, isModalCallOpen, onlineUsers, sendMessage, getMessage, addChat, getChats, deleteChat, setNewChatUser, setIsModalCallOpen } = useContext(ChatContext)
  

  const [findUser, setFindUser] = useState([]);
  const [openSearchList, setopenSearchList] = useState(false);
  const [isShowMessages, setIsShowMessages] = useState(false)
  const messagesDisplay = useRef(null)
  const [newChatState, setActiveChat] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);

  const pickerRef = useRef(null)


  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  const searchUser = async (value) => {
    if (value) {
      let res = await axios.get(`${BASE_URL}/user/users/?search=${value}`, {
        headers: {
          Authorization: `Bearer ${USER_TOKKEN}`
        }
      });
      setFindUser(res.data.filter(item => item.id != myId))
    } else {
      setFindUser([])
    }
  }






  const debouncedSearchUser = debounce(searchUser, 700);


  const isOpenSearchListHandler = () => {
    setopenSearchList(!openSearchList)
  }


  const chatRef = useRef();
  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);


  const containerHeight = messages.length && newChatUser.userId || newChatUser ? "48vh" : "75vh";
  const containerPadding = messages.length && newChatUser.userId || newChatUser ? "48px" : "";





  useEffect(() => {
    getChats();

   return () => {
    localStorage.setItem('newUserChatId', 0);
    localStorage.setItem('chatId', false);
    setMessages([])
    setNewMessage([])
    setNewChatUser(null)
   }
   }, [])


   const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsOpenEmoji(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <section className="chat_section">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div className={`col-lg-4 h-100 ${isShowMessages ? 'hide__chats' : ''}`}>
              <div className={`chats_list `}>
                <div className="chat__title">
                  <h1> Chat</h1>

                  {
                    allChats.length ?

                    <button onClick={() => setIsModalOpen(true)} className="create__new__chat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 5V15M15 10L5 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                  :
                  ''
                  }

                  <Modal open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    className={'modal__body chat__modal'}
                    styles={{
                      mask: {
                        backdropFilter: 'blur(10px)',
                        zIndex: 999999999999,
                      }
                    }}
                  >

                    <div className="search__user">
                      <input type="text" placeholder="Search here"
                        onInput={e => {
                          debouncedSearchUser(e.target.value)
                        }}
                        onBlur={e => {
                          isOpenSearchListHandler()
                        }}
                        onFocus={e => {
                          isOpenSearchListHandler()
                        }}
                      />
                      {
                        <div className={`search__result ${openSearchList ? 'isOpen' : ''}`}>
                          {
                            findUser.length ?
                              <ul>
                                {
                                  findUser.map(item => {
                                   
                                    return <li className="use__item" onClick={() => {
                                      setIsModalOpen(false)

                                      setTimeout(() => {
                                        window.innerWidth < 990 && window.scrollTo(0, document.body.scrollHeight);
                                      }, 100);
                                      if (allChats.find(chat => +chat.target.userId == +item.id)) {

                                        getMessage(allChats.find(chat => +chat.target.userId == +item.id).chatId)


                                      } else {
                                        setIsShowMessages(true)
                                        addChat({
                                          avatar: item.avatar,
                                          firstName: item.first_name,
                                          lastName: item.last_name,
                                          userId: item.id,
                                          username: item.userName
                                        })
                                        setTimeout(() => {
                                          window.innerWidth < 990 && window.scrollTo(0, document.body.scrollHeight);
                                        }, 100);
                                      }

                                    }}>
                                      <img src={item.avatar ? item.avatar : empyAvatar} alt="" />
                                      <div className="user__info">
                                        <h4>{item.first_name} {item.last_name}</h4>
                                      </div>
                                    </li>
                                  })
                                }
                              </ul>
                              :
                              <h5>This user does not exist</h5>
                          }
                        </div>
                      }
                    </div>


                  </Modal>
                </div>
                <div className="chatBox mt-3 mb-3">
                  <div className="search__user">
                    <input type="text" placeholder="Search here"
                      onChange={(e) => setUserName(e.target.value)}
                    />

                  </div>
                  <button>
                    <img src={sortIcon} alt="" />
                  </button>
                </div>
                <div className={`chats `}>
                  {
                    allChats.length ?
                    allChats.map((chat, ind) => {
                      if (chat?.target.firstName.toLowerCase().includes(userName.toLowerCase())) {
                        return <div
                          key={chat.chatId}
                          className={`chat-item ${+chat.target.userId == +localStorage.newUserChatId ? "active" : ""
                            } 
                      `}
                          onClick={() => {

                            setIsShowMessages(true)
                            getMessage(chat.chatId)
                            setTimeout(() => {
                              window.innerWidth < 990 && window.scrollTo(0, document.body.scrollHeight);
                            }, 100);
                          }}
                        >
                          <div className="nickname">
                            <img src={empyAvatar} alt="" />
                            {onlineUsers.some(item => +item == +chat.target.userId) && <hr className="is__online" />}
                          </div>
                          <div className="d-flex flex-column chat__user__info">
                            <h2>{`${chat?.target.firstName} ${chat?.target.lastName}`}</h2>
                            <p>
                              {
                                lastMessages[ind]?.lastMessage
                              }
                              {/* {
                                chat.isRead ? '| Read' : '| No Read'
                              } */}
                            </p>
                          </div>
                        </div>
                      }

                    }) 
                    : 
                    <div className="empty__chats">
                      <div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1213 9.87868C12.9497 8.70711 11.0503 8.70711 9.87868 9.87868C8.70711 11.0503 8.70711 12.9497 9.87868 14.1213L18.4232 22.6659C11.9796 29.1708 8 38.1207 8 48.0002V68.0002C8 76.8368 15.1634 84.0002 24 84.0002H52C59.8374 84.0002 67.0899 81.4957 73.0007 77.2434L81.8787 86.1213C83.0503 87.2929 84.9497 87.2929 86.1213 86.1213C87.2929 84.9497 87.2929 83.0503 86.1213 81.8787L63.2426 59H28C26.3431 59 25 57.6569 25 56C25 54.3431 26.3431 53 28 53H57.2426L47.2426 43H28C26.3431 43 25 41.6569 25 40C25 38.3431 26.3431 37 28 37H41.2426L14.1213 9.87868ZM43.9998 12H51.9998C71.882 12 87.9998 28.1178 87.9998 48C87.9998 54.866 86.0776 61.283 82.7422 66.7424L30.583 14.5833C34.7293 12.917 39.2575 12 43.9998 12Z" fill="#6B738A"/>
                    </svg>
                      </div>
                      <h4>There is no chat here</h4>
                      <button onClick={() => setIsModalOpen(true)} class="create__new__chat"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 5V15M15 10L5 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg> <span>New chat</span></button>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div ref={messagesDisplay} className={`col-lg-8 h-100 messages__side ${isShowMessages ? 'show__messages' : ''}`}>
              <button class="back__top" onClick={() => {

                setMessages([])
                setIsShowMessages(false);
                localStorage.setItem('chatId', 0)
                localStorage.setItem('newUserChatId', 0)
              }}><svg fill="#fff" width="28" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165ZM116.5,57.5a9.67,9.67,0,0,0-14,0L74,86a19.92,19.92,0,0,0,0,28.5L102.5,143a9.9,9.9,0,0,0,14-14l-28-29L117,71.5C120.5,68,120.5,61.5,116.5,57.5Z"></path></g></svg></button>
              <div className="messages__display">
                {(newChatUser && localStorage.chatId && localStorage.newUserChatId) && (
                  <div className="chat_messages_header">
                    <div className="d-flex align-items-center gap-3 message__user">
                      <div className="nickname">
                        <img src={empyAvatar} alt="" />
                        {onlineUsers.some(item => +item == +newChatUser.userId) && <hr className="is__online" />}
                      </div>
                      <div className="d-flex flex-column active__user__info">
                        <h2>{newChatUser.firstName} {newChatUser.lastName}</h2>
                        <p>{newChatUser?.username}</p>
                      </div>
                    </div>
                    <div className="nick_icons">
                      <div
                      onClick={() => {
                        socket.emit('sendMessage', { target: newChatUser.userId, message: {
                          action: `call to ${newChatUser.userId}`,
                          userInfo: newChatUser,
                          fromUserName: JSON.parse(localStorage.authTokens).first_name,
                          fromUserId: String(myId),
                          callType: 'voice'
                        } });

                       }
                      }
                      className="voice__call">
                        <button>
                        <img src={telephone} alt="" />
                        </button>
                      </div>
                     
                      <div className="video__call">
                      <button onClick={() => {

                        socket.emit('sendMessage', { target: newChatUser.userId, message: {
                          action: `call to ${newChatUser.userId}`,
                          userInfo: newChatUser,
                          fromUserName: JSON.parse(localStorage.authTokens).first_name,
                          fromUserId: String(myId),
                          callType: 'video'
                        } });

                       }
                      }>
                      <img src={camera} alt="" />
                      </button>
                      </div>
                     
                     
                      <ul className="chat__options">
                        <li>
                          <button >
                            <img src={Menu} alt="" />
                          </button>
                          <ul>
                            <li>
                              <button class="button" onClick={() => {
                              
                              if(+localStorage.chatId != 0) deleteChat(localStorage.chatId)
                                else {
                                  getChats();
                                  setMessages([]);
                                  setNewChatUser(null);
                                  localStorage.setItem('chatId', 0)
                              }

                              }}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 69 14"
                                  class="svgIcon bin-top"
                                >
                                  <g clip-path="url(#clip0_35_24)">
                                    <path
                                      fill="black"
                                      d="M20.8232 2.62734L19.9948 4.21304C19.8224 4.54309 19.4808 4.75 19.1085 4.75H4.92857C2.20246 4.75 0 6.87266 0 9.5C0 12.1273 2.20246 14.25 4.92857 14.25H64.0714C66.7975 14.25 69 12.1273 69 9.5C69 6.87266 66.7975 4.75 64.0714 4.75H49.8915C49.5192 4.75 49.1776 4.54309 49.0052 4.21305L48.1768 2.62734C47.3451 1.00938 45.6355 0 43.7719 0H25.2281C23.3645 0 21.6549 1.00938 20.8232 2.62734ZM64.0023 20.0648C64.0397 19.4882 63.5822 19 63.0044 19H5.99556C5.4178 19 4.96025 19.4882 4.99766 20.0648L8.19375 69.3203C8.44018 73.0758 11.6746 76 15.5712 76H53.4288C57.3254 76 60.5598 73.0758 60.8062 69.3203L64.0023 20.0648Z"
                                    ></path>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_35_24">
                                      <rect fill="white" height="14" width="69"></rect>
                                    </clipPath>
                                  </defs>
                                </svg>

                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 69 57"
                                  class="svgIcon bin-bottom"
                                >
                                  <g clip-path="url(#clip0_35_22)">
                                    <path
                                      fill="black"
                                      d="M20.8232 -16.3727L19.9948 -14.787C19.8224 -14.4569 19.4808 -14.25 19.1085 -14.25H4.92857C2.20246 -14.25 0 -12.1273 0 -9.5C0 -6.8727 2.20246 -4.75 4.92857 -4.75H64.0714C66.7975 -4.75 69 -6.8727 69 -9.5C69 -12.1273 66.7975 -14.25 64.0714 -14.25H49.8915C49.5192 -14.25 49.1776 -14.4569 49.0052 -14.787L48.1768 -16.3727C47.3451 -17.9906 45.6355 -19 43.7719 -19H25.2281C23.3645 -19 21.6549 -17.9906 20.8232 -16.3727ZM64.0023 1.0648C64.0397 0.4882 63.5822 0 63.0044 0H5.99556C5.4178 0 4.96025 0.4882 4.99766 1.0648L8.19375 50.3203C8.44018 54.0758 11.6746 57 15.5712 57H53.4288C57.3254 57 60.5598 54.0758 60.8062 50.3203L64.0023 1.0648Z"
                                    ></path>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_35_22">
                                      <rect fill="white" height="57" width="69"></rect>
                                    </clipPath>
                                  </defs>
                                </svg>
                              </button>


                            </li>
                          </ul>
                        </li>
                      </ul>



                    </div>
                  </div>
                )}
                <div
                  className="chat_messages"
                  ref={chatRef}
                  style={{
                    height: containerHeight,
                    padding: containerPadding,
                    borderRadius: messages === null ? "24px" : "0",
                  }}
                >
                  
                  {
                    (newChatUser) ?
                      (
                        messages.length ?
                          messages.map((item, index) => {
                            const dateObject = new Date(item.createdAt);
                            const currentDate = new Date();
                            let date = ''

                            // Проверка, является ли дата из строки меньше текущей даты
                            const isPast = dateObject < currentDate.setHours(0, 0, 0, 0);

                            let formattedLocalTime = `${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}`;

                            if (isPast) {
                              const day = dateObject.getDate().toString().padStart(2, '0');
                              const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Месяцы начинаются с 0
                              const year = dateObject.getFullYear();
                              date = `${day}.${month}`

                            }


                            return <>
                              <div className="message-item">
                                <p
                                  key={index}
                                  className={`message-text ${item.author ? "user" : "other"
                                    }`}
                                  dangerouslySetInnerHTML={{ __html: item?.message.split('\n').join('<br />') }}
                                />
                                <span
                                  style={{ alignSelf: item.author ? "end" : "start" }}
                                >
                                  {date && `${date} /`}  {formattedLocalTime}

                                </span>
                              </div>
                            </>
                          }
                          ).reverse()
                          :
                          <div className="empty__message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="244" height="180" viewBox="0 0 244 180" fill="none">
                              <path d="M215.46 94.8422C215.46 126.167 198.076 154.05 173.635 167.992C173.635 167.992 173.463 168.164 173.291 168.164C170.193 170.057 166.234 171.778 164.513 172.639H164.341C162.964 173.155 154.702 176.598 153.325 176.598C153.153 176.598 152.981 176.598 152.981 176.77C152.809 176.77 152.637 176.77 152.465 176.942C148.85 177.975 143.687 178.835 142.654 179.007C142.654 179.524 126.819 181.073 113.394 178.147C111.673 178.147 100.658 175.221 91.019 170.402C63.8245 156.288 45.0637 127.717 45.0637 94.8422C45.0637 47.8543 83.2737 9.81641 130.262 9.81641C177.422 9.81641 215.46 47.8543 215.46 94.8422Z" fill="#2A2E37" />
                              <path d="M156.079 129.609V175.909C155.907 175.909 153.67 176.769 153.497 176.769C153.325 176.769 153.153 176.769 153.153 176.942C152.981 176.942 152.809 176.942 152.637 177.114C149.022 178.146 143.859 179.007 142.826 179.179V129.609H156.079Z" fill="#4988FD" />
                              <path d="M156.079 129.609V175.909C155.907 175.909 153.67 176.769 153.497 176.769C153.325 176.769 153.153 176.769 153.153 176.942C152.981 176.942 152.809 176.942 152.637 177.114C149.022 178.146 143.859 179.007 142.826 179.179V129.609H156.079Z" fill="#5E6882" />
                              <path d="M168.127 129.609V171.09C167.267 171.606 165.718 172.122 164.513 172.811H164.341C162.103 173.843 159.521 174.876 155.046 176.253V129.782H168.127V129.609Z" fill="#2767F4" />
                              <path d="M168.127 129.609V171.09C167.267 171.606 165.718 172.122 164.513 172.811H164.341C162.103 173.843 159.521 174.876 155.046 176.253V129.782H168.127V129.609Z" fill="#444A5D" />
                              <path opacity="0.1" d="M168.127 147.51V168.164C166.406 169.024 165.029 169.713 165.029 169.713H164.857C161.931 171.262 157.456 172.639 155.563 173.155C155.391 173.155 155.219 173.327 155.046 173.327V168.852C157.112 162.656 160.554 156.288 165.201 150.952C166.062 149.747 167.095 148.542 168.127 147.51Z" fill="#062C78" />
                              <path opacity="0.1" d="M168.127 129.609H142.826V144.239H168.127V129.609Z" fill="black" />
                              <g filter="url(#filter0_d_657_23585)">
                                <path d="M222 77.6294V130.297H180.864V130.469H98.4199V35.8049H176.733C177.766 35.6328 178.799 35.6328 180.003 35.6328C181.38 35.6328 182.585 35.6328 183.962 35.8049C185.683 35.977 187.232 36.1492 188.781 36.4934C196.871 38.2146 204.1 42.3454 209.608 47.8531C217.353 55.5984 222 66.0975 222 77.6294Z" fill="url(#paint0_linear_657_23585)" />
                              </g>
                              <path d="M206.165 92.0872C211.329 92.0872 215.632 87.9564 215.632 82.6207C215.632 77.2851 211.329 73.1543 206.165 73.1543C201.002 73.1543 196.699 77.2851 196.699 82.6207C196.699 87.9564 200.83 92.0872 206.165 92.0872Z" fill="#414758" />
                              <path d="M207.714 90.884C213.05 90.884 217.525 86.7532 217.525 81.4176C217.525 76.082 213.222 71.9512 207.714 71.9512C202.379 71.9512 197.904 76.082 197.904 81.4176C197.904 86.7532 202.206 90.884 207.714 90.884Z" fill="#606882" />
                              <path d="M208.231 90.884C213.394 90.884 217.697 86.7532 217.697 81.4176C217.697 76.082 213.394 71.9512 208.231 71.9512C203.067 71.9512 198.764 76.082 198.764 81.4176C198.764 86.7532 202.895 90.884 208.231 90.884Z" fill="#8B93AA" />
                              <path d="M208.231 85.0317C210.296 85.0317 211.845 83.4826 211.845 81.4172C211.845 79.3518 210.296 77.8027 208.231 77.8027C206.165 77.8027 204.616 79.3518 204.616 81.4172C204.616 83.4826 206.165 85.0317 208.231 85.0317Z" fill="#CED7E2" />
                              <path d="M139.384 73.5003V130.471H55.3906V73.5003C55.3906 55.6001 68.1273 40.4538 84.8226 36.6672C87.5765 35.9788 90.3304 35.8066 93.2564 35.8066H101.862C120.795 35.8066 136.286 49.576 139.212 67.6483C139.212 69.3695 139.384 71.4349 139.384 73.5003Z" fill="#414758" />
                              <path opacity="0.7" d="M139.384 81.9333L138.867 68.1639C135.941 50.0916 120.279 36.3223 101.518 36.3223H92.9122C89.9862 36.3223 87.2324 36.6665 84.4785 37.1829L83.4458 38.0434L104.616 125.307L139.04 127.2L139.384 81.9333Z" fill="url(#paint1_linear_657_23585)" />
                              <path d="M139.212 67.6483C136.286 49.576 120.623 35.8066 101.862 35.8066H93.2564C90.3304 35.8066 87.5765 35.9788 84.8226 36.6672C67.9552 40.4538 55.3906 55.428 55.3906 73.5003V130.471H139.384V73.5003C139.384 71.4349 139.212 69.3695 139.212 67.6483ZM135.941 127.029H58.833V73.5003C58.833 57.6655 70.0206 43.5519 85.6832 40.1096C87.9207 39.5932 90.1583 39.4211 93.2564 39.4211H101.862C118.73 39.4211 133.015 51.4693 135.769 68.1646C135.769 68.8531 135.769 69.7137 135.769 70.5743C135.769 71.607 135.769 72.6397 135.769 73.6724V127.029H135.941Z" fill="#77819B" />
                              <path opacity="0.6" d="M119.763 162.656C117.353 166.271 114.427 172.123 112.706 176.942C112.534 177.286 112.362 177.803 112.362 178.147C111.157 177.975 109.952 177.63 108.747 177.286C107.714 174.877 107.026 172.295 107.026 172.295C107.714 171.434 108.231 170.746 108.919 170.057C112.189 166.099 115.632 163.345 119.763 162.656Z" fill="#5E6882" />
                              <path d="M113.394 178.319C113.05 178.319 112.706 178.147 112.361 178.147C111.157 177.974 109.952 177.63 108.747 177.286C107.886 177.114 107.198 176.77 106.337 176.597C105.993 176.425 105.649 176.425 105.305 176.253C104.96 176.081 104.616 176.081 104.1 175.909C99.6248 174.532 95.3218 172.639 91.191 170.573C86.8881 163.344 84.4785 154.566 80.3477 142.346C80.3477 142.174 80.3477 142.174 80.1755 142.002C80.1755 142.002 80.5198 142.002 81.3804 142.346C81.8967 142.69 82.7573 143.035 83.79 143.723C85.8554 145.1 89.1256 147.51 93.9449 151.468C99.969 156.46 105.133 163.861 108.747 169.885C110.296 172.639 111.673 175.048 112.706 176.942C113.05 177.286 113.222 177.802 113.394 178.319Z" fill="#5E6882" />
                              <path d="M106.337 176.426C105.993 176.253 105.649 176.253 105.305 176.081C104.96 175.909 104.616 175.909 104.1 175.737C96.1824 159.902 87.2323 149.747 82.0688 143.895C81.5525 143.207 81.0361 142.691 80.5198 142.174C80.5198 142.002 80.5198 142.002 80.3477 141.83C80.3477 141.83 80.6919 141.83 81.5525 142.174C82.0688 142.519 82.9294 142.863 83.9621 143.551C89.2977 149.747 98.4199 160.247 106.337 176.426Z" fill="#2A2E37" />
                              <path d="M186.716 139.42C186.716 139.42 186.544 139.764 186.2 140.453C184.134 144.239 177.249 156.804 173.979 167.819C173.807 167.819 173.807 167.991 173.635 167.991C173.635 167.991 173.463 168.163 173.291 168.163C170.193 170.057 166.234 171.778 164.513 172.638H164.341C159.177 175.048 153.669 176.597 153.325 176.597C155.907 168.163 159.694 160.59 165.029 154.222C166.062 153.017 167.095 151.812 168.127 150.78C168.299 150.608 168.471 150.435 168.644 150.263C173.119 145.788 177.766 142.862 182.241 140.969C182.757 140.797 183.274 140.453 183.79 140.281C184.306 139.936 185.167 139.764 186.027 139.42C186.372 139.592 186.544 139.42 186.716 139.42Z" fill="#5E6882" />
                              <path d="M186.544 139.076C186.544 139.076 186.372 139.248 186.2 139.765C186.2 139.937 186.028 139.937 186.028 140.109C177.077 148.026 170.021 161.279 165.546 172.295C165.201 172.467 164.857 172.639 164.513 172.811H164.341C163.997 172.983 163.48 173.155 163.136 173.327C163.308 172.983 163.48 172.811 163.48 172.811C165.718 167.303 171.742 151.641 182.241 141.142C182.585 140.797 182.929 140.453 183.274 140.109C184.478 139.765 185.511 139.42 186.544 139.076Z" fill="#2A2E37" />
                              <g filter="url(#filter1_d_657_23585)">
                                <path d="M139.9 124.445V130.469H25.0981C23.3769 130.469 22 129.092 22 127.543C22 125.822 23.3769 124.445 25.0981 124.445H139.9Z" fill="url(#paint2_linear_657_23585)" />
                              </g>
                              <path d="M163.48 79.0078H208.747C210.124 79.0078 211.157 80.0405 211.157 81.4175C211.157 82.7944 210.124 83.8271 208.747 83.8271H163.48V79.0078Z" fill="#A9AFC3" />
                              <path d="M161.931 55.9441C162.448 55.2557 163.652 55.5999 163.652 56.6326V78.8357V83.9992H145.064V56.6326C145.064 55.772 146.096 55.2557 146.785 55.9441L152.809 63.173C153.67 64.2057 155.219 64.2057 156.079 63.173L161.931 55.9441Z" fill="#A9AFC3" />
                              <path d="M41.105 17.2168C38.8675 27.7159 37.6627 38.3872 37.4906 49.0584C37.3184 58.8691 37.3184 69.7125 40.2444 79.1789C43.8589 91.2271 55.0465 103.275 68.8159 99.6608C76.389 97.5954 82.5852 91.055 84.3064 82.9655C85.3391 77.802 83.79 71.7779 79.6592 68.6798C75.1842 65.7538 68.6437 66.4423 64.6851 70.0567C60.3821 73.6712 58.661 79.1789 58.8331 84.5145C59.0052 89.8502 61.0706 95.0137 63.4802 99.6608C70.7091 112.914 108.231 105.857 136.114 102.587" stroke="#667089" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4 4" />
                              <path d="M27.6801 8.6107C28.5406 12.053 32.3272 13.2579 36.1138 11.1925C40.2446 9.12705 42.9985 7.75011 42.1379 4.47989C41.2773 1.38179 37.4907 1.03755 33.1878 0.693318C27.8522 0.176967 26.8195 5.16836 27.6801 8.6107Z" fill="#AFB7C9" />
                              <path d="M57.8006 11.7086C56.4237 14.6346 51.9486 16.3558 48.8505 13.4298C45.4082 10.3317 42.8264 8.26628 44.2034 4.99606C45.5803 2.07007 48.3342 2.93065 53.4977 3.79124C57.8006 4.82394 59.5218 8.61051 57.8006 11.7086Z" fill="#AFB7C9" />
                              <path d="M44.0312 0.177494C41.7937 -0.16674 39.7283 1.03808 39.0398 3.10348C38.8677 3.61983 38.5234 4.48042 38.5234 5.341C38.0071 9.64393 39.384 13.4305 41.9658 13.7747C44.5475 14.119 47.1293 10.8487 47.8178 6.89006C47.8178 5.68524 47.8178 4.82465 47.8178 3.96407C47.6456 1.89866 46.0966 0.521728 44.0312 0.177494C44.0312 0.177494 43.8591 0.177494 44.0312 0.177494Z" fill="#474E61" />
                              <path d="M146.096 130.471H144.031C144.892 132.536 145.408 135.806 145.752 139.765C143.343 140.281 138.867 139.593 136.114 137.528C135.253 134.429 134.565 132.02 133.876 130.471H131.639C132.155 131.331 133.016 134.085 134.048 138.044C130.262 141.658 127.852 140.281 120.451 136.667C119.763 136.323 118.902 135.806 117.869 135.462C116.148 133.397 114.771 131.676 113.394 130.471H110.124C111.501 131.331 113.394 133.052 115.46 135.462C104.616 143.724 94.8055 140.109 89.4699 138.216C88.6093 137.872 87.9209 137.7 87.2324 137.528C81.3804 134.429 76.0448 132.02 71.5697 130.471H64.6851V130.643C73.1188 132.02 92.9122 142.175 110.64 153.706V153.879H110.812C124.238 162.657 136.458 172.295 141.105 179.352L142.826 179.18V179.352V179.18C143.17 179.18 143.687 179.008 144.031 179.008C144.375 179.008 144.719 178.836 144.892 178.836C144.547 177.287 143.343 171.09 141.793 163.517C142.654 164.034 143.687 164.55 145.064 164.55C145.408 164.55 145.752 164.55 145.924 164.55C145.752 170.058 145.58 175.221 145.236 179.008C145.924 178.836 146.613 178.836 147.301 178.663C147.818 170.058 149.367 140.97 146.096 130.471ZM145.752 141.83C145.924 144.412 146.096 147.166 146.096 149.92C143.859 150.953 142.482 149.748 140.417 147.51C139.728 146.65 138.867 145.789 138.007 145.273C137.663 143.552 137.146 142.003 136.802 140.453C139.556 141.658 143.17 142.175 145.752 141.83ZM136.458 148.199C137.146 151.469 138.007 155.083 138.695 158.698C138.179 158.698 137.835 159.042 137.491 159.214C136.802 159.731 135.769 160.247 133.36 159.558C132.499 158.009 131.639 156.46 130.778 155.083C129.745 153.19 128.54 151.469 127.68 149.92C131.639 150.092 134.22 149.576 136.458 148.199ZM134.565 140.281C135.081 142.003 135.425 143.896 135.941 145.961C134.048 147.51 131.639 148.199 126.303 147.51C124.238 144.412 122.344 141.486 120.623 139.077C126.819 142.175 130.262 143.724 134.565 140.281ZM96.0104 142.347C97.5594 142.691 99.1085 142.863 100.83 142.863C105.649 142.863 110.985 141.486 116.664 137.183C119.074 140.281 121.656 144.068 124.238 148.199C121.139 151.125 115.976 151.469 111.501 151.813C106.337 148.371 101.002 145.273 96.0104 142.347ZM114.255 153.534C118.213 153.19 122.516 152.502 125.27 149.92C127.336 153.19 129.401 156.805 131.466 160.247C130.606 161.968 128.885 162.312 125.098 161.452C121.828 158.698 118.041 156.116 114.255 153.534ZM128.54 163.861C130.09 163.861 131.639 163.517 132.843 162.14C135.081 166.099 137.318 170.058 139.04 173.156C136.114 170.23 132.499 167.132 128.54 163.861ZM141.966 174.877C140.072 171.262 137.491 166.443 134.737 161.796C136.63 161.968 137.663 161.28 138.523 160.935C138.695 160.935 138.695 160.763 138.867 160.763C138.867 160.763 139.04 160.935 139.212 161.108C140.244 165.755 141.105 170.574 141.966 174.877ZM145.924 162.14C144.031 162.657 142.482 161.624 141.105 160.247C140.417 156.46 139.556 152.674 138.695 148.887L138.867 149.059C140.589 150.953 142.826 153.19 146.096 152.33C146.096 155.428 146.096 158.87 145.924 162.14Z" fill="#444A5E" />
                              <path d="M202.758 158.991C206.104 158.991 208.817 156.278 208.817 152.932C208.817 149.586 206.104 146.873 202.758 146.873C199.411 146.873 196.699 149.586 196.699 152.932C196.699 156.278 199.411 158.991 202.758 158.991Z" fill="#2A2E37" />
                              <path d="M191.555 30.1545C193.84 30.1545 195.693 28.302 195.693 26.0167C195.693 23.7315 193.84 21.8789 191.555 21.8789C189.27 21.8789 187.417 23.7315 187.417 26.0167C187.417 28.302 189.27 30.1545 191.555 30.1545Z" fill="#2A2E37" />
                              <path d="M35.5339 157.066C39.7779 157.066 43.2184 153.626 43.2184 149.382C43.2184 145.138 39.7779 141.697 35.5339 141.697C31.2898 141.697 27.8494 145.138 27.8494 149.382C27.8494 153.626 31.2898 157.066 35.5339 157.066Z" fill="#2A2E37" />
                              <defs>
                                <filter id="filter0_d_657_23585" x="76.4199" y="24.6328" width="167.58" height="138.836" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                  <feOffset dy="11" />
                                  <feGaussianBlur stdDeviation="11" />
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
                                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_657_23585" />
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_657_23585" result="shape" />
                                </filter>
                                <filter id="filter1_d_657_23585" x="0" y="113.445" width="161.9" height="50.0234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                  <feOffset dy="11" />
                                  <feGaussianBlur stdDeviation="11" />
                                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
                                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_657_23585" />
                                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_657_23585" result="shape" />
                                </filter>
                                <linearGradient id="paint0_linear_657_23585" x1="160.17" y1="33.4392" x2="160.17" y2="131.492" gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#5E6882" />
                                  <stop offset="0.9964" stop-color="#5E6882" />
                                </linearGradient>
                                <linearGradient id="paint1_linear_657_23585" x1="137.256" y1="80.6827" x2="101.789" y2="82.335" gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#42465A" />
                                  <stop offset="1" stop-color="#575E84" stop-opacity="0" />
                                </linearGradient>
                                <linearGradient id="paint2_linear_657_23585" x1="80.9117" y1="124.306" x2="80.9117" y2="130.534" gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#5E6882" />
                                  <stop offset="0.9964" stop-color="#5E6882" />
                                </linearGradient>
                              </defs>
                            </svg>

                            <h3>You don't have any correspondence, send the first message</h3>

                          </div>
                      )
                      :
                      <div className="no_active_chat empty__message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="244" height="180" viewBox="0 0 244 180" fill="none">
                          <path d="M215.46 94.8422C215.46 126.167 198.076 154.05 173.635 167.992C173.635 167.992 173.463 168.164 173.291 168.164C170.193 170.057 166.234 171.778 164.513 172.639H164.341C162.964 173.155 154.702 176.598 153.325 176.598C153.153 176.598 152.981 176.598 152.981 176.77C152.809 176.77 152.637 176.77 152.465 176.942C148.85 177.975 143.687 178.835 142.654 179.007C142.654 179.524 126.819 181.073 113.394 178.147C111.673 178.147 100.658 175.221 91.019 170.402C63.8245 156.288 45.0637 127.717 45.0637 94.8422C45.0637 47.8543 83.2737 9.81641 130.262 9.81641C177.422 9.81641 215.46 47.8543 215.46 94.8422Z" fill="#2A2E37" />
                          <path d="M156.079 129.609V175.909C155.907 175.909 153.67 176.769 153.497 176.769C153.325 176.769 153.153 176.769 153.153 176.942C152.981 176.942 152.809 176.942 152.637 177.114C149.022 178.146 143.859 179.007 142.826 179.179V129.609H156.079Z" fill="#4988FD" />
                          <path d="M156.079 129.609V175.909C155.907 175.909 153.67 176.769 153.497 176.769C153.325 176.769 153.153 176.769 153.153 176.942C152.981 176.942 152.809 176.942 152.637 177.114C149.022 178.146 143.859 179.007 142.826 179.179V129.609H156.079Z" fill="#5E6882" />
                          <path d="M168.127 129.609V171.09C167.267 171.606 165.718 172.122 164.513 172.811H164.341C162.103 173.843 159.521 174.876 155.046 176.253V129.782H168.127V129.609Z" fill="#2767F4" />
                          <path d="M168.127 129.609V171.09C167.267 171.606 165.718 172.122 164.513 172.811H164.341C162.103 173.843 159.521 174.876 155.046 176.253V129.782H168.127V129.609Z" fill="#444A5D" />
                          <path opacity="0.1" d="M168.127 147.51V168.164C166.406 169.024 165.029 169.713 165.029 169.713H164.857C161.931 171.262 157.456 172.639 155.563 173.155C155.391 173.155 155.219 173.327 155.046 173.327V168.852C157.112 162.656 160.554 156.288 165.201 150.952C166.062 149.747 167.095 148.542 168.127 147.51Z" fill="#062C78" />
                          <path opacity="0.1" d="M168.127 129.609H142.826V144.239H168.127V129.609Z" fill="black" />
                          <g filter="url(#filter0_d_657_23585)">
                            <path d="M222 77.6294V130.297H180.864V130.469H98.4199V35.8049H176.733C177.766 35.6328 178.799 35.6328 180.003 35.6328C181.38 35.6328 182.585 35.6328 183.962 35.8049C185.683 35.977 187.232 36.1492 188.781 36.4934C196.871 38.2146 204.1 42.3454 209.608 47.8531C217.353 55.5984 222 66.0975 222 77.6294Z" fill="url(#paint0_linear_657_23585)" />
                          </g>
                          <path d="M206.165 92.0872C211.329 92.0872 215.632 87.9564 215.632 82.6207C215.632 77.2851 211.329 73.1543 206.165 73.1543C201.002 73.1543 196.699 77.2851 196.699 82.6207C196.699 87.9564 200.83 92.0872 206.165 92.0872Z" fill="#414758" />
                          <path d="M207.714 90.884C213.05 90.884 217.525 86.7532 217.525 81.4176C217.525 76.082 213.222 71.9512 207.714 71.9512C202.379 71.9512 197.904 76.082 197.904 81.4176C197.904 86.7532 202.206 90.884 207.714 90.884Z" fill="#606882" />
                          <path d="M208.231 90.884C213.394 90.884 217.697 86.7532 217.697 81.4176C217.697 76.082 213.394 71.9512 208.231 71.9512C203.067 71.9512 198.764 76.082 198.764 81.4176C198.764 86.7532 202.895 90.884 208.231 90.884Z" fill="#8B93AA" />
                          <path d="M208.231 85.0317C210.296 85.0317 211.845 83.4826 211.845 81.4172C211.845 79.3518 210.296 77.8027 208.231 77.8027C206.165 77.8027 204.616 79.3518 204.616 81.4172C204.616 83.4826 206.165 85.0317 208.231 85.0317Z" fill="#CED7E2" />
                          <path d="M139.384 73.5003V130.471H55.3906V73.5003C55.3906 55.6001 68.1273 40.4538 84.8226 36.6672C87.5765 35.9788 90.3304 35.8066 93.2564 35.8066H101.862C120.795 35.8066 136.286 49.576 139.212 67.6483C139.212 69.3695 139.384 71.4349 139.384 73.5003Z" fill="#414758" />
                          <path opacity="0.7" d="M139.384 81.9333L138.867 68.1639C135.941 50.0916 120.279 36.3223 101.518 36.3223H92.9122C89.9862 36.3223 87.2324 36.6665 84.4785 37.1829L83.4458 38.0434L104.616 125.307L139.04 127.2L139.384 81.9333Z" fill="url(#paint1_linear_657_23585)" />
                          <path d="M139.212 67.6483C136.286 49.576 120.623 35.8066 101.862 35.8066H93.2564C90.3304 35.8066 87.5765 35.9788 84.8226 36.6672C67.9552 40.4538 55.3906 55.428 55.3906 73.5003V130.471H139.384V73.5003C139.384 71.4349 139.212 69.3695 139.212 67.6483ZM135.941 127.029H58.833V73.5003C58.833 57.6655 70.0206 43.5519 85.6832 40.1096C87.9207 39.5932 90.1583 39.4211 93.2564 39.4211H101.862C118.73 39.4211 133.015 51.4693 135.769 68.1646C135.769 68.8531 135.769 69.7137 135.769 70.5743C135.769 71.607 135.769 72.6397 135.769 73.6724V127.029H135.941Z" fill="#77819B" />
                          <path opacity="0.6" d="M119.763 162.656C117.353 166.271 114.427 172.123 112.706 176.942C112.534 177.286 112.362 177.803 112.362 178.147C111.157 177.975 109.952 177.63 108.747 177.286C107.714 174.877 107.026 172.295 107.026 172.295C107.714 171.434 108.231 170.746 108.919 170.057C112.189 166.099 115.632 163.345 119.763 162.656Z" fill="#5E6882" />
                          <path d="M113.394 178.319C113.05 178.319 112.706 178.147 112.361 178.147C111.157 177.974 109.952 177.63 108.747 177.286C107.886 177.114 107.198 176.77 106.337 176.597C105.993 176.425 105.649 176.425 105.305 176.253C104.96 176.081 104.616 176.081 104.1 175.909C99.6248 174.532 95.3218 172.639 91.191 170.573C86.8881 163.344 84.4785 154.566 80.3477 142.346C80.3477 142.174 80.3477 142.174 80.1755 142.002C80.1755 142.002 80.5198 142.002 81.3804 142.346C81.8967 142.69 82.7573 143.035 83.79 143.723C85.8554 145.1 89.1256 147.51 93.9449 151.468C99.969 156.46 105.133 163.861 108.747 169.885C110.296 172.639 111.673 175.048 112.706 176.942C113.05 177.286 113.222 177.802 113.394 178.319Z" fill="#5E6882" />
                          <path d="M106.337 176.426C105.993 176.253 105.649 176.253 105.305 176.081C104.96 175.909 104.616 175.909 104.1 175.737C96.1824 159.902 87.2323 149.747 82.0688 143.895C81.5525 143.207 81.0361 142.691 80.5198 142.174C80.5198 142.002 80.5198 142.002 80.3477 141.83C80.3477 141.83 80.6919 141.83 81.5525 142.174C82.0688 142.519 82.9294 142.863 83.9621 143.551C89.2977 149.747 98.4199 160.247 106.337 176.426Z" fill="#2A2E37" />
                          <path d="M186.716 139.42C186.716 139.42 186.544 139.764 186.2 140.453C184.134 144.239 177.249 156.804 173.979 167.819C173.807 167.819 173.807 167.991 173.635 167.991C173.635 167.991 173.463 168.163 173.291 168.163C170.193 170.057 166.234 171.778 164.513 172.638H164.341C159.177 175.048 153.669 176.597 153.325 176.597C155.907 168.163 159.694 160.59 165.029 154.222C166.062 153.017 167.095 151.812 168.127 150.78C168.299 150.608 168.471 150.435 168.644 150.263C173.119 145.788 177.766 142.862 182.241 140.969C182.757 140.797 183.274 140.453 183.79 140.281C184.306 139.936 185.167 139.764 186.027 139.42C186.372 139.592 186.544 139.42 186.716 139.42Z" fill="#5E6882" />
                          <path d="M186.544 139.076C186.544 139.076 186.372 139.248 186.2 139.765C186.2 139.937 186.028 139.937 186.028 140.109C177.077 148.026 170.021 161.279 165.546 172.295C165.201 172.467 164.857 172.639 164.513 172.811H164.341C163.997 172.983 163.48 173.155 163.136 173.327C163.308 172.983 163.48 172.811 163.48 172.811C165.718 167.303 171.742 151.641 182.241 141.142C182.585 140.797 182.929 140.453 183.274 140.109C184.478 139.765 185.511 139.42 186.544 139.076Z" fill="#2A2E37" />
                          <g filter="url(#filter1_d_657_23585)">
                            <path d="M139.9 124.445V130.469H25.0981C23.3769 130.469 22 129.092 22 127.543C22 125.822 23.3769 124.445 25.0981 124.445H139.9Z" fill="url(#paint2_linear_657_23585)" />
                          </g>
                          <path d="M163.48 79.0078H208.747C210.124 79.0078 211.157 80.0405 211.157 81.4175C211.157 82.7944 210.124 83.8271 208.747 83.8271H163.48V79.0078Z" fill="#A9AFC3" />
                          <path d="M161.931 55.9441C162.448 55.2557 163.652 55.5999 163.652 56.6326V78.8357V83.9992H145.064V56.6326C145.064 55.772 146.096 55.2557 146.785 55.9441L152.809 63.173C153.67 64.2057 155.219 64.2057 156.079 63.173L161.931 55.9441Z" fill="#A9AFC3" />
                          <path d="M41.105 17.2168C38.8675 27.7159 37.6627 38.3872 37.4906 49.0584C37.3184 58.8691 37.3184 69.7125 40.2444 79.1789C43.8589 91.2271 55.0465 103.275 68.8159 99.6608C76.389 97.5954 82.5852 91.055 84.3064 82.9655C85.3391 77.802 83.79 71.7779 79.6592 68.6798C75.1842 65.7538 68.6437 66.4423 64.6851 70.0567C60.3821 73.6712 58.661 79.1789 58.8331 84.5145C59.0052 89.8502 61.0706 95.0137 63.4802 99.6608C70.7091 112.914 108.231 105.857 136.114 102.587" stroke="#667089" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4 4" />
                          <path d="M27.6801 8.6107C28.5406 12.053 32.3272 13.2579 36.1138 11.1925C40.2446 9.12705 42.9985 7.75011 42.1379 4.47989C41.2773 1.38179 37.4907 1.03755 33.1878 0.693318C27.8522 0.176967 26.8195 5.16836 27.6801 8.6107Z" fill="#AFB7C9" />
                          <path d="M57.8006 11.7086C56.4237 14.6346 51.9486 16.3558 48.8505 13.4298C45.4082 10.3317 42.8264 8.26628 44.2034 4.99606C45.5803 2.07007 48.3342 2.93065 53.4977 3.79124C57.8006 4.82394 59.5218 8.61051 57.8006 11.7086Z" fill="#AFB7C9" />
                          <path d="M44.0312 0.177494C41.7937 -0.16674 39.7283 1.03808 39.0398 3.10348C38.8677 3.61983 38.5234 4.48042 38.5234 5.341C38.0071 9.64393 39.384 13.4305 41.9658 13.7747C44.5475 14.119 47.1293 10.8487 47.8178 6.89006C47.8178 5.68524 47.8178 4.82465 47.8178 3.96407C47.6456 1.89866 46.0966 0.521728 44.0312 0.177494C44.0312 0.177494 43.8591 0.177494 44.0312 0.177494Z" fill="#474E61" />
                          <path d="M146.096 130.471H144.031C144.892 132.536 145.408 135.806 145.752 139.765C143.343 140.281 138.867 139.593 136.114 137.528C135.253 134.429 134.565 132.02 133.876 130.471H131.639C132.155 131.331 133.016 134.085 134.048 138.044C130.262 141.658 127.852 140.281 120.451 136.667C119.763 136.323 118.902 135.806 117.869 135.462C116.148 133.397 114.771 131.676 113.394 130.471H110.124C111.501 131.331 113.394 133.052 115.46 135.462C104.616 143.724 94.8055 140.109 89.4699 138.216C88.6093 137.872 87.9209 137.7 87.2324 137.528C81.3804 134.429 76.0448 132.02 71.5697 130.471H64.6851V130.643C73.1188 132.02 92.9122 142.175 110.64 153.706V153.879H110.812C124.238 162.657 136.458 172.295 141.105 179.352L142.826 179.18V179.352V179.18C143.17 179.18 143.687 179.008 144.031 179.008C144.375 179.008 144.719 178.836 144.892 178.836C144.547 177.287 143.343 171.09 141.793 163.517C142.654 164.034 143.687 164.55 145.064 164.55C145.408 164.55 145.752 164.55 145.924 164.55C145.752 170.058 145.58 175.221 145.236 179.008C145.924 178.836 146.613 178.836 147.301 178.663C147.818 170.058 149.367 140.97 146.096 130.471ZM145.752 141.83C145.924 144.412 146.096 147.166 146.096 149.92C143.859 150.953 142.482 149.748 140.417 147.51C139.728 146.65 138.867 145.789 138.007 145.273C137.663 143.552 137.146 142.003 136.802 140.453C139.556 141.658 143.17 142.175 145.752 141.83ZM136.458 148.199C137.146 151.469 138.007 155.083 138.695 158.698C138.179 158.698 137.835 159.042 137.491 159.214C136.802 159.731 135.769 160.247 133.36 159.558C132.499 158.009 131.639 156.46 130.778 155.083C129.745 153.19 128.54 151.469 127.68 149.92C131.639 150.092 134.22 149.576 136.458 148.199ZM134.565 140.281C135.081 142.003 135.425 143.896 135.941 145.961C134.048 147.51 131.639 148.199 126.303 147.51C124.238 144.412 122.344 141.486 120.623 139.077C126.819 142.175 130.262 143.724 134.565 140.281ZM96.0104 142.347C97.5594 142.691 99.1085 142.863 100.83 142.863C105.649 142.863 110.985 141.486 116.664 137.183C119.074 140.281 121.656 144.068 124.238 148.199C121.139 151.125 115.976 151.469 111.501 151.813C106.337 148.371 101.002 145.273 96.0104 142.347ZM114.255 153.534C118.213 153.19 122.516 152.502 125.27 149.92C127.336 153.19 129.401 156.805 131.466 160.247C130.606 161.968 128.885 162.312 125.098 161.452C121.828 158.698 118.041 156.116 114.255 153.534ZM128.54 163.861C130.09 163.861 131.639 163.517 132.843 162.14C135.081 166.099 137.318 170.058 139.04 173.156C136.114 170.23 132.499 167.132 128.54 163.861ZM141.966 174.877C140.072 171.262 137.491 166.443 134.737 161.796C136.63 161.968 137.663 161.28 138.523 160.935C138.695 160.935 138.695 160.763 138.867 160.763C138.867 160.763 139.04 160.935 139.212 161.108C140.244 165.755 141.105 170.574 141.966 174.877ZM145.924 162.14C144.031 162.657 142.482 161.624 141.105 160.247C140.417 156.46 139.556 152.674 138.695 148.887L138.867 149.059C140.589 150.953 142.826 153.19 146.096 152.33C146.096 155.428 146.096 158.87 145.924 162.14Z" fill="#444A5E" />
                          <path d="M202.758 158.991C206.104 158.991 208.817 156.278 208.817 152.932C208.817 149.586 206.104 146.873 202.758 146.873C199.411 146.873 196.699 149.586 196.699 152.932C196.699 156.278 199.411 158.991 202.758 158.991Z" fill="#2A2E37" />
                          <path d="M191.555 30.1545C193.84 30.1545 195.693 28.302 195.693 26.0167C195.693 23.7315 193.84 21.8789 191.555 21.8789C189.27 21.8789 187.417 23.7315 187.417 26.0167C187.417 28.302 189.27 30.1545 191.555 30.1545Z" fill="#2A2E37" />
                          <path d="M35.5339 157.066C39.7779 157.066 43.2184 153.626 43.2184 149.382C43.2184 145.138 39.7779 141.697 35.5339 141.697C31.2898 141.697 27.8494 145.138 27.8494 149.382C27.8494 153.626 31.2898 157.066 35.5339 157.066Z" fill="#2A2E37" />
                          <defs>
                            <filter id="filter0_d_657_23585" x="76.4199" y="24.6328" width="167.58" height="138.836" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset dy="11" />
                              <feGaussianBlur stdDeviation="11" />
                              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_657_23585" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_657_23585" result="shape" />
                            </filter>
                            <filter id="filter1_d_657_23585" x="0" y="113.445" width="161.9" height="50.0234" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                              <feFlood flood-opacity="0" result="BackgroundImageFix" />
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                              <feOffset dy="11" />
                              <feGaussianBlur stdDeviation="11" />
                              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27 0" />
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_657_23585" />
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_657_23585" result="shape" />
                            </filter>
                            <linearGradient id="paint0_linear_657_23585" x1="160.17" y1="33.4392" x2="160.17" y2="131.492" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#5E6882" />
                              <stop offset="0.9964" stop-color="#5E6882" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_657_23585" x1="137.256" y1="80.6827" x2="101.789" y2="82.335" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#42465A" />
                              <stop offset="1" stop-color="#575E84" stop-opacity="0" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_657_23585" x1="80.9117" y1="124.306" x2="80.9117" y2="130.534" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#5E6882" />
                              <stop offset="0.9964" stop-color="#5E6882" />
                            </linearGradient>
                          </defs>
                        </svg>

                        <h3>There is no active chat yet..</h3>

                      </div>

                  }

                </div>
                {(messages.some(item => item.chatId == chatId) || newChatUser) && (
                  <div >

                    <form className="chat_messages_footer" onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage(newMessage)
                    }}>
                      <button >
                        <img src={attachment} alt="" />
                      </button>
                      {/* <input type="text"  value={newMessage}  /> */}
                      <textarea value={newMessage} name="newMessage" id="new__message" placeholder="Write a message" onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(newMessage)
                          }
                        }}
                        style={{ height: '50px', minHeight: 'unset', resize: 'none' }} />
                      <div className={`emoji__container ${!isOpenEmoji ? 'hide__emoji' : ''}`} ref={pickerRef}>
                        {
                          
                          <EmojiPicker 
                          
                          height={270}
                          searchDisabled={true}
                          theme='dark'
                          lazyLoadEmojis={true}
                          onEmojiClick={(e) => {
                            setNewMessage(prev => prev+e.emoji)
                          }}
                          />
                        }
                      
                        <button type="button" onClick={() => {
                          setIsOpenEmoji(!isOpenEmoji)
                        }}>
                        <img src={smile} alt="" className="smile"  />

                        </button>
                      </div>
                      <button type="submit">
                        <img src={send} alt="" className="send" />
                      </button>
                    </form>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Chat;
