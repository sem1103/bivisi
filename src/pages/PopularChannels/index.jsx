import React, { useEffect, useState, useContext } from 'react';
import './style.scss';
import PopularChannelCard from '../../components/PChannel';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
import { Select } from 'antd';
import { AuthContext } from '../../context/authContext';
import starOutline from "../../layout/Sidebar/icons/star-outline.svg";
import SortChannel from '../../components/SortChannel';
import { useInView } from 'react-intersection-observer';


const PopularChannels = () => {
    const { ref, inView } = useInView({
        threshold: 0.5,      // Триггер срабатывает, когда 10% элемента видны
    });
    const [sortedChannels, setSortedChannels] = useState([]);
    const { user } = useContext(AuthContext);

    const [chanellsPaginCount, setChanellsPaginCount] = useState(0);
    const [chanellsCount, setChanellsCount] = useState(0);

    const fetchPChannels = async (offset) => {
        try {
            const response = await axios.get(`${BASE_URL}/user/popular-channels/?offset=${offset}`);
            const filteredChannels = response?.data?.results.filter(channel => channel?.username !== user?.username);
            setSortedChannels(sortedChannels.length ? prevChannels => [...prevChannels, ...filteredChannels] : filteredChannels);
            
            setChanellsCount(response.data.count)
            
        } catch (error) {
            console.error('Failed to fetch popular channels:', error);
        }
    };
    console.log(sortedChannels);
    

    useEffect(() => {
       
        fetchPChannels(0);
    }, [user]);


    const onScrollEnd = () => {
        setChanellsPaginCount(prevCount => {
            const newCount = sortedChannels.length != chanellsCount && prevCount + 1;
            sortedChannels.length != chanellsCount && fetchPChannels(newCount * 12);
            return newCount;
        });

    }
    useEffect(() => {
        if (inView) {
            console.log(1);
            
            onScrollEnd();
        }
    }, [inView]);
  

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

                {
                   sortedChannels.length != chanellsCount &&
                    <div className="loading" ref={ref}>
                    <div className="wrapper" >
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="circle"></div>
                        <div className="shadow"></div>
                        <div className="shadow"></div>
                        <div className="shadow"></div>
                    </div>
                </div>
                }
            </div>
        </div>
    );
}

export default PopularChannels;
