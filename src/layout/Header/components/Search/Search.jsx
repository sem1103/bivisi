import React, { useContext, useEffect, useRef, useState } from 'react';
import search from "../../../../assets/icons/search.svg";
import microphone from "../../../../assets/icons/microphone.svg";
import { ProductContext } from '../../../../context/ProductContext';
import { MdOutlineClose } from "react-icons/md";
import './style.scss'
import { NavLink } from 'react-router-dom';
const Search = ({ setIsUploadOptionsVisible, setIsNotificationOptionsVisible }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [listening, setListening] = useState(false);
  const [product, setProduct] = useState([]);
  const { product: allProducts } = useContext(ProductContext);
  const searchRef = useRef(null);
  const searchModalRef = useRef(null);

  const handleFilter = (value) => {
    setInputValue(value);
    if (allProducts.results) {
      if (value) {
        setIsSearching(true);
        const res = allProducts.results.filter((f) =>
          f.name.toLowerCase().startsWith(value.toLowerCase())
        );
        setProduct(res);
        if (res.length === 0) {
          setProduct([]);
        }
      } else {
        setProduct([]);
        setIsSearching(false);
      }
    }
  };
  const handleBlur = () => {
    if (!inputValue) {
      setProduct([]);
      setIsSearching(false);
    }
  };
  const handleProductClick = () => {
    setProduct([]);
    setIsSearching(false);
    setInputValue("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".search_data")
      ) {
        setProduct([]);
        setIsSearching(false);
      }
      if (
        event.target.closest(".upload-options") === null &&
        event.target.closest(".upload") === null
      ) {
        setIsUploadOptionsVisible(false);
      }
      if (
        event.target.closest(".notification-options") === null &&
        event.target.closest(".notification") === null
      ) {
        setIsNotificationOptionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchModalRef.current && !searchModalRef.current.contains(e.target)) {
        setListening(false)

      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  })
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-EN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleFilter(transcript)
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };
  return (

    <>
      <div className="search-wrapper" ref={searchRef}>
        <div className="search">
          <div className="d-flex align-items-center gap-3 search_content">
            <svg className="search_img" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Icon/Search" clipPath="url(#clip0_282_2108)">
                <path id="Vector" d="M15.9468 14.8863C15.6539 14.5934 15.1791 14.5934 14.8862 14.8863C14.5933 15.1792 14.5933 15.6541 14.8862 15.947L15.9468 14.8863ZM17.8028 18.8636C18.0957 19.1565 18.5706 19.1565 18.8635 18.8636C19.1564 18.5707 19.1564 18.0959 18.8635 17.803L17.8028 18.8636ZM18.2498 9.58329C18.2498 4.79682 14.3696 0.916626 9.58317 0.916626V2.41663C13.5412 2.41663 16.7498 5.62525 16.7498 9.58329H18.2498ZM9.58317 0.916626C4.7967 0.916626 0.916504 4.79682 0.916504 9.58329H2.4165C2.4165 5.62525 5.62513 2.41663 9.58317 2.41663V0.916626ZM0.916504 9.58329C0.916504 14.3698 4.7967 18.25 9.58317 18.25V16.75C5.62513 16.75 2.4165 13.5413 2.4165 9.58329H0.916504ZM9.58317 18.25C14.3696 18.25 18.2498 14.3698 18.2498 9.58329H16.7498C16.7498 13.5413 13.5412 16.75 9.58317 16.75V18.25ZM14.8862 15.947L17.8028 18.8636L18.8635 17.803L15.9468 14.8863L14.8862 15.947Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_282_2108">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <input
              type="text"
              placeholder="Search for videos"
              value={inputValue}
              onChange={(e) => handleFilter(e.target.value)}
              onBlur={handleBlur}
            />
            <button className="microphone" onClick={handleVoiceInput}>
              {/* <img src={microphone} alt="microphone" /> */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon/Microphone/Outline">
                  <path id="Vector" d="M15.8332 9.16663V9.99996C15.8332 13.2216 13.2215 15.8333 9.99984 15.8333M4.1665 9.16663V9.99996C4.1665 13.2216 6.77818 15.8333 9.99984 15.8333M9.99984 15.8333V18.3333M9.99984 18.3333H12.4998M9.99984 18.3333H7.49984M9.99984 13.3333C8.15889 13.3333 6.6665 11.8409 6.6665 9.99996V4.99996C6.6665 3.15901 8.15889 1.66663 9.99984 1.66663C11.8408 1.66663 13.3332 3.15901 13.3332 4.99996V9.99996C13.3332 11.8409 11.8408 13.3333 9.99984 13.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                </g>
              </svg>

            </button>
          </div>
        </div>
        {isSearching && inputValue && (
          <div className="search_result mt-2">
            <div className="search_result_content p-3">
              {product.length === 0 ? (
                <div className="p-3 not_found_result">
                  Product not found!
                </div>
              ) : (
                product.map((d, i) => (
                  <div className="mb-1" key={i}>
                    <NavLink
                      to={`/product_detail/${d.id}`}
                      className="mb-0 search_data"
                      activeclassname="active"
                      onClick={handleProductClick}
                    >
                      {d.name}
                    </NavLink>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


      </div>
      {listening &&
        <div className='listening-modal' ref={searchModalRef}>
          <div className='d-flex justiy-content-between'>
            <div className='modal-title'>Listening...</div>
            <MdOutlineClose className='close' onClick={() => setListening(false)} />
          </div>
          <button className={`modal-microphone ${listening ? 'listening' : ''}`} onClick={handleVoiceInput}>
            {/* <img src={microphone} alt="microphone" /> */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Icon/Microphone/Outline">
                <path id="Vector" d="M15.8332 9.16663V9.99996C15.8332 13.2216 13.2215 15.8333 9.99984 15.8333M4.1665 9.16663V9.99996C4.1665 13.2216 6.77818 15.8333 9.99984 15.8333M9.99984 15.8333V18.3333M9.99984 18.3333H12.4998M9.99984 18.3333H7.49984M9.99984 13.3333C8.15889 13.3333 6.6665 11.8409 6.6665 9.99996V4.99996C6.6665 3.15901 8.15889 1.66663 9.99984 1.66663C11.8408 1.66663 13.3332 3.15901 13.3332 4.99996V9.99996C13.3332 11.8409 11.8408 13.3333 9.99984 13.3333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
              </g>
            </svg>

          </button>
        </div>}
    </>
  );
};


export default Search;
