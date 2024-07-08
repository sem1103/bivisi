import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { useParams, useLocation } from "react-router-dom";
import default_coverimg from "../../../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../../../assets/images/user-empty-avatar.png";
import { ProductContext } from "../../../../context/ProductContext";
import { SubscriptionContext } from "../../../../context/subscriptionContext";
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";

const MainChannels = () => {
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const { username } = useParams();
  const location = useLocation();
  const { channelData, setChannelData } = useContext(ProductContext);
  const { toggleSubscription, subscriptions } = useContext(SubscriptionContext);
  const isSubscribed = subscriptions?.some(sub => sub.username === username);

  useEffect(() => {
    const fetchPChannels = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/popular-channels/`);
        const current = response?.data.results.filter(item => item.username === username);
        setCurrentChannelId(current[0]?.id || null);
        setChannelData({
          username: current[0]?.username || '',
          followersCount: current[0]?.follower_count || 0,
          cover_image: current[0]?.cover_image || default_coverimg,
          avatar: current[0]?.avatar || user_emptyavatar
        });
      } catch (error) {
        console.error('Failed to fetch popular channels:', error);
      }
    };
    fetchPChannels();
  }, [username, setChannelData]);

  useEffect(() => {
    if (location.state) {
      setChannelData(prevData => ({
        ...prevData,
        followersCount: location.state.followersCount || prevData.followersCount,
        cover_image: location.state.cover_image || prevData.cover_image,
        avatar: location.state.avatar || prevData.avatar,
      }));
    }
  }, [location, setChannelData]);

  const handleSubscriptionToggle = () => {
    toggleSubscription(currentChannelId);
    setChannelData(prevData => ({
      ...prevData,
      followersCount: isSubscribed 
        ? prevData.followersCount - 1 
        : prevData.followersCount + 1
    }));
  };

  const subscriberText = channelData?.followersCount === 1 ? 'subscriber' : 'subscribers';

  return (
    <div className="main_section">
      <div
        className="chanels_bg_image"
        style={{ backgroundImage: `url(${channelData?.cover_image || default_coverimg})` }}
      ></div>
      <div className="channels_info">
        <div className="channels_text_content">
          <div
            className="chanells_img_content"
            style={{ backgroundImage: `url(${channelData?.avatar || user_emptyavatar})` }}
          ></div>
          <div>
            <h4>{username}</h4>
            <p>
              <span className="me-2">{channelData?.followersCount}</span>
              {subscriberText}
            </p>
          </div>
        </div>
        <div className="subs_btn">
          <button
            className={`subs-button${isSubscribed ? " unsubs-button" : ""}`}
            onClick={handleSubscriptionToggle}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChannels;
