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
  const copyProducts = product?.results?.filter((item) => {
    if(item.product_video_type[0]?.product_type === "Shorts") return item
  }) || []
  const [activeShortId, setActiveShortId]  = useState(localStorage.activeShort != undefined ? localStorage.activeShort :  copyProducts[Math.floor(Math.random() * copyProducts.length)]?.id);

  
  let videoProducts = product?.results?.filter((item) => {
    if(item.product_video_type[0]?.product_type === "Shorts") return item
  }).sort((a, b) => a.id == activeShortId ? -1 : b.id == activeShortId ? 1 : 0) || [];



  const [shorts, setShorts] = useState([])

  const [activeVideo, setActiveVideo] = useState(0);
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
     
       
       localStorage.removeItem('activeShort')
      
    },[sliderRef.current]);

    // useEffect(() => {
    

    //   let copyArray = [...videoProducts];
    //   let index = 0;
    //     videoProducts.forEach((item, ind) => {
    //       if(item.id == activeShortId) index = ind
    //     })
    //     copyArray.unshift(copyArray.splice(index, 1)[0])
        
    //   //  localStorage.removeItem('activeShort')   
    // }, [product])

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
    }
  };

  const handleLeave = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.enable();
    }
  };




  return (
    <div className="shorts_page">
      <div className="container-fluid shorts_page_content">
        <div className="row ">
          <div className="col-lg-12 d-flex justify-content-between align-items-start pt-4">
            <div className="page__title">
            <svg
            width={45}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 168.071 168.071"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path
          style={{ fill: '#04ABF2' }}
          d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z"
        />
        <g id="XMLID_15_">
          <g>
            <path
              style={{ fill: 'currentColor' }}
              d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z"
            />
            <path
              style={{ fill: 'currentColor' }}
              d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
            <h1>BiviClips</h1>
            </div>
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
