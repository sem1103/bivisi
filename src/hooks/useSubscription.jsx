import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import useAxios from "../utils/useAxios";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { BASE_URL } from "../api/baseUrl";
import { NotificationContext } from "../context/NotificationContext";
import Cookies from 'js-cookie';

const useSubscription = (chanellName) => {
  const [userChanell, setUserChanell] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [subscribersList, setSubscribersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const {notificationSocket} = useContext(NotificationContext);
  const USER_TOKKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;

  const fetchSubscribers = async () => {
    try {
      const response = await axiosInstance.get('/user/your_subscribers/');
      setSubscribersList(response.data.results);     
   
    } catch (error) {
      console.error('Failed to fetch subscribers list:', error);
    }
  };


  const searchUser = async (value) => {
    if (value) {
      let res = await axios.get(`${BASE_URL}/user/users/?search=${value}`, {
        headers: {
          Authorization: `Bearer ${USER_TOKKEN}`
        }
      });
      let findUser = res.data.find(user => user.username == value)
      setFollowersCount(findUser.subscribers_count);
      setUserChanell(findUser)
      
    }
  }

  const checkSubscribed = () => {
    if(subscribersList.length > 0){
      setIsSubscribed(subscribersList.some(channel => channel.id === userChanell?.id));
    }
    
  }

  useEffect(() => {
    searchUser(chanellName)
    fetchSubscribers();

    return () => {
      setFollowersCount(0)
    }
  }, []);

  useEffect(() => {
    checkSubscribed()
  
  }, [subscribersList]);





  const handleSubscribe = async () => {
    if (!user) {
      toast.warning('Please sign in');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/user/toggle_subscribe/${userChanell.id}/`);
   
      
      

      
      if (response.status === 201) {
        setIsSubscribed(true);
  
        let res = await axios.get(`${BASE_URL}/user/users/?search=${userChanell.username}`, {
          headers: {
            Authorization: `Bearer ${USER_TOKKEN}`
          }
        });
        setFollowersCount(res.data[0].subscribers_count);
        
        toast.success("Subscribed successfully");

        
        notificationSocket.send(
          JSON.stringify(
            {
            notification_type: response.data.notification_type, 
            message: response.data.message ,
            sender: {
              ...response.data.sender,
              avatar : response.data.sender.avatar ? '' : response.data.sender.avatar
            },
            notification_id: response.data.notification_id
          })
        )

      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/user/toggle_subscribe/${userChanell.id}/`);
      if (response.status === 204) {
        setIsSubscribed(false);
               
        let res = await axios.get(`${BASE_URL}/user/users/?search=${userChanell.username}`, {
          headers: {
            Authorization: `Bearer ${USER_TOKKEN}`
          }
        });
        setFollowersCount(res.data[0].subscribers_count);
        toast.success("Unsubscribed successfully");
        
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  

  return {userChanell, isSubscribed, followersCount, fetchSubscribers,setFollowersCount,handleSubscribe, handleUnsubscribe, loading , searchUser, checkSubscribed};
};

export default useSubscription;
