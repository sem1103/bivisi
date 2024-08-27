import React from "react";
import "./style.scss";
import default_coverimg from "../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../assets/images/user-empty-avatar.png";
import useSubscription from "../../hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api/baseUrl";

const PopularChannelCard = ({ popularChannels, page }) => {

  

  const {
    isSubscribed,
    followersCount,
    handleSubscribe,
    handleUnsubscribe,
    loading,
  } = useSubscription(popularChannels.id, popularChannels.follower_count);
  
  const navigate = useNavigate();

  const getChannelDetail = async (popularChannels) => {
    navigate(`/channels_detail/channels_videos/${popularChannels.username}`, { state: { channellId: popularChannels } });    
  };

  const colClass = ['channelcard'].includes(page) ? 'col-lg-6 col-md-6 col-sm-12 col-12' : '';

  return (
    <div className={`${colClass} p-2`}>
      <div className="channelCard">
        <img
          src={popularChannels.cover_image || default_coverimg}
          className="img-top"
          alt="Cover"
        />
        <div className="opacity-img">
          <img src={popularChannels?.avatar || user_emptyavatar} alt="Avatar" />
        </div>
        <div className="channelCard-context">
          <div className="username" onClick={() => getChannelDetail(popularChannels)}>
            {popularChannels?.username}
          </div>
          <span>
            {popularChannels.first_name} {popularChannels.last_name}
          </span>
          <p>
            {popularChannels.bio}
          </p>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center avatar-group">
              <div className="avatar">
                <img src={popularChannels?.avatar || user_emptyavatar} alt="Avatar" />
              </div>
              <div className="hidden-avatars">
                <span>{followersCount} subscribes</span>
              </div>
            </div>
            {isSubscribed ? (
              <button className="subs-button unsubs-button" onClick={handleUnsubscribe} disabled={loading}>Unsubscribe</button>
            ) : (
              <button className="subs-button" onClick={handleSubscribe} disabled={loading}>Subscribe</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularChannelCard;
