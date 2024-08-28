import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import MainChannels from "../../components/Main";
import Categories from "../../components/Categories";
import ChannelsVideo from "../../components/ChannelsVideo";
import { useLocation, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../api/baseUrl";
import axios from "axios";
import { ProductContext } from "../../../../context/ProductContext";
const ChannelsVideos = () => {
  const { username } = useParams();
  const [channels, setChannels] = useState([]);

  

  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/channel_web_products/${username}/?product_type=Video`
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
     

      <div className="channels_videos">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h6>Videos</h6>
            </div>
            {channels.map((item) => {
              return <ChannelsVideo key={item?.id} item={item} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelsVideos;
