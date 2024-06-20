import React, { useContext } from 'react';
import './style.scss';
import sort from '../../assets/icons/Sort.svg'
import LastVideoCard from '../../components/VideoCard';
import { ProductContext } from '../../context/ProductContext';

const TopVideos = () => {
    const { product } = useContext(ProductContext);

    if (!product || !Array.isArray(product.results) || product.results.length === 0) {
      return null;
    }
  
    const videoProducts = product.results.filter(
      (item) => item.product_video_type[0]?.product_type === "Video"
    );


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