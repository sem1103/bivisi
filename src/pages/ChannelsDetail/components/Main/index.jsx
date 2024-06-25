import React from 'react';
import './style.scss';
import { useParams, useLocation } from 'react-router-dom';
import default_coverimg from "../../../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../../../assets/images/user-empty-avatar.png";

const MainChannels = () => {
  const { username } = useParams();
  const location = useLocation();
  const followersCount = location.state?.followersCount || 0;
  const cover_image = location.state?.cover_image || default_coverimg;
  const avatar = location.state?.avatar || user_emptyavatar;

  return (
    <div className='main_section'>
      <div
        className="chanels_bg_image"
        style={{ backgroundImage: `url(${cover_image})` }}
      ></div>
      <div className="channels_info">
        <div className="channels_text_content">
          <div
            className="chanells_img_content"
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
          <div>
            <h4>{username}</h4>
            <p><span className='me-2'>{followersCount}</span>subscribers</p>
          </div>
        </div>
        <div className='subs_btn'>
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default MainChannels;
