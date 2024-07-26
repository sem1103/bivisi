import React, { useEffect, useState } from "react";
import "./style.scss";
import { useLocation, useParams } from "react-router-dom";
import default_coverimg from "../../../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../../../assets/images/user-empty-avatar.png";
import useSubscription from "../../../../hooks/useSubscription";
import { BASE_URL } from "../../../../api/baseUrl";
import axios from "axios";

const MainChannels = () => {
  const location = useLocation();
  const [channelData, setChannelData] = useState({});
  const params = useParams();
  const [channelId, setChannelId] = useState(null);
  const { isSubscribed, handleSubscribe, handleUnsubscribe, followersCount, setFollowersCount, loading } = useSubscription(channelId, channelData.follower_count);
  const [showFollowersCount, setShowFollowersCount] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      const responseChannel = await axios.get(`${BASE_URL}/user/popular-channels/`);
      const channel = responseChannel?.data.results.find((item) => item.id === channelData?.id);
      setFollowersCount(channel?.follower_count);
    };
    refresh();
  }, [followersCount, setFollowersCount, channelData?.id]);

  useEffect(() => {
    if (location.state) {
      const channelData = {
        username: params?.username,
        id: location.state.channelDetailData?.id,
        cover_image: location.state.channelDetailData?.cover_image,
        avatar: location.state.channelDetailData?.avatar,
        follower_count: location.state?.channelDetailData?.follower_count,
      };
      setChannelData(channelData);
      setChannelId(channelData.id);
    }
  }, [location.state, params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFollowersCount(true);
      setShowButtons(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);
  const subscriberText = channelData?.follower_count <= 1 ? ' subscriber' : ' subscribers';

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
            <h4>{channelData?.username}</h4>
           {channelData?.bio&& <p>{channelData?.bio}</p>}
            <p>
              {showFollowersCount && (
                <span className="me-2">{followersCount}{subscriberText}</span>
              )}
            </p>
          </div>
        </div>
        <div className="subs_btn">
          {showButtons && (
            isSubscribed ? (
              <button className="subs-button unsubs-button" onClick={handleUnsubscribe}>Unsubscribe</button>
            ) : (
              <button className="subs-button" onClick={handleSubscribe}>Subscribe</button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MainChannels;
