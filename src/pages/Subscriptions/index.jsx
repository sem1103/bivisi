
import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import sort from "../../assets/icons/Sort.svg";
import { AuthContext } from "../../context/authContext";
import { Select } from 'antd';
import PopularChannelCard from "../../components/PChannel";
import { SubscriptionContext } from "../../context/subscriptionContext";
import default_coverimg from "../../assets/images/default-coverimg.jpg"
import user_emptyavatar from "../../assets/images/user-empty-avatar.png"
import { useNavigate } from "react-router-dom";
const Subscription = () => {
  const { subscriptions } = useContext(SubscriptionContext);
  const { user } = useContext(AuthContext);
  const { Option } = Select;
  const [sortedSubscriptions, setSortedSubscriptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    setSortedSubscriptions(subscriptions);
  }, [subscriptions]);

  const handleSortChange = (value) => {
    setSelectedOption(value);
    let sorted = [...sortedSubscriptions];

    switch (value) {
      case 'option1':
        sorted.sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'option2':
        sorted.sort((a, b) => b.username.localeCompare(a.username));
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
            <h4>Your subscriptions</h4>
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
            <div className="col-lg-6 col-md-6 col-sm-12 col-12 p-2" key={item.id}>
              <PopularChannelCard
                popularChannels={item}
                page="subscription"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;