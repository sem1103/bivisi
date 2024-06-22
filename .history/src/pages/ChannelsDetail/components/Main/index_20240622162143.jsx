import React, { useEffect, useState } from 'react';
import './style.scss';
import { useParams } from 'react-router-dom';
import useAxios from '../../../../utils/useAxios';

const MainChannels = () => {
  const { username } = useParams();
  const [webChannels, setWebChannels] = useState([]); 
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axiosInstance.get(`/user/subscriptions/`);
        // console.log("data:", res1.data.results);
        const webChannel = res1.data.results.fillter(item => item.name == username)
        setWebChannels(res1.data.results); 
        console.log(webChannel);
      } catch (error) {
        console.error("Error fetching data:", error); 
      }
    };
    if (username) {
      fetchData(); 
    }
  }, [username]);



console.log(webChannels);
  return (
    <div className='main_section'>
      <div className="chanels_bg_image" style={{backgroundImage: `url(${webChannels[0]?.
cover_image})`}}></div>
      <div className="channels_info">
        <div className="channels_text_content">
          <div className="chanells_img_content" style={{backgroundImage: `url(${webChannels[0]?.product?.user?.avatar })`}}></div>
          <div>
            <h4>{username}</h4>
            <p><span className='me-2'>3</span>subscribers</p>
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
