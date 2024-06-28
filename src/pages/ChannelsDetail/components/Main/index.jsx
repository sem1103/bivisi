import React, { useContext, useEffect } from "react";
import "./style.scss";
import { useParams, useLocation } from "react-router-dom";
import default_coverimg from "../../../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../../../assets/images/user-empty-avatar.png";
import { ProductContext } from "../../../../context/ProductContext";

const MainChannels = () => {
  const { username } = useParams();
  const location = useLocation();
  const { channelData, setChannelData } = useContext(ProductContext);

  useEffect(() => {
    setChannelData((prevData) => ({
      ...prevData,
      username: username,
      followersCount: location.state?.followersCount || prevData.followersCount,
      cover_image: location.state?.cover_image || prevData.cover_image,
      avatar: location.state?.avatar || prevData.avatar,
    }));
  }, [location]);
  console.log(channelData);
  return (
    <div className="main_section">
      <div
        className="chanels_bg_image"
        style={{ backgroundImage: `url(${channelData?.cover_image})` }}
      ></div>
      <div className="channels_info">
        <div className="channels_text_content">
          <div
            className="chanells_img_content"
            style={{ backgroundImage: `url(${channelData?.avatar})` }}
          ></div>
          <div>
            <h4>{username}</h4>
            <p>
              <span className="me-2">{channelData?.followersCount}</span>
              subscribers
            </p>
          </div>
        </div>
        <div className="subs_btn">
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default MainChannels;
