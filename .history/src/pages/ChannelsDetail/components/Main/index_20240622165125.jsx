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
        setWebChannels(res1.data?.results.filter(item => item.username == username)); 
        console.log(res1.data?.results.filter(item => item.username == username));
      } catch (error) {
        console.error("Error fetching data:", error); 
      }
    };
    if (username) {
      fetchData(); 
    }
  }, [username]);



  return (
    <div className='main_section'>
      <div className="chanels_bg_image" style={{backgroundImage: `url(${webChannels[0]?.
cover_image})`}}></div>
      <div className="channels_info">
        <div className="channels_text_content">
          <div className="chanells_img_content" style={{backgroundImage: `url(${webChannels[0]?.avatar ? webChannels[0]?.avatar : 's' })`}}></div>
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
