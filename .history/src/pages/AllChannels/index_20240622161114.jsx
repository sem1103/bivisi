import React, { useContext, useEffect, useState } from 'react';
import './style.scss';
import { Select } from 'antd';
import PopularChannelCard from '../../components/PChannel';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
import { AuthContext } from '../../context/authContext';

const AllChannels = () => {
    const { Option } = Select;
    const [popularAllC, setPopularAllC] = useState([]);
    const [sortedChannels, setSortedChannels] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPChannels = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/subscriptions/`);
                const filteredChannels = response.data.results.filter(channel => channel.username !== user?.username);
                console.log(response.data.results);
                setPopularAllC(filteredChannels);
                setSortedChannels(filteredChannels); 
            } catch (error) {
                console.error('Failed to fetch popular channels:', error);
            }
        };
        fetchPChannels();
    }, [user]);

    const handleSortChange = (value) => {
        let sorted;
        if (value === "option1") {
            sorted = [...popularAllC].sort((a, b) => a.username.localeCompare(b.username));
        } else if (value === "option2") {
            sorted = [...popularAllC].sort((a, b) => b.username.localeCompare(a.username));
        } else {
            sorted = [...popularAllC];
        }
        setSortedChannels(sorted);
    };
console.log(sortedChannels);
    return (
        <div className='all_channels_page'>
            <div className="container-fluid">
                <div className="row">
                    <div className='col-lg-12 d-flex justify-content-between align-items-start pt-4'>
                        <h1>All channels</h1>
                        <div className="custom-select">
                            <Select
                                defaultValue=""
                                suffixIcon={null}
                                className="select"
                                popupClassName="custom-dropdown"
                                onChange={handleSortChange} 
                            >
                                <Option value="">All</Option>
                                <Option value="option1">A to Z</Option>
                                <Option value="option2">Z to A</Option>
                            </Select>
                        </div>
                    </div>

                    {sortedChannels.map((item) => (
                        <PopularChannelCard key={item.id} popularChannels={item} page="channelcard"/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllChannels;
