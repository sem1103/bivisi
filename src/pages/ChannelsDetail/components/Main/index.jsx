// import React, { useEffect, useState } from 'react';
// import './style.scss';
// import { useParams } from 'react-router-dom';
// import useAxios from '../../../../utils/useAxios';
// import nullImg from '../../../../assets/images/user-empty-avatar.png'

// const MainChannels = () => {
//   const { username } = useParams();
//   const [webChannels, setWebChannels] = useState([]); 
//   const axiosInstance = useAxios();
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res1 = await axiosInstance.get(`/user/subscriptions/`);
//         setWebChannels(res1.data?.results.filter(item => item.username == username)); 
//         console.log(res1.data?.results.filter(item => item.username == username));
//       } catch (error) {
//         console.error("Error fetching data:", error); 
//       }
//     };
//     if (username) {
//       fetchData(); 
//     }
//   }, [username]);



//   return (
//     <div className='main_section'>
//       <div className="chanels_bg_image" style={{backgroundImage: `url(${webChannels[0]?.
// cover_image ?  webChannels[0]?.
// cover_image : 'https://ozartur.sk/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-cover.jpg'})`}}></div>
//       <div className="channels_info">
//         <div className="channels_text_content">
//           <div className="chanells_img_content" style={{backgroundImage: `url(${webChannels[0]?.avatar ? webChannels[0]?.avatar : nullImg })`}}></div>
//           <div>
//             <h4>{username}</h4>
//             <p><span className='me-2'>{webChannels[0]?.follower_count}</span>subscribers</p>
//           </div>
//         </div>
//         <div className='subs_btn'>
//           <button>Subscribe</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainChannels;




import React, { useEffect, useState } from 'react';
import './style.scss';
import { useParams, useLocation } from 'react-router-dom';
import nullImg from '../../../../assets/images/user-empty-avatar.png';
import default_coverimg from "../../../../assets/images/default-coverimg.jpg";
import user_emptyavatar from "../../../../assets/images/user-empty-avatar.png";
import useAxios from '../../../../utils/useAxios';

const MainChannels = ({ popularChannels }) => {
  const { username } = useParams();
  const location = useLocation();
  const followersCount = location.state?.followersCount || 0;

  const [webChannels, setWebChannels] = useState([]);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await axiosInstance.get(`/channel_web_products/${username}/`);
        console.log(res1.data?.results);
        setWebChannels(res1?.data?.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, []);

  // Sample popularChannels object for illustration; replace with real data source
  // const popularChannels = {
  //   cover_image: "url_to_cover_image", // Replace with actual cover image URL
  //   avatar: "url_to_avatar_image", // Replace with actual avatar URL
  // };

  return (
    <div className='main_section'>
      <div
        className="chanels_bg_image"
      // style={{ backgroundImage: `url(${popularChannels.cover_image || default_coverimg})` }}
      ></div>
      <div className="channels_info">
        <div className="channels_text_content">
          <div
            className="chanells_img_content"
          style={{ backgroundImage: `url(${webChannels[0]?.product?.user?.avatar || user_emptyavatar})` }}
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
