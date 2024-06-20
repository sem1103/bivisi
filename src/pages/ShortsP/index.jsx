import React, { useState, useContext, useRef, useEffect } from "react";
import "./style.scss";
import plus from "../../assets/icons/Plus.svg";
import ShortsPCrd from "../../components/ShortsPCard";
import { ProductContext } from "../../context/ProductContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const Shorts = () => {
  const { product } = useContext(ProductContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState(-1); // State to track highlighted card
  const slideRefs = useRef([]);
  const { user } = useContext(AuthContext);

  const videoProducts =
    product?.results?.filter(
      (item) => item.product_video_type[0]?.product_type === "Shorts"
    ) || [];

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
          block: "start",
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
            <div className="slider">
              {videoProducts.map((item, index) => (
                <div
                  key={item.id}
                  className={`slide ${
                    highlightedCardIndex === index ? "highlighted" : ""
                  }`} // Apply highlighted class
                  ref={(el) => (slideRefs.current[index] = el)}
                >
                  <ShortsPCrd
                    productItemShort={item}
                    isPlaying={currentlyPlaying === item.id}
                    setPlaying={(id) => setCurrentlyPlaying(id)}
                  />
                </div>
              ))}
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
