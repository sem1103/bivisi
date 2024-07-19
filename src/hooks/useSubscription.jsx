import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import useAxios from "../utils/useAxios";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { BASE_URL } from "../api/baseUrl";
const useSubscription = (channelId, initialFollowersCount) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [subscribersList, setSubscribersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axiosInstance.get('/user/your_subscribers/');
        setSubscribersList(response.data.results);
      } catch (error) {
        console.error('Failed to fetch subscribers list:', error);
      }
    };
    fetchSubscribers();
  }, []);

  useEffect(() => {
    const subscribedChannel = subscribersList.find(channel => channel.id === channelId);
    setIsSubscribed(!!subscribedChannel);
  }, [subscribersList, channelId]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.warning('Please sign in');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/user/toggle_subscribe/${channelId}/`);
      if (response.status === 201) {
        setIsSubscribed(true);
        const responseChannel = await axios.get(`${BASE_URL}/user/popular-channels/`);
        const channel = responseChannel?.data.results.find((item) => item.id === channelId);
        setFollowersCount(channel?.follower_count);
        toast.success("Subscribed successfully");
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
      const response = await axiosInstance.delete(`/user/toggle_subscribe/${channelId}/`);
      if (response.status === 204) {
        setIsSubscribed(false);
        const responseChannel = await axios.get(`${BASE_URL}/user/popular-channels/`);
        const channel = responseChannel?.data.results.find((item) => item.id === channelId);
        setFollowersCount(channel?.follower_count);
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

  return { isSubscribed, followersCount, setFollowersCount,handleSubscribe, handleUnsubscribe, loading };
};

export default useSubscription;
