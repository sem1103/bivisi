import React, { useEffect, useState, useContext } from 'react';
import './style.scss';
import sort from '../../assets/icons/Sort.svg';
import PopularChannelCard from '../../components/PChannel';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
import { Select } from 'antd';
import { AuthContext } from '../../context/authContext';

const PopularChannels = () => {
    const { Option } = Select;
    const [popularC, setPopularC] = useState([]);
    const [sortedChannels, setSortedChannels] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPChannels = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/popular-channels/`);
                console.log("popular c ", response?.data);
                const filteredChannels = response?.data?.filter(channel => channel?.username !== user?.username);
                setPopularC(filteredChannels);
                setSortedChannels(filteredChannels); 
            } catch (error) {
                console.error('Failed to fetch popular channels:', error);
            }
        };
        fetchPChannels();
    }, [user]);

    

    const handleSortChange = (value) => {
        let sorted = [...popularC];
        if (value === "option1") {
            sorted?.sort((a, b) => a.username.localeCompare(b.username));
        } else if (value === "option2") {
            sorted?.sort((a, b) => b.username.localeCompare(a.username));
        } else {
            sorted = [...popularC];
        }
        setSortedChannels(sorted);
    };

    return (
        <div className='popular_channels_page'>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-between align-items-start pt-4">
                        <h1>Popular channels</h1>
                        <div className="custom-select">
                            <Select
                                defaultValue=""
                                suffixIcon={null}
                                className="select"
                                popupClassName="custom-dropdown"
                                prefixicon={<img src={sort} alt="sort icon" width={20} />}
                                onChange={handleSortChange} // Sort funksiyasını tetikleyen metod
                            >
                                <Option value="">All</Option>
                                <Option value="option1">A to Z</Option>
                                <Option value="option2">Z to A</Option>
                            </Select>
                        </div>
                    </div>
                    {sortedChannels?.map((item) => (
                        <PopularChannelCard key={item.id} popularChannels={item} page="channelcard"/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PopularChannels;
