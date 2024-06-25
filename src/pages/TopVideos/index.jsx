import React, { useContext, useEffect } from 'react';
import './style.scss';
import sort from '../../assets/icons/Sort.svg'
import LastVideoCard from '../../components/VideoCard';
import { ProductContext } from '../../context/ProductContext';
import axios from 'axios';
import useAxios from '../../utils/useAxios';

const TopVideos = () => {
    const { product } = useContext(ProductContext);
    const axiosInstance = useAxios();

    if (!product || !Array.isArray(product.results) || product.results.length === 0) {
      return null;
    }

  
    const videoProducts = product.results.filter(
      (item) => item.product_video_type[0]?.product_type === "Video"
    );
    console.log(videoProducts);

    const addPremiumVideoHandler = async (id) => {
        let res = await axiosInstance.put('/update_premium_products/', {product_ids : [id]});
        if(res.status == 201){
            console.log('good');
        }
    }

    return (
        <div className='top_page_videos'>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 d-flex justify-content-between align-items-center py-4">
                        <h1>Top videos</h1>
                        <button className='sort_btn'>
                            <img src={sort} alt="plus.svg" />
                            Sort by
                        </button>

                        <button onClick={() => {
                            addPremiumVideoHandler(105)
                        }}>
                            +
                        </button>
                    </div>
                    {
                        videoProducts?.map((item)=>(

                            <LastVideoCard ProductItemVideoCard={item} key={item.id} page="topvideo"/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default TopVideos