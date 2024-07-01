import React, { useContext, useEffect, useState } from 'react';
import './style.scss';
import sort from '../../assets/icons/Sort.svg'
import LastVideoCard from "../../components/VideoCard";
import { ProductContext } from '../../context/ProductContext';
import { Select } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../api/baseUrl';
const Trending = () => {
    const [trendVideo, setTrendVideo] = useState([]);

    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const response = await axios.get(`${BASE_URL}/web_trending_videos/`);
                setTrendVideo(response.data.results)
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }
        fetchData();
    },[])

    const videoProducts = trendVideo.filter(
        (item) => item.product_video_type[0]?.product_type === "Video"
    );


    const [selectedOption, setSelectedOption] = useState('');


    const handleSelect = (value) => {
        setSelectedOption(value);
    };

    const handleAllClick = () => {
        setSelectedOption('');
    };
    const sortedProducts = [...videoProducts];
    if (selectedOption === 'option1') {
        sortedProducts.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (selectedOption === 'option2') {
        sortedProducts.sort((a, b) => (a.name < b.name ? 1 : -1));
    } else if (selectedOption === 'option3') {
        sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (selectedOption === 'option4') {
        sortedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return (
        <div className='trending_videos'>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-between align-items-center py-4">
                        <h4 className='heading_trend text-white' style={{fontSize:"21px", fontWeight:"400"}}>Trending</h4>
                        {/* <button className='sort_btn'>
                            <img src={sort} alt="plus.svg" />
                            Sort by
                        </button> */}

                        <div className="custom-select">

                            <Select
                                defaultValue=""
                                value={selectedOption}
                                onChange={handleSelect}
                                suffixIcon={null}
                                className="select"
                                popupClassName="custom-dropdown"
                                prefixicon={<img src={sort} alt="plus.svg" width={20} />}
                            >
                                <Option value="" onClick={handleAllClick}>All</Option>
                                <Option value="option1">A to Z</Option>
                                <Option value="option2">Z to A</Option>
                                <Option value="option3">From cheap to expensive</Option>
                                <Option value="option4">From expensive to cheap</Option>
                            </Select>
                        </div>
                    </div>
                    {
                        sortedProducts?.map((item) => (
                            <LastVideoCard ProductItemVideoCard={item} key={item.id} page="trendvideo"/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};
export default Trending;