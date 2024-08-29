import React, { useEffect, useState } from "react";
import "./style.scss";
import MainChannels from "../../components/Main";
import Categories from "../../components/Categories";
import ChannelsShort from "../../components/ChannelsShort";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../api/baseUrl";
import { useInView } from 'react-intersection-observer';



const ChannelsShorts = () => {
  const { username } = useParams();

  const [shorts, setShorts] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0.5,      // Триггер срабатывает, когда 10% элемента видны
  });
  const [productsPaginCount, setProductsPaginCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const fetchChannelVideos = async (offset) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/channel_web_products/${username}/?product_type=Shorts&offset=${offset}`
      );
      console.log(response.data);
      
      setShorts(prev => prev.length ? [...prev, ...response.data.results] : response.data.results);
      setProductsCount(response.data.count)

    } catch (error) {
      console.error("Failed to fetch popular channels:", error);
    }
  };

  useEffect(() => {
    
    fetchChannelVideos(0);
  }, []);


  const onScrollEnd = () => {
    setProductsPaginCount(prevCount => {
        const newCount = shorts.length != productsCount && prevCount + 1;
        shorts.length != productsCount &&  fetchChannelVideos(newCount * 12);
        return newCount;
    });
}
useEffect(() => {
    if (inView) {
        onScrollEnd();
    }
}, [inView]);




  return (
    <>
      <div className="channels_shorts">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h6>Shorts</h6>
            </div>
            {shorts.map((item) => {
              return <ChannelsShort key={item?.id} item={item} shortsCount={productsCount} />;
            })}

{
            shorts.length != productsCount &&
            <div className="loading" ref={ref}>
              <div className="wrapper" >
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
              </div>
            </div>

          }
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelsShorts;
