import { createContext, useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import io from 'socket.io-client';
import axios from "axios";



export const ChatContext = createContext();


export default function ChatProvider({ children }) {
    const CHAT_API = 'http://46.101.153.252:8000/api/chat/';
    const SOCKET_URL = 'http://31.210.51.68:8300';

    const axiosInstance = useAxios();
    const [myId, setMyId] = useState(false);
    const USER_TOKKEN = JSON.parse(localStorage.authTokens).access;

    const [socket, setSocket] = useState(null);
    const [allChats, setAllChats] = useState([]);
    const [chatId, setChatId] = useState(0);
    const [newMessage, setNewMessage] = useState('');
    const [newChatUser, setNewChatUser] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);



    const getChats = async () => {
        const res = await axios.get(`${CHAT_API}getChats`, {
            headers: {
                Authorization: `Bearer ${USER_TOKKEN}`
            }
        })
        setAllChats(res.data.response)
        console.log(res.data.response);
        setLastMessages(res.data.response.map(item => {
            return {
                lastMessage: item.lastMessage,
                chatId: item.chatId,
                userId: item.target.userId
            }
        }))
    };



    const getMessage = async (id) => {
        const res = await axios.get(`${CHAT_API}getMessages/${id}`, {
            headers: {
                Authorization: `Bearer ${USER_TOKKEN}`
            }
        });
        setChatId(id);
        setMessages(res.data.response.response);
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
        const getMyId = async () => {
            let myUsername = JSON.parse(localStorage.authTokens).username
            const res = await axiosInstance.get(`/user/users/?username=${myUsername}`);
            setMyId(res.data[0].id)
        }
        getMyId();
    }, [])

    useEffect(() => {
        let socketInstance = '';

        if (myId) {
            socketInstance = io(SOCKET_URL, {
                query: { customerId: myId },
                transports: ['websocket']
            });
            socketInstance.on('connect', () => {
                console.log('Connected to WebSocket server!');
            });


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
                
                if(allChats.some(item => item.target.userId != target)) getChats();

            });

            socketInstance.on('disconnect', () => {
                setIsConnect('Disconnect!')
            });

            setSocket(socketInstance);
        }

        getChats();

    }, [myId]);



    const sendMessage = async (newMessage) => {
        let id = localStorage.newUserChatId
        let newObjectMessage = {
            messageId: messages.length ? +messages[0].messageId + 1 : 1,
            message: newMessage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chatId: chatId,
            myId,
            userId: id
        }


        await axios.post(`${CHAT_API}sendMessage/`, { target: id, message: newMessage },
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKKEN}`,
                }
            }
        );
        socket.emit('sendMessage', { target: id, message: newObjectMessage });
        setNewMessage('');
        if(allChats.some(item => item.target.userId != id)) getChats();

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
            CHAT_API,
            allChats,
            chatId,
            messages,
            newMessage,
            lastMessages,
            newChatUser,
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
