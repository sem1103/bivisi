import React, { useEffect, useState, useContext } from 'react';
import './style.scss';
import PopularChannelCard from '../../components/PChannel';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
import { Select } from 'antd';
import { AuthContext } from '../../context/authContext';
import starOutline from "../../layout/Sidebar/icons/star-outline.svg";
import SortChannel from '../../components/SortChannel';


const PopularChannels = () => {
    const { Option } = Select;
    const [popularC, setPopularC] = useState([]);
    const [sortedChannels, setSortedChannels] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPChannels = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/popular-channels/`);
                const filteredChannels = response?.data?.results.filter(channel => channel?.username !== user?.username);
                setPopularC(filteredChannels);
                setSortedChannels(filteredChannels);
            } catch (error) {
                console.error('Failed to fetch popular channels:', error);
            }
        };
        fetchPChannels();
    }, [user]);



  

    return (
        <div className='popular_channels_page'>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-between align-items-start pt-4">
                        <div className='d-flex align-items-center gap-2'>
                            <img width={27} src={starOutline} alt="" />
                            <h4 className='mt-2'>Popular channels</h4>
                        </div>
                        <div className="custom-select">
                      <SortChannel sortedChannels={sortedChannels} setSortedChannels={setSortedChannels} />
                      
                        </div>
                    </div>
                    {sortedChannels?.map((item) => (
                        <PopularChannelCard key={item.id} popularChannels={item} page="channelcard" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PopularChannels;
