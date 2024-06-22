import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "./style.scss";
import useAxios from "../../utils/useAxios";
import default_coverimg from "../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../assets/images/user-empty-avatar.png";
import { AuthContext } from "../../context/authContext";
import { NavLink } from "react-router-dom";

const PopularChannelCard = ({ popularChannels, page }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [followersCount, setFollowersCount] = useState(popularChannels?.followers_count || 0);
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const subscriptionStatus = localStorage.getItem(`subscribed_${popularChannels.id}`);
      if (subscriptionStatus) {
        setSubscribed(JSON.parse(subscriptionStatus));
      }
    }
  }, [popularChannels.id, user]);

  const toggleSubs = async (id) => {
    if (!user) {
      toast.warning('Please sign in');
      return;
    }
    try {
      const res = await axiosInstance.post(`/user/toggle_subscribe/${id}/`);
      if (res.status === 201) {
        const newSubscribedStatus = !subscribed;
        setSubscribed(newSubscribedStatus);
        localStorage.setItem(`subscribed_${id}`, JSON.stringify(newSubscribedStatus));
        if (newSubscribedStatus) {
          toast.success("Subscribed successfully");
          setFollowersCount(prevCount => prevCount + 1);
        } else {
          toast.success("Unsubscribed successfully");
          setFollowersCount(prevCount => prevCount - 1);
        }
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const colClass = ['channelcard',].includes(page) ? 'col-lg-6 col-md-6 col-sm-12 col-12' : '';
  console.log(popularChannels);
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
          <NavLink to={`/channels_detail/channels_videos/${popularChannels.username}`}>{popularChannels?.username}</NavLink>
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
            {user ? (
              <div>
                <button
                  className={`subs-button${subscribed ? " unsubs-button" : ""}`}
                  onClick={() => toggleSubs(popularChannels.id)}
                >
                  {subscribed ? "Unsubscribe" : "Subscribe"}
                </button>
              </div>
            ) : (
              <div>
                <button className="subs-button" onClick={() => toggleSubs(popularChannels.id)}>Subscribe</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularChannelCard;
