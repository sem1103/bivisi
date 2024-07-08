import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "./style.scss";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import default_coverimg from "../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../assets/images/user-empty-avatar.png";
import { SubscriptionContext } from "../../context/subscriptionContext";


const PopularChannelCard = ({ popularChannels, page }) => {
  const { subscriptions, toggleSubscription } = useContext(SubscriptionContext);
  const { user } = useContext(AuthContext);
  const [followersCount, setFollowersCount] = useState(popularChannels?.follower_count || 0);
  const navigate = useNavigate();
  const isSubscribed = subscriptions.some(sub => sub.id === popularChannels.id);

  const handleSubscription = () => {
    if (!user) {
      toast.warning('Please sign in');
      return;
    }
    toggleSubscription(popularChannels.id);
    setFollowersCount(prev => isSubscribed ? prev - 1 : prev + 1);
  };

  const colClass = ['channelcard'].includes(page) ? 'col-lg-6 col-md-6 col-sm-12 col-12' : '';
  const subscriberText = followersCount <= 1 ? 'subscriber' : 'subscribers';
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
          <div
            className="username"
            onClick={() => navigate(
              `/channels_detail/channels_videos/${popularChannels.username}`,
              {
                state: {
                  followersCount,
                  cover_image: popularChannels.cover_image,
                  avatar: popularChannels.avatar
                }
              }
            )}
          >
            {popularChannels?.username}
          </div>
          <span>{popularChannels.first_name} {popularChannels.last_name}</span>
          <p>{popularChannels.bio}</p>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center avatar-group">
              <div className="avatar">
                <img src={popularChannels?.avatar || user_emptyavatar} alt="Avatar" />
              </div>
              <div className="hidden-avatars">
                <span>{followersCount} {subscriberText}</span>
              </div>
            </div>
            <div>
              <button
                className={`subs-button${isSubscribed ? " unsubs-button" : ""}`}
                onClick={handleSubscription}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularChannelCard;