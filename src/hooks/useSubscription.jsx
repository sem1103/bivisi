import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import useAxios from "../utils/useAxios";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { BASE_URL } from "../api/baseUrl";
import { NotificationContext } from "../context/NotificationContext";
import Cookies from 'js-cookie';

const useSubscription = (channelId, initialFollowersCount) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
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
      setFollowersCount(res.data[0].subscribers_count);
      
    }
  }

  const checkSubscribed = () => {
    const subscribedChannel = subscribersList.find(channel => channel.id === (channelId.name ? channelId.id : channelId));
    setIsSubscribed(!!subscribedChannel);
  }

  useEffect(() => {
    
   
    channelId.name && searchUser(channelId.name)

    fetchSubscribers();

    return () => {
      setFollowersCount(0)
    }
  }, []);



  useEffect(() => {
    checkSubscribed()
  }, [subscribersList, channelId]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.warning('Please sign in');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/user/toggle_subscribe/${channelId.name ? channelId.id : channelId}/`);
   
      
      

      
      if (response.status === 201) {
        setIsSubscribed(true);
  
        let res = await axios.get(`${BASE_URL}/user/users/?search=${channelId.name}`, {
          headers: {
            Authorization: `Bearer ${USER_TOKKEN}`
          }
        });
        setFollowersCount(res.data[0].subscribers_count);
        console.log(res.data[0]);
        
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
      const response = await axiosInstance.delete(`/user/toggle_subscribe/${channelId.name ? channelId.id : channelId}/`);
      if (response.status === 204) {
        setIsSubscribed(false);
               
        let res = await axios.get(`${BASE_URL}/user/users/?search=${channelId.name}`, {
          headers: {
            Authorization: `Bearer ${USER_TOKKEN}`
          }
        });
        setFollowersCount(res.data[0].subscribers_count);
        console.log(res.data[0]);
        toast.success("Unsubscribed successfully");
        
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFollowersCount(initialFollowersCount);
  }, [initialFollowersCount]);

  return { isSubscribed, followersCount, setFollowersCount,handleSubscribe, handleUnsubscribe, loading , searchUser, checkSubscribed};
};

export default useSubscription;
