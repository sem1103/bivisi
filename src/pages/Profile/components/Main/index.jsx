import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import { AuthContext } from "../../../../context/authContext";
import useAxios from "../../../../utils/useAxios";
import { Img } from "@chakra-ui/react";

const Main = () => {
  const { userDetails } = useContext(AuthContext);
  const axiosInstance = useAxios();
  const [followsCount, setFollowsCount] = useState(0);
  const coverImage =
    userDetails?.cover_image ||
    "https://ozartur.sk/wp-content/plugins/profilegrid-user-profiles-groups-and-communities/public/partials/images/default-cover.jpg";
  const avatarImage =
    userDetails?.avatar ||
    "https://as2.ftcdn.net/v2/jpg/05/49/98/39/1000_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg";

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await axiosInstance.get('/user/your_subscribers/');
        if (response.data.results && userDetails) {
          const userSubscription = response.data.results.find(
            (item) => item.user && item.user.id === userDetails.id
          );
          if (userSubscription) {
            setFollowsCount(userSubscription.follows_count);
          }
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      }
    }
    fetchSubs();
  }, [axiosInstance, userDetails]);

  return (
    <>
      <section className="profile_section container-fluid">
        <div
          className="profile_bg_image"
          style={{ backgroundImage: `url(${coverImage})` }}
        ></div>
        <div className="profile_info">
          <div
            className="profile_img_content"
            style={{ backgroundImage: `url(${avatarImage})` }}
          ></div>

          <div className="profile_text_content">
            <h1>{userDetails?.username}</h1>
            <h6>{userDetails?.email}</h6>
            <div className="d-flex gap-3">
              <p>
                <span>{userDetails?.subscribers_count}</span> subscribers
              </p>
              <p>
                <span>{followsCount}</span> subscriptions
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Main;









