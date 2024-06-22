import React, { useState, useContext, useRef, useEffect } from "react";
import "./style.scss";
import plus from "../../assets/icons/Plus.svg";
import ShortsPCrd from "../../components/ShortsPCard";
import { ProductContext } from "../../context/ProductContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide , } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';



const Shorts = () => {
  const { product } = useContext(ProductContext);

  const videoProducts =
    product?.results?.filter(
      (item) => item.product_video_type[0]?.product_type === "Shorts"
    ) || [];


  const [activeVideo, setActiveVideo] = useState(0);
  const [activeShortId, setActiveShortId] = useState(localStorage.activeShort != undefined ? localStorage.activeShort :  videoProducts[Math.floor(Math.random() * videoProducts.length)]?.id);
  const [toTop, setToTop] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState(-1); // State to track highlighted card
  const slideRefs = useRef([]);

  const sliderRef = useRef(null);
  const swiperRef = useRef(null);
  const { user } = useContext(AuthContext);

  
    
    useEffect(() => {
      window.onscroll = () => {
        if(Math.trunc(sliderRef.current.getBoundingClientRect().top) <= 0) setToTop(false);
          else if(Math.trunc(sliderRef.current.getBoundingClientRect().top) > 0) setToTop(true);
      }

    
       if(sliderRef.current != null){
        sliderRef?.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        if(Math.trunc(sliderRef.current.getBoundingClientRect().top) <= 0) setToTop(false);
          else if(Math.trunc(sliderRef.current.getBoundingClientRect().top) > 0) setToTop(true);
       }
     
       

      
    },[sliderRef.current]);

    useEffect(() => {
      if(swiperRef.current != null) {
        let index = 0;
        videoProducts.forEach((item, ind) => {
          if(item.id == activeShortId) index = ind
        })
        let newVideoArray = videoProducts.splice(index, 1)[0];
        videoProducts = [].concat(newVideoArray,videoProducts )
       
        swiperRef.current.swiper.slideTo(index);
        localStorage.removeItem('activeShort')
      }
    }, [swiperRef.current])

  useEffect(() => {
    const highlightedShortId = localStorage.getItem("highlightedShort");
    if (highlightedShortId && videoProducts.length > 0) {
      const highlightedIndex = videoProducts.findIndex(
        (item) => item.id === parseInt(highlightedShortId)
      );
      if (highlightedIndex !== -1) {
        setCurrentSlide(highlightedIndex);
        setHighlightedCardIndex(highlightedIndex); // Highlight the card
        setTimeout(() => {
          slideRefs.current[highlightedIndex]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 0);
        localStorage.removeItem("highlightedShort");
      }
    }
  }, [videoProducts]);

  const totalSlides = videoProducts.length;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => {
        const newSlide = prev + 1;
        slideRefs.current[newSlide]?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        setHighlightedCardIndex(newSlide); // Highlight the card
        return newSlide;
      });
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => {
        const newSlide = prev - 1;
        slideRefs.current[newSlide]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setHighlightedCardIndex(newSlide); // Highlight the card
        return newSlide;
      });
    }
  };

  if (videoProducts.length === 0) {
    return null;
  }

  const handleCreateClick = () => {
    if (!user) {
      toast.warning("Please, sign in");
    } else {
      window.location.href = "/your_profile/upload_shorts";
    }
  };


  const handleSlideChange = (swipper) => {
    setActiveVideo(swipper)
  }

  const toTopAndShortHandler = () => {

    if( Math.trunc(sliderRef.current.getBoundingClientRect().top) > 0 ){
      sliderRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    } else{
      window.scrollTo(0, 0)
    }
    setToTop(!toTop);

  }

  const handleEnter = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.disable();
      console.log('enter');
    }
  };

  const handleLeave = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.enable();
      console.log('leave');
    }
  };




  return (
    <div className="shorts_page">
      <div className="container-fluid shorts_page_content">
        <div className="row ">
          <div className="col-lg-12 d-flex justify-content-between align-items-start pt-4">
            <h1>BiviClips</h1>
            <button className="create_btn" onClick={handleCreateClick}>
              <img src={plus} alt="plus.svg" />
              Create
            </button>
          </div>
          <div className="text-center pt-5" style={{ overflow: "hidden" }}>

            <div className="slider" ref={sliderRef}>
               <Swiper 
               ref={swiperRef}
               direction={'vertical'}
              mousewheel = {true}
              modules={[Mousewheel]}
              spaceBetween={50}
              onSlideChange={(swipper) => handleSlideChange(swipper.activeIndex)}

               >

                 <button  className={`back__top ${toTop ? 'toVideo' : ''}`} onClick={toTopAndShortHandler}>
                 <svg fill="#fff" width={28} viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165ZM116.5,57.5a9.67,9.67,0,0,0-14,0L74,86a19.92,19.92,0,0,0,0,28.5L102.5,143a9.9,9.9,0,0,0,14-14l-28-29L117,71.5C120.5,68,120.5,61.5,116.5,57.5Z"></path></g></svg>
                </button>
             
                  {

                    videoProducts.map((item, index) => {
                      return <SwiperSlide>
                      <div
                      key={item.id}
                      className={`slide ${
                        highlightedCardIndex === index ? "highlighted" : ""
                      }`} // Apply highlighted class
                      ref={(el) => (slideRefs.current[index] = el)}
                    >
                      <ShortsPCrd
                      handleEnter={handleEnter}
                      handleLeave={handleLeave}
                        productItemShort={item}
                        isPlaying={activeVideo == index}
                        setPlaying={(id) => setCurrentlyPlaying(id)}
                      />
                    </div>
                    </SwiperSlide>
                    }
                    )
                  }
            </Swiper>
               
            </div>
          </div>
        </div>
        <div className="slider_pn">
          <div
            className={`prev ${currentSlide === 0 ? "disabled" : ""}`}
            onClick={goToPrevSlide}
          >
            <FaArrowUp />
          </div>
          <div
            className={`next ${
              currentSlide === totalSlides - 1 ? "disabled" : ""
            }`}
            onClick={goToNextSlide}
          >
            <FaArrowDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shorts;
