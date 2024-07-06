import React, { useContext, useEffect, useState, useRef } from "react";
import "./style.scss";
import { Link, NavLink, useLocation } from "react-router-dom";
import search from "../../assets/icons/search.svg";
import microphone from "../../assets/icons/microphone.svg";
import upload from "../../assets/icons/upload.svg";
import logo from "../../assets/images/logoLight.svg";
import Notification from "../../assets/icons/On.svg";
import Chat from "../../assets/icons/Outline.svg";
import Bag2 from "../../assets/icons/Bag2.svg";
import Ntf from "../../assets/icons/ntf.svg";
import ProfileMenu from "../../components/ProfileMenu";
import login from "../../assets/icons/login.svg";
import { AuthContext } from "../../context/authContext";
import { ProductContext } from "../../context/ProductContext";
import shortsOutline from "../Sidebar/icons/shorts-outline.svg";
import videoOutline from "../Sidebar/icons/video-outline.svg";
import rightIcon from "../../assets/images/rightIcon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";
import burgermenu from "../../assets/images/burger-menu.svg";
import filter from "../../assets/images/Filter.svg";
import close from "../../assets/icons/close.svg";
import cameraOutline from "../../layout/Sidebar/icons/camera-outline.svg";
import helpOutline from "../../layout/Sidebar/icons/help-outline.svg";
import home from "../../layout/Sidebar/icons/home.svg";
import starOutline from "../../layout/Sidebar/icons/star-outline.svg";
import liveStreemIcon from "../../layout/Sidebar/icons/live-streem.svg";
import trendOutline from "../../layout/Sidebar/icons/trend-outline.svg";
import historyOutline from "../../layout/Sidebar/icons/history-outline.svg";
import userOutline from "../../layout/Sidebar/icons/userOutline.svg";
import subscribeOutline from "../../layout/Sidebar/icons/subscribeOutline.svg";
import boardOutline from "../../layout/Sidebar/icons/board_outline.svg";
import { useCart } from "react-use-cart";
import { AiOutlineClose } from "react-icons/ai";
import sm_user from '../../assets/icons/sm-user.svg'


