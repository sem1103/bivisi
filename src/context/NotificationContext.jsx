import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { AuthContext } from "./authContext";

export const NotificationContext = createContext();

export default function NotificationProvider({ children }) {
    const { user } = useContext(AuthContext);
    const USER_TOKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;

    const [notificationSocket, setNotificationSocket] = useState(null);
    const [myVideos, setMyVideos] = useState([]);
    const [isConnect, setIsConnect] = useState(false);


    const getMyVideos = async () => {
        const res2 = await axios.get(`https://bivisibackend.store/api/user_web_products/`, {
            headers: {
                Authorization: `Bearer ${USER_TOKEN}`,
            }
        });

        setMyVideos(res2.data.results);
    }

  

    useEffect(() => {
        if (USER_TOKEN && user) {
            getMyVideos();

            if (!isConnect) {
                const socketInstance = new WebSocket(`wss://bivisibackend.store/ws/notifications/?token=${USER_TOKEN}`);
                socketInstance.onopen = function (event) {
                    console.log("Notification socket is open now.");
                }

               
                socketInstance.onclose = (e) => {
                    console.log("Notification socket closed.", e);
                };

                setNotificationSocket(socketInstance)
                setIsConnect(true);
            }
        }

      
    }, [USER_TOKEN, user]);

    return (
        <NotificationContext.Provider
            value={{
                notificationSocket,
                myVideos
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}
