import { createContext, useContext, useEffect, useState } from "react";
import io from 'socket.io-client';
import axios from "axios";
import { AuthContext } from "./authContext";
import { toast } from "react-toastify";



export const ChatContext = createContext();


export default function ChatProvider({ children }) {
    const {user} = useContext(AuthContext)
    const CHAT_API = 'http://46.101.153.252:8000/api/chat/';
    const SOCKET_URL = 'http://31.210.51.68:8300';

    let socketInstance = '';
    const USER_TOKKEN = localStorage.authTokens != undefined ? JSON.parse(localStorage.authTokens).access : false;

    const [socket, setSocket] = useState(null);
    const [allChats, setAllChats] = useState([]);
    const [chatId, setChatId] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [newChatUser, setNewChatUser] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);



    const getChats = async () => {
        const res = await axios.get(`${CHAT_API}getChats`, {
            headers: {
                Authorization: `Bearer ${USER_TOKKEN}`
            }
        })
        setAllChats(res.data.response)
        setLastMessages(res.data.response.map(item => {
            return {
                lastMessage: item.lastMessage,
                chatId: item.chatId,
                userId: item.target.userId
            }
        }))
        setNewMessage('')
    };




    const getMessage = async (id) => {
      

        const res = await axios.get(`${CHAT_API}getMessages/${id}`, {
            headers: {
                Authorization: `Bearer ${USER_TOKKEN}`
            }
        });
        setChatId(id);
        setMessages(res.data.response.response);
        console.log(res.data.response);
        let { firstName, lastName, picture, userId, username } = res.data.response.targetDetails;
        setNewChatUser({
            avatar: picture,
            first_name: firstName,
            last_name: lastName,
            id: userId,
            username
        });
        localStorage.setItem('newUserChatId', userId);
        localStorage.setItem('chatId', id);
    }


    useEffect(() => {
        getChats()
    }, [newChatUser])

 


    useEffect(() => {
        

        if (user?.user_id && USER_TOKKEN) {
            socketInstance = io(SOCKET_URL, {
                query: { customerId: user?.user_id }
            });
            socketInstance.on('connect', () => {
                console.log('Connected to WebSocket server!');
            });
           
            socketInstance.on('online-users', (users) => {
                setOnlineUsers(users);
            })
              


            socketInstance.on("newMessage", (data) => {
                let { message, target } = data;
                
                if(+message.chatId == +localStorage.chatId || target == localStorage.newUserChatId) {
                    setMessages((prevMessages) => {
                        return [
                                {
                                    author: localStorage.newUserChatId == target
                                    ,
                                    ...message
                                }
                            , ...prevMessages
                            ]
                        }
                    )
                }

                
                setLastMessages((prevMessages) => {
                    return prevMessages.map((item) => {
                        if (+message.chatId == +item.chatId && +message.userId == +target) {
                            return {
                                ...item,
                                lastMessage: message.message
                            };
                        } else {
                            return item;
                        }
                    })
                    }
                )
            });

            socketInstance.on('disconnect', () => {
            });

            setSocket(socketInstance);
        }

        USER_TOKKEN && getChats();

    }, [user, USER_TOKKEN]);



    const sendMessage = async (newMessage) => {
        let id = localStorage.newUserChatId
        let newObjectMessage = {
            messageId: messages.length ? +messages[0].messageId + 1 : 1,
            message: newMessage.split('\n').join('\n'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chatId: chatId,
            myId: user?.user_id,
            userId: id
        }


        await axios.post(`${CHAT_API}sendMessage/`, { target: id, message: newMessage.split('\n').join('\n') },
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKKEN}`,
                }
            }
        );
        socket.emit('sendMessage', { target: id, message: newObjectMessage });
        setNewMessage('');

    };


    const addChat = (newChatUser) => {
        
        setMessages([])
        setNewChatUser(newChatUser);
        setChatId(false)
        localStorage.setItem('newUserChatId', newChatUser.id)
    }





    return (
        <ChatContext.Provider value={{
            USER_TOKKEN,
            myId : user?.user_id,
            CHAT_API,
            allChats,
            chatId,
            messages,
            socket,
            newMessage,
            lastMessages,
            newChatUser,
            setMessages,
            onlineUsers,
            setNewMessage,
            sendMessage,
            getMessage,
            getChats,
            addChat
        }}>
            {children}
        </ChatContext.Provider>
    )
}
