import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import sort from "../../assets/icons/Sort.svg";
import useAxios from "../../utils/useAxios";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { Select } from 'antd';
import PopularChannelCard from "../../components/PChannel";
import default_coverimg from "../../assets/images/default-coverimg.jpg"
import user_emptyavatar from "../../assets/images/user-empty-avatar.png"


const Subscription = () => {
  const axiosInstance = useAxios();
  const { user } = useContext(AuthContext);
  const { Option } = Select;
  const [subscriptions, setSubscriptions] = useState([]);
  const [sortedSubscriptions, setSortedSubscriptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const response = await axiosInstance.get('/user/your_subscribers/');
        setSubscriptions(response.data.results);
        console.log(response.data.results);
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
      console.log('Server response:', res);

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

  const handleSortChange = (value) => {
    setSelectedOption(value);
    let sorted = [...subscriptions];

    switch (value) {
      case 'option1': 
        sorted.sort((a, b) => a.follows.username.localeCompare(b.follows.username));
        break;
      case 'option2': 
        sorted.sort((a, b) => b.follows.username.localeCompare(a.follows.username));
        break;
      default:
        sorted = [...subscriptions]; 
        break;
    }

    setSortedSubscriptions(sorted);
  }

  return (
    <div className="subscription">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-between align-items-center py-4">
            <h1>Your subscriptions</h1>
            <div className="custom-select">
              <Select
                value={selectedOption}
                suffixIcon={null}
                className="select"
                popupClassName="custom-dropdown"
                prefixicon={<img src={sort} alt="sort icon" width={20} />}
                onChange={handleSortChange}
              >
                <Option value="">All</Option>
                <Option value="option1">A to Z</Option>
                <Option value="option2">Z to A</Option>
              </Select>
            </div>
          </div>
          {sortedSubscriptions.map((item) => (
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 p-3" key={item.id}>
              <div className="channelCard">
                <img src={item.follows.cover_image || default_coverimg} className="img-top" alt="" />
                <div className="opacity-img">
                  <img src={item.follows.avatar || user_emptyavatar} alt="" />
                </div>
                <div className="channelCard-context">
                  <h2>{item.follows.username}</h2>
                  <span>{item.follows.first_name} {item.follows.last_name}</span>
                  <p>{item.follows.bio}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center avatar-group">
                      <div className="avatar">
                        <img src={item.follows.avatar || user_emptyavatar} alt="" />
                      </div>
                      <div className="hidden-avatars">
                        <span>{item.follows.follower_count} subscribes</span>
                      </div>
                    </div>
                    <div>
                      <button className="unsubs-button" onClick={() => toggleUnSubs(item.follows.id)}>
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
