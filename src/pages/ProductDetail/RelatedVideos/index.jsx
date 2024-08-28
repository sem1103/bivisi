import React, { useContext, useEffect, useState } from "react";
import { ProductContext } from "../../../context/ProductContext";
import LastVideoCard from "../../../components/VideoCard";
import "./style.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useParams } from "react-router-dom";
const Related_Videos = ({ onProductClick, category }) => {
  const { product } = useContext(ProductContext);
  const {id} = useParams()
  const [sortedProducts, setSortedProducts] = useState([])

  useEffect(() => {
    if(product){
      setSortedProducts(product?.results?.filter((item) => {        
        if(item.id != +id && item.category[0] == category)
        return item
      }))
    }
    
  }, [product, id]);


  
  return (
    <>
      <section className="related_videos">
          <div >
            <div className="col-lg-12">
              <div className="title">Related videos</div>
            </div>
              {
                sortedProducts?.length > 0 ?

                <>
                <div className="related__items">
           
           {sortedProducts.map((item) => {
           
               
                return <LastVideoCard
                 ProductItemVideoCard={item}
               />
            
           })}
           </div>

           <div className="videos__slider">
           <Swiper
            grabCursor={true}
            slidesPerView={3}
            spaceBetween={10}
            loop={true}

            breakpoints={{
              0: {
                spaceBetween: 5,
                slidesPerView: 1,

              },
              480: {
                spaceBetween: 1,
                slidesPerView: 2,
              },
              768: {
                spaceBetween: 15,
                slidesPerView: 3,
              },

              912: {
                spaceBetween: 15,
                slidesPerView: 3,
              },
              1280: {
                spaceBetween: 5,
                slidesPerView: 4,
                
              },
            }}
           >
          
           {sortedProducts.map((item) => {
            
             return (
               
                <SwiperSlide>
                  <LastVideoCard
                 ProductItemVideoCard={item}
               />
                </SwiperSlide>
             );
           })}
        

           </Swiper>
           </div>
                </>
                :
                <h4 className="empty__related">
                  No similar videos found...
                </h4>
              }
          

           
          </div>
      </section>
    </>
  );
};

export default Related_Videos;
