
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
import subscribeOutline from "../../layout/Sidebar/icons/subscribeOutline.svg"
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

//         sorted.sort((a, b) => a.follows.username.localeCompare(b.follows.username));
//         break;
//       case 'option2':
//         sorted.sort((a, b) => b.follows.username.localeCompare(a.follows.username));

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
            <div className="d-flex align-items-center gap-2">
              <img width={27} src={subscribeOutline} alt="" />
              <h4 className="mt-1">Your subscriptions</h4>
            </div>
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