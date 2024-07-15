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
    const [newChat, setNewChat] = useState(false);
    const [newMessages, setNewMessages] = useState([])
    const [onlineChat, setOnlineChat] = useState(false);
    const [isModalCallOpen, setIsModalCallOpen] = useState(false);
    const [callModalText, setCallModalText] = useState('');
    const [iCall, setICall] = useState(false);
    const [isAccept, setIsAccept] = useState();
    const [isVideoCall, setIsVideoCall] = useState(false)

  



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

        return res.data.response;

    };


    let newConnect = ''

    const getMessage = async (id) => {
    //     newConnect = io(SOCKET_URL, {
    //         query: { customerId: user?.user_id }
    //     });
    //     newConnect?.on('connect', () => {
    //         console.log('Connected to WebSocket chat!');
    //         newConnect.emit("connect-chat", { customerId: user.user_id, chatId: id });

    //     });

    //     newConnect.on("new-chat-connection", (data) => {
    //         console.log("Sohbet bağlantı durumu:", data);

            
    //     });

    //     allChats.forEach(item => {
            
    //        if(+localStorage.newUserChatId == +item.target.userId) {
    //            newConnect?.emit("check-chat-connection", {
    //                customerId: user.user_id,
    //                target: localStorage.newUserChatId,
    //                chatId: id
    //            });
    //        }
    //    })

   

        // if(+localStorage.chatId == +id) newConnect.emit("disconnect-chat", { customerId: user.user_id });


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
     
        setLastMessages(lastMessages.map(item => {

            if(res.data.response.response.some(item => item.isRead)) {
                let newObj = {
                    ...item,
                    isRead: true
                }

                return newObj
            } else {
                return {
                    ...item,
                    isRead: false
                }
            }
        }))
    }


    useEffect(() => {
        getChats();
    }, [newChatUser])
   

    useEffect(() => {
        if(newMessages.fromUserId) {
            toast.dark('New Message! ' + newMessages?.userName + ' : ' + newMessages?.lastMessage)
        }
      
    }, [newMessages])

    useEffect(()=>{
        localStorage.setItem('chatId', false)
        localStorage.setItem('newUserChatId', false)

        return () => {
            localStorage.setItem('chatId', false)
            localStorage.setItem('newUserChatId', false)
        }
    },[])


  

    const acceptACall = () => {
        /*
        newChatUser - bu mende secilmish userdi chatdan, ve eger secilmish varsa, o zaman onun id target kimi gonderirem, ve eger yoxdursa 
        o zaman localdan kimnen zeng gelirdise onun id gondeririy
        */
        socket.emit('sendMessage', { target: newChatUser ? newChatUser.id : localStorage.fromCallUserId, message: {
            action: `accept ${ newChatUser ? newChatUser.id : localStorage.fromCallUserId}`, // buda oxshar meqamdi
            myId: user.user_id, // ve oz id`mizi gondeririy 
        } });
    }
   
    
    const declineCall = () =>{
        socket.emit('sendMessage', { target: newChatUser ? newChatUser.id : localStorage.fromCallUserId, message: {
            action: `decline ${ newChatUser ? newChatUser.id : localStorage.fromCallUserId}`,
            userInfo: newChatUser,
            fromUserName: JSON.parse(localStorage.authTokens).first_name
          } });
    }


  

    useEffect(() => {
        let userss = [];

        if (user?.user_id && USER_TOKKEN) {
            socketInstance = io(SOCKET_URL, {
                query: { customerId: user?.user_id }
            });
            socketInstance.on('connect', () => {
                console.log('Connected to WebSocket server!');
                getChats()
            });
           
            socketInstance.on('online-users', (users) => {
                userss = users;
                setOnlineUsers(prev => users);               
            })

          
            
           




            socketInstance.on("newMessage", (data) => {
                let { message, target } = data;
                console.log(message);
                console.log(user?.user_id);
             
                message?.action && setIsModalCallOpen(true) // Eyer action varsa o zaman call modal pencereni activ edir 
                
                
                if(!userss.some(item => +item == +target) && message.action == `call to ${target}`){ // Userin offline/online olmasini yoxlayir
                    console.log('User is offline');

                    setICall(true) // zeng mennen gedib
                    sessionStorage.setItem('iCall', 'true')
                    setCallModalText(`A call to ${message.userInfo.first_name.split('')[0].toUpperCase()}${message.userInfo.first_name.split('').slice(1).join('')}, but user is offline`)
                    return
                } else if(userss.some(item => +item == +target) && message.action == `call to ${target}` ){ // user online
                    console.log('Calling to ' + target);

                    if(+message.userInfo.id == +user?.user_id) { // target userin id si eger menim id bereberdir se, o zaman zeng zeng mennen deyil
                        localStorage.setItem('fromCallUserId' , message.fromUserId) // localda bunu saxlayirig, cunku zengi accept edende lazimdi

                        setCallModalText(`${message.fromUserName.split('')[0].toUpperCase()}${message.fromUserName.split('').slice(1).join('')}  is calling`)
                        sessionStorage.setItem('iCall', 'false')
                        sessionStorage.setItem('isVideoCall', message.callType == 'video' ? 'video' : 'voice')
                        return
                    }
                    else {
                        setCallModalText(`A call to ${message.userInfo.first_name.split('')[0].toUpperCase()}${message.userInfo.first_name.split('').slice(1).join('')}`)
                        setICall(true) // zeng mennen gedib
                        sessionStorage.setItem('iCall', 'true')
                        sessionStorage.setItem('isVideoCall', message.callType == 'video' ? 'video' : 'voice')

                        setIsVideoCall(message.callType == 'video');
                        return  
                    }

                    /*
                    setICall(true) - lazimdir ki, call modal pencerede biz accept buttonu gorsedey ya yox, zeng mennen gedirse o zaman call modalda accept buttonu olmayacag
                    */
                }  else if( message.action == `accept ${target}`) {

                    localStorage.setItem('videoCallRoomId' , ((+message.myId + +target) * 690) ) // unikal room id yaradirig, bunun unikalligi o cur olur ki, bizim butun userlerini id`leri tekrar olunmur, 690 vurdum ki, reqem cox gorsensin sadece olarag
                    setIsModalCallOpen(false); // modal pencereni baglayirig
                    setIsAccept(true); // bu mene lazimdir ki, zengi goturende bashqa sehifeye redirect etsin
                    return
                } else if( message.action == `decline ${target}`){
                    setIsModalCallOpen(false);  
                    return
                }
               



                let isRead = +message.target == +user.user_id;

                if(!message.chatId || message.chatId == +localStorage.chatId || (+target != user?.user_id && (+message.target == +user?.user_id))) {
                    setMessages((prevMessages) => {
                        return [
                                {
                                    author: message.target != user.user_id
                                    ,
                                    ...message
                                }
                            , ...prevMessages
                            ]
                        }
                    )
                }


            
                

                if (
                    // Условие 1: если chatId не совпадает с сохраненным chatId, и не является новым пользователем, и не является текущим пользователем
                    (+message.chatId !== +localStorage.chatId &&
                     +message.myId !== +localStorage.newUserChatId &&
                     +message.myId !== +user?.user_id) ||
                
                    // Условие 2: если chatId отсутствует, и отправитель не является текущим пользователем
                    (!message.chatId && +message.myId !== +user.user_id) ||
                    (!localStorage.chatId && !localStorage.newUserChatId)
                ) {
                    setNewMessages({
                        lastMessage: message.message,
                        fromUserId: target,
                        userName: message.userName
                    });
                }

                setAllChats(prev => {
                    return prev.map(item => {
                        if(+item.chatId == +message.chatId && +message.target ==  +localStorage.newUserChatId ) {
                            return {
                                ...item,
                                isRead: true
                            }
                        } else  return item
                    })
                })



                
                setLastMessages(prev => {
                    return prev.map((item) => {
                        if (+message.chatId == +item.chatId && +message.target == +target) {
                            

                            return {
                                ...item,
                                isRead ,
                                lastMessage: message.message
                            }
                        } else {
                            return item;
                        }
                    })
                })
           

                if(+localStorage.chatId == 0 && newChatUser.length)  {
                    getChats().then(res => localStorage.setItem('chatId', res[0].chatId))
                }

                if(message.myId == localStorage.newUserChatId){
                    // console.log('Message is read');
                }




            });

            socketInstance.on('disconnect', () => {
            });

            setSocket(socketInstance);
        }


    }, [user, USER_TOKKEN]);



    const sendMessage = async (newMessage) => {
        let id = localStorage.newUserChatId
        
        let res = await axios.post(`${CHAT_API}sendMessage/`, { target: id, message: newMessage.split('\n').join('\n') },
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKKEN}`,
                }
            }
        );


        let newObjectMessage = {
            messageId: messages.length ? +messages[0].messageId + 1 : 1,
            message: newMessage.split('\n').join('\n'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            chatId: chatId,
            myId: res.data.response.data.customerDetails.customerId,
            target: id ,
            userName: res.data.response.data.customerDetails.username
        }


        socket.emit('sendMessage', { target: id, message: newObjectMessage });
        setNewMessage('');
      

    };


    const addChat = (newChatUser) => {
        
        setMessages([])
        setNewChatUser(newChatUser);
        localStorage.setItem('chatId', false)
        setChatId(false);
        localStorage.setItem('newUserChatId', newChatUser.id)
    }


    const deleteChat = async (id) => {
        await axios.delete(`${CHAT_API}deleteChat/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${USER_TOKKEN}`,
                }
            }
        );
        getChats();
        setMessages([]);
        setNewChatUser(false);
        localStorage.setItem('chatId', false)

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
            callModalText,
            newConnect,
            isModalCallOpen,
            setMessages,
            onlineUsers,
            iCall,
            isAccept,
            isVideoCall,
            setIsAccept,
            acceptACall,
            declineCall,
            setNewMessage,
            sendMessage,
            getMessage,
            getChats,
            setNewChatUser,
            addChat,
            deleteChat,
            setIsModalCallOpen
        }}>
            {children}
        </ChatContext.Provider>
    )
}
