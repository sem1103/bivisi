import React, { useEffect, useState } from "react";
import "./style.scss";
import MainChannels from "../../components/Main";
import Categories from "../../components/Categories";
import ChannelsVideo from "../../components/ChannelsVideo";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../../api/baseUrl";
import axios from "axios";
const ChannelsVideos = () => {
  const { username } = useParams();
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/channel_web_products/${username}/?product_type=Video`
        );

        console.log(response.data.results);
        setChannels(response.data.results);
      } catch (error) {
        console.error("Failed to fetch popular channels:", error);
      }
    };
    fetchChannelVideos();
  }, []);

  return (
    <>
      <MainChannels />
      <Categories username={username} />

      <div className="channels_videos">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 mb-3">
              <h6>Videos</h6>
            </div>
            {channels.map((item) => {
              return <ChannelsVideo item={item} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelsVideos;
