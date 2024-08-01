import React, { useEffect, useState } from "react";
import "./style.scss";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../../api/baseUrl";
import axios from "axios";

const Categories = ({ username }) => {
  const { pathname } = useLocation();
  const pathSegments = pathname.split('/')[2];
  const [channelDetailData, setChannelDetailData] = useState(null);

  useEffect(() => {
    const getChannelDetail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/popular-channels/`);
        console.log(res?.data.results)
        setChannelDetailData(res?.data.results.find((item) => item.username === username));
      } catch (error) {
        console.error('Failed to fetch channel details:', error);
      }
    };
    getChannelDetail();
  }, [pathSegments]);
  return (
    <div className="channels_categories container-fluid">
      <NavLink
        to={`/channels_detail/channels_videos/${username}`}
        activeclassname="active"
        state={{ channelDetailData }}
      >
        Videos
      </NavLink>
      <NavLink
        activeclassname="active"
        to={`/channels_detail/channels_shorts/${username}`}
        state={{ channelDetailData }}
      >
        Shorts 
      </NavLink>
      <NavLink
        activeclassname="active"
        to={`/channels_detail/about/${username}`}
        state={{ channelDetailData }}
      >
        About
      </NavLink>
    </div>
  );
};

export default Categories;
