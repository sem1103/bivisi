import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import useAxios from "../../utils/useAxios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import default_coverimg from "../../assets/images/default-coverimg.jpg"
import user_emptyavatar from "../../assets/images/user-empty-avatar.png"
import { useNavigate } from "react-router-dom";
import subscribeOutline from "../../layout/Sidebar/icons/subscribeOutline.svg";
import SortChannel from "../../components/SortChannel";
const Subscription = () => {
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [sortedSubscriptions, setSortedSubscriptions] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await axiosInstance.get('/user/your_subscribers/');
        setSubscriptions(response?.data?.results);
        setSortedSubscriptions(response.data.results);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      }
    }
    fetchSubs();
  }, []);

  const toggleUnSubs = async (id) => {
    if (!user) {
      toast.warning('Please sign in');
      return;
    }
    try {
      console.log(`id: ${id}`);
      const res = await axiosInstance.delete(`/user/toggle_subscribe/${id}/`);
      if (res.status === 204) {
        setSubscriptions(subscriptions.filter(item => item.id !== id));
        setSortedSubscriptions(sortedSubscriptions.filter(item => item.id !== id));
        toast.success("Unsubscribed successfully");
      } else {
        console.log("Unsubscription failed");
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error.response ? error.response.data : error);
    }
  }


  return (
    <div className="subscription">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center section_title">
            <div className="d-flex align-items-center gap-2">
              <img width={27} src={subscribeOutline} alt="subscribeOutline" />
              <h4 className="mt-1">Your subscriptions</h4>
            </div>
            <div className="custom-select">
            <SortChannel sortedChannels={sortedSubscriptions} setSortedChannels={setSortedSubscriptions} />
            </div>
          </div>
          {sortedSubscriptions.map((item) => (
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 p-2" key={item.id}>
              <div className="channelCard">
                <img src={item.cover_image || default_coverimg} className="img-top" alt="" />
                <div className="opacity-img">
                  <img src={item.avatar || user_emptyavatar} alt="" />
                </div>
                <div className="channelCard-context">
                  {/* <h2>{item.username}</h2> */}
                  <div
                    className="username"
                    onClick={() => navigate(
                      `/channels_detail/channels_videos/${item.username}`,
                      {
                        state: {
                          channelDetailData: item,
                        }
                      }
                    )}
                  >
                    {item?.username}
                  </div>
                  <span>{item.first_name} {item.last_name}</span>
                  <p>{item.bio}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center avatar-group">
                      <div className="avatar">
                        <img src={item.avatar || user_emptyavatar} alt="" />
                      </div>
                      <div className="hidden-avatars">
                        <span>{item.follower_count} subscribes</span>
                      </div>
                    </div>
                    <div>
                      <button className="unsubs-button" onClick={() => toggleUnSubs(item.id)}>
                        Unsubscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;