const Header = ({ isOpen }) => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState([]);
  const { product: allProducts } = useContext(ProductContext);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const [isUploadOptionsVisible, setIsUploadOptionsVisible] = useState(false);
  const [isNotificationOptionsVisible, setIsNotificationOptionsVisible] =
    useState(false);

  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const { totalUniqueItems, totalItems } = useCart();
  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

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

  const logoOpacity = isOpen ? 0 : 1;

  const toggleUploadOptions = () => {
    setIsUploadOptionsVisible(!isUploadOptionsVisible);
  };

  const toggleNotificationOptions = () => {
    setIsNotificationOptionsVisible(!isNotificationOptionsVisible);
  };

  const handleOptionClick = () => {
    setIsUploadOptionsVisible(false);
  };

  const menuItem = [
    {
      path: "/",
      name: "Home",
      icon: home,
      iconActive: videoOutline,
    },
    {
      path: "/shorts",
      name: "Shorts",
      icon: shortsOutline,
      iconActive: videoOutline,
    },
  ];

  const menuItem2 = [
    {
      path: "/latest_videos",
      name: "Latest videos",
      icon: cameraOutline,
    },
    {
      path: "/trending",
      name: "Trending",
      icon: trendOutline,
    },
    {
      path: "/top_videos",
      name: "Top videos",
      icon: videoOutline,
    },

    {
      path: "/all_channels",
      name: "All Channels",
      icon: boardOutline,
    },
    {
      path: "/popular_channels",
      name: "Popular Channels",
      icon: starOutline,
    },
    {
      path: "/live-streams",
      name: "Live",
      icon: liveStreemIcon,
    },
  ];

  const authItems = [
    {
      path: "/your_profile/my_videos",
      name: "Your profile",
      icon: userOutline,
    },
    {
      path: "/history",
      name: "History",
      icon: historyOutline,
    },
    {
      path: "/your_profile/subscriptions",
      name: "Your subscriptions",
      icon: subscribeOutline,
    },
  ];

  if (
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/reset_password" &&
    location.pathname !== "/404" &&
    location.pathname !== "/user/verify-otp"
  ) {
    return (
      <div>
        <div className="d-none d-lg-block d-xl-block d-lg-block container-fluid xl_header top__header">
          <header className="sticky-top ">
            <Link className="logoLeft " to="/" style={{ opacity: logoOpacity }}>
              <img src={logo} alt="" />
            </Link>

            <div className="d-flex align-items-center gap-2">
            <div className="d-flex justify-content-center align-items-center gap-3">
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
                  </div>
                  {inputValue && (
                    <img
                      src={close}
                      alt=""
                      className="close_btn"
                      onClick={() => setInputValue("")}
                    />
                  )}
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
              <div className="microphone">
                <img src={microphone} alt="" />
              </div>
            </div>
            {user ? (
              <div className="content_left d-flex align-items-center justify-content-end gap-3">

                <div className="content_left_icons">
                <div className="upload-container">
                  <div className="upload " onClick={toggleUploadOptions}>
                    <img src={upload} alt="" />
                  </div>
                  {isUploadOptionsVisible && (
                    <div className="upload-options">
                      <Link
                        to="/your_profile/upload_video"
                        onClick={handleOptionClick}
                      >
                        <img src={videoOutline} alt="" className="me-2" />
                        Video
                      </Link>
                      <Link
                        to="/your_profile/upload_shorts"
                        onClick={handleOptionClick}
                      >
                        <img src={shortsOutline} alt="" className="me-2" />
                        Shorts
                      </Link>
                    </div>
                  )}
                </div>
                  <NavLink
                    className="upload"
                    to="/basket"
                    activeclassname="active"
                  >
                    <img src={Bag2} alt="" />

                    <span className="basket_items_count">{totalUniqueItems}</span>
                  </NavLink>
                  <div
                    className="upload ntf"
                    onClick={toggleNotificationOptions}
                  >
                    <img src={Notification} alt="" />
                    {isNotificationOptionsVisible && (
                      <div className="notification-options">
                        <h1>Notifications</h1>
                        <div className="ntf_content">
                          <img src={Ntf} alt="" />
                        </div>
                      </div>
                    )}
                  </div>

                  <NavLink
                    className="upload"
                    to="/chat"
                    activeclassname="active"
                  >
                    <img src={Chat} alt="" />
                  </NavLink>
                  <ProfileMenu />
                </div>
              </div>
            ) : (
              <div className="content_left d-flex align-items-center justify-content-end gap-3">
                <NavLink to="/login" className="login-btn">
                  <img src={login} alt="" />
                  Login
                </NavLink>
              </div>
            )}
            </div>
          </header>
        </div>

        <div className="d-block d-xl-none d-xxl-none d-lg-none pt-2">
          <div className="sm_header container-fluid">
            <div className="d-flex align-items-center justify-content-between ">
              <div className={`top_section mb-3 ${openMenu ? "open" : ""}`}>
                <div className="d-flex align-items-center gap-3">
                  <button onClick={toggleMenu} className="toggle-button">
                    {openMenu ? (
                      <img src={burgermenu} alt="" className="bars" />
                    ) : (
                      <img src={burgermenu} alt="" className="bars" />
                    )}
                  </button>
                  <Link to="/">
                    <img src={logo} alt="" className="logo" />
                  </Link>
                </div>
                <div className="offcanvas-menu">
                  <div
                    onClick={toggleMenu}
                    className="close-button d-flex justify-content-between align-items-center gap-2 mb-3"
                  >
                    <img src={logo} alt="" className="logo" />
                    {/* <img src={close} alt="" className="close_btn" /> */}
                    <AiOutlineClose className="close_btn" />
                  </div>
                  <div
                    className="menu-section"
                    style={{ marginBottom: isOpen ? "26px" : "0" }}
                  >
                    <p
                      className="menu-section-title"
                      style={{ display: isOpen ? "block" : "none" }}
                    >
                      MENU
                    </p>
                    <nav className="menu">
                      {menuItem.map((item, index) => {
                        return (
                          <NavLink
                            onClick={toggleMenu}
                            to={item.path}
                            key={index}
                            className="menu-item"
                            activeclassname="active"
                            style={{
                              justifyContent: isOpen ? "flex-start" : "center",
                            }}
                          >
                            <img src={item.icon} alt="" />
                            <span
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              {item.name}
                            </span>
                          </NavLink>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="bottom_section">
                    {user ? (
                      <div
                        className="menu-section"
                        style={{ marginBottom: isOpen ? "26px" : "0" }}
                      >
                        <p
                          className="menu-section-title"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          FOR YOU
                        </p>
                        <nav className="menu">
                          {authItems.map((item, index) => {
                            return (
                              <NavLink
                                onClick={toggleMenu}
                                to={item.path}
                                key={index}
                                className="menu-item"
                                activeclassname="active"
                                style={{
                                  justifyContent: isOpen
                                    ? "flex-start"
                                    : "center",
                                }}
                              >
                                <img src={item.icon} alt="" />
                                <span
                                  style={{ display: isOpen ? "block" : "none" }}
                                >
                                  {item.name}
                                </span>
                              </NavLink>
                            );
                          })}
                        </nav>
                      </div>
                    ) : (
                      ""
                    )}

                    <div
                      className="menu-section"
                      style={{ marginBottom: isOpen ? "26px" : "0" }}
                    >
                      <p
                        className="menu-section-title"
                        style={{ display: isOpen ? "block" : "none" }}
                      >
                        MORE VIDEOS
                      </p>
                      <nav className="menu">
                        {menuItem2.map((item, index) => {
                          return (
                            <NavLink
                              onClick={toggleMenu}
                              to={item.path}
                              key={index}
                              className="menu-item"
                              activeclassname="active"
                              style={{
                                justifyContent: isOpen
                                  ? "flex-start"
                                  : "center",
                              }}
                            >
                              <img src={item.icon} alt="" />
                              <span
                                style={{ display: isOpen ? "block" : "none" }}
                              >
                                {item.name}
                              </span>
                            </NavLink>
                          );
                        })}
                      </nav>
                    </div>

                    {isOpen ? (
                      <div
                        className="menu-section"
                        style={{ marginBottom: isOpen ? "26px" : "0" }}
                      >
                        <p className="menu-section-title">EXPLORE MORE</p>
                        <nav className="menu">
                          <NavLink
                            onClick={toggleMenu}
                            to="/help"
                            className="menu-item"
                            activeclassname="active"
                            style={{
                              justifyContent: isOpen ? "flex-start" : "center",
                            }}
                          >
                            <img src={helpOutline} alt="" />
                            <span
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              Help
                            </span>
                          </NavLink>
                        </nav>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {isOpen ? (
                    <footer className="footer">
                      <div className="link-column">
                        <a href="/refund-policy">Refund Policy</a>
                        <NavLink onClick={toggleMenu} to="/faq">FAQs</NavLink>
                      </div>
                      <div className="link-column">
                        <a href="/about">Terms of use</a>
                        <a href="/developers">Privacy Policy</a>
                      </div>

                      <div className="link-column">
                        <a href="/faqs">About us</a>
                        <a href="/privacy">Contact us</a>
                      </div>
                      <div className="link-column">
                        <a href="/contact">Developers</a>
                        <a href="/languages">Developers</a>
                      </div>
                      <div className="footer-copy">
                        <p>
                          Copyright © 2024 Bivisi.live. <br />
                          All rights reserved.
                        </p>
                      </div>
                    </footer>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="burger_menu d-flex align-content-center gap-2">
                {
                  user ? (
                    <div className="d-flex align-items-center gap-2">

                      <div className="upload-container">
                        <div className="upload " onClick={toggleUploadOptions}>
                          <img src={upload} alt="" />
                        </div>
                        {isUploadOptionsVisible && (
                          <div className="upload-options mt-2">
                            <Link
                              to="/your_profile/upload_video"
                              onClick={handleOptionClick}
                            >
                              <img src={videoOutline} alt="" className="me-2" />
                              Video
                            </Link>
                            <Link
                              to="/your_profile/upload_shorts"
                              onClick={handleOptionClick}
                            >
                              <img src={shortsOutline} alt="" className="me-2" />
                              Shorts
                            </Link>
                          </div>
                        )}
                      </div>
                      <button className="sm_ntf">
                        <img src={Notification} alt="" />
                      </button>
                      <NavLink
                    className="upload"
                    to="/chat"
                    activeclassname="active"
                  >
                    <img src={Chat} alt="" />
                  </NavLink>
                      <ProfileMenu />

                    </div>
                  ) : (
                    <NavLink to="/login" className=" sm_login ">
                      <img src={login} alt="" />
                      Login
                    </NavLink>
                  )
                }
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center gap-3 my-2 search__bar">
              <div className="search-wrapper" ref={searchRef}>
                <div className="search">
                  <div className="d-flex align-items-center gap-2 search_content">
                    <img src={search} alt="" />
                    <input
                      type="text"
                      placeholder="Search for videos"
                      value={inputValue}
                      onChange={(e) => handleFilter(e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                  {inputValue && (
                    // <IoMdClose className="close_btn" onClick={() => setInputValue('')} />
                    // <p className="close_btn" onClick={() => setInputValue('')}>x</p>
                    <img
                      src={close}
                      alt=""
                      className="close_btn"
                      onClick={() => setInputValue("")}
                    />
                  )}
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
              <div className="d-flex gap-2">
                <div className="microphone">
                  <img src={microphone} alt="" />
                </div>

                <div className="filter">
                  <img src={filter} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Header;
