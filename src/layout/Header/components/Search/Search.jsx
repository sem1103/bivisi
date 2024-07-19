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
            <img src={search} className="search_img" alt="" />
            <input
              type="text"
              placeholder="Search for videos"
              value={inputValue}
              onChange={(e) => handleFilter(e.target.value)}
              onBlur={handleBlur}
            />
            <button className="microphone" onClick={handleVoiceInput}>
              <img src={microphone} alt="microphone" />
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
            <img src={microphone} alt="microphone" />
          </button>
        </div>}
    </>
  );
};


export default Search;
