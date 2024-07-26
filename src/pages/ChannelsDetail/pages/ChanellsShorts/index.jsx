import React, { useEffect, useState } from "react";
import "./style.scss";
import MainChannels from "../../components/Main";
import Categories from "../../components/Categories";
import ChannelsShort from "../../components/ChannelsShort";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";
const ChannelsShorts = () => {
  const { username } = useParams();

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/channel_web_products/${username}/?product_type=Shorts`
        );
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

      <div className="channels_shorts">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h6>Shorts</h6>
            </div>
            {channels.map((item) => {
              return <ChannelsShort key={item?.id} item={item} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelsShorts;
