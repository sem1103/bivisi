
import { createContext, useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { toast } from "react-toastify";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await axiosInstance.get('/user/your_subscribers/');
        setSubscriptions(response.data.results);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      }
    }
    fetchSubs();
  }, [axiosInstance]);

  const toggleSubscription = async (id) => {
    try {
      const isSubscribed = subscriptions.some(sub => sub.id === id);
      if (isSubscribed) {
        await axiosInstance.delete(`/user/toggle_subscribe/${id}/`);
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
        toast.success("Unsubscribed successfully");
      } else {
        const response = await axiosInstance.post(`/user/toggle_subscribe/${id}/`);
        setSubscriptions([...subscriptions, response.data]);
        toast.success("Subscribed successfully");
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, toggleSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};