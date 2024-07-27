import React, { useContext, useEffect, useState, useRef } from "react";
import "./style.scss";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import upload from "../../assets/icons/upload.svg";
import logo from "../../assets/images/logoLight.svg";
import Notification from "../../assets/icons/On.svg";
import Chat from "../../assets/icons/Outline.svg";
import Bag2 from "../../assets/icons/Bag2.svg";
import Ntf from "../../assets/icons/ntf.svg";
import ProfileMenu from "../../components/ProfileMenu";
import login from "../../assets/icons/login.svg";
import { AuthContext } from "../../context/authContext";
import shortsOutline from "../Sidebar/icons/shorts-outline.svg";
import videoOutline from "../Sidebar/icons/video-outline.svg";
import burgermenu from "../../assets/images/burger-menu.svg";
import filter from "../../assets/images/Filter.svg";
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
import { ChatContext } from "../../context/ChatContext";
import { Modal } from 'antd';
import callRingtone from './../../assets/images/call.mp3'
import Search from "./components/Search/Search";
import Categories from "../Categories";


const Header = ({ isOpen }) => {
  const navigate = useNavigate();
  const { isModalCallOpen, setIsModalCallOpen, callModalText, declineCall, iCall, acceptACall, isAccept, setIsAccept } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [isUploadOptionsVisible, setIsUploadOptionsVisible] = useState(false);
  const [isNotificationOptionsVisible, setIsNotificationOptionsVisible] =
    useState(false);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const ringtoneRef = useRef(new Audio(callRingtone)); // Создание рефа для аудиоэлемента

  const { totalUniqueItems, totalItems } = useCart();
  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };
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
      name: "BiviClips",
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

  useEffect(() => {
    isAccept && navigate(`/call/${localStorage.videoCallRoomId}`)

    setIsAccept(false)
  }, [isAccept])

  useEffect(() => {
    if (isModalCallOpen && sessionStorage.iCall == 'false') {
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play();
    } else {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0; // Сброс времени воспроизведения

    }

  }, [isModalCallOpen]);
  if (
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/reset_password" &&
    location.pathname !== "/404" &&
    location.pathname !== "/user/verify-otp"
  ) {
    return (
      <>
        <Modal
          open={isModalCallOpen}
          onCancel={() => {
            ringtoneRef.current.currentTime = 0; // Сброс времени воспроизведения
            ringtoneRef.current.pause();
            declineCall()
            setIsModalCallOpen(false);
          }}
          className={'modal__body chat__modal call__modal'}
          styles={{
            mask: {
              backdropFilter: 'blur(10px)',
              zIndex: '999999999999',
            }
          }}
        >
          <div className="call__modal">

            <h3>
              {callModalText}
            </h3>
            {
              <div className="call__btns">
                <button className="decline__call"
                  onClick={() => {
                    ringtoneRef.current.currentTime = 0; // Сброс времени воспроизведения
                    ringtoneRef.current.pause();
                    declineCall();
                    setIsModalCallOpen(false);

                  }}
                >
                  <svg width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000" transform="rotate(0)">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path style={{ fill: '#ce4646' }} d="M512,256.006C512,397.402,397.394,512.004,256.004,512C114.606,512.004,0,397.402,0,256.006 C-0.007,114.61,114.606,0,256.004,0C397.394,0,512,114.614,512,256.006z"></path>
                      <g>
                        <path style={{ fill: '#ba3636' }} d="M502.096,185.526c-0.347-0.349-86.499-86.511-87.031-87.03 c-16.858-17.273-40.349-28.043-66.336-28.043c-51.158,0-92.774,41.615-92.774,92.773c0,25.984,10.768,49.471,28.037,66.33 c0.526,0.538,176.222,176.234,176.755,176.755c0.468,0.482,0.943,0.955,1.424,1.423C493.473,365.273,512,312.813,512,256.005 C512,231.55,508.499,207.924,502.096,185.526z"></path>
                        <path style={{ fill: '#ba3636' }} d="M455.728,416.071c-0.438-0.449-67.636-67.735-68.214-68.214c-0.544-0.515-1.013-1.111-1.588-1.588 c-0.547-0.518-1.019-1.117-1.597-1.597c-0.544-0.515-225.558-225.652-226.141-226.135c-5.769-5.441-13.196-8.866-21.211-9.367 c-9.807-0.477-19.365,3.035-26.297,9.974L82.49,147.402c-15.659,15.69-38.331,65.957,88.983,193.535 c0.256,0.256,0.494,0.478,0.75,0.733c0.29,0.291,0.55,0.568,0.843,0.86c0.256,0.256,157.358,157.358,157.649,157.65 c0.194,0.194,0.38,0.371,0.569,0.556C380.883,485.498,424.026,455.578,455.728,416.071z"></path>
                      </g>
                      <g>
                        <path style={{ fill: '#F6F6F6' }} d="M389.664,350.645l-44.129-34.435c-12.473-9.709-29.822-9.642-42.204,0.159l-9.807,7.769 c-7.452,5.882-18.127,5.262-24.839-1.45l-78.949-79.116c-6.719-6.742-7.339-17.463-1.45-24.938l7.754-9.838 c9.777-12.389,9.838-29.762,0.159-42.242l-34.359-44.227c-6.017-7.754-15.077-12.548-24.862-13.159 c-9.807-0.476-19.365,3.035-26.297,9.973l-28.192,28.259c-15.659,15.689-38.331,65.956,88.983,193.535 c82.959,83.148,133.588,100.603,161.455,100.61h0.007c16.783,0,26.508-6.213,31.717-11.43l28.191-28.252 c6.924-6.939,10.547-16.534,9.936-26.326C402.175,365.745,397.395,356.671,389.664,350.645z M381.896,390.947l-28.191,28.252 c-3.133,3.14-9.286,6.885-20.77,6.885h-0.007c-20.415-0.007-67.119-12.487-150.508-96.065 c-96.073-96.276-107.979-152.667-88.984-171.7l28.191-28.259c3.518-3.525,8.283-5.489,13.228-5.489c0.385,0,0.77,0.007,1.163,0.03 c5.353,0.34,10.314,2.96,13.605,7.211l34.359,44.227c5.315,6.848,5.278,16.383-0.083,23.186l-7.754,9.838 c-10.736,13.62-9.603,33.145,2.642,45.428l78.949,79.123c12.261,12.276,31.77,13.409,45.382,2.65l9.814-7.769 c6.765-5.376,16.262-5.406,23.088-0.091l44.129,34.428c4.243,3.307,6.863,8.29,7.195,13.665 C387.686,381.872,385.693,387.135,381.896,390.947z"></path>
                        <path style={{ fill: '#F6F6F6' }} d="M348.729,70.453c-51.158,0-92.773,41.615-92.773,92.773S297.57,256,348.729,256 s92.773-41.615,92.773-92.773S399.887,70.453,348.729,70.453z M348.729,240.538c-42.627,0-77.311-34.685-77.311-77.311 s34.685-77.311,77.311-77.311s77.311,34.685,77.311,77.311S391.356,240.538,348.729,240.538z"></path>
                        <path style={{ fill: '#F6F6F6' }} d="M385.119,126.836c-3.02-3.02-7.913-3.02-10.932,0l-25.458,25.458l-25.458-25.458 c-3.02-3.02-7.913-3.02-10.932,0c-3.02,3.02-3.02,7.913,0,10.932l25.458,25.458l-25.458,25.458c-3.02,3.02-3.02,7.913,0,10.932 c1.51,1.51,3.488,2.265,5.467,2.265c1.978,0,3.956-0.755,5.466-2.265l25.458-25.458l25.458,25.458 c1.51,1.51,3.488,2.265,5.467,2.265c1.978,0,3.956-0.755,5.467-2.265c3.02-3.02,3.02-7.913,0-10.932l-25.458-25.458l25.458-25.458 C388.14,134.749,388.14,129.856,385.119,126.836z"></path>
                      </g>
                    </g> </svg>

                </button>

                {
                  sessionStorage.iCall == 'false' &&
                  <button
                    className="accept__call"
                    onClick={() => {

                      acceptACall();
                    }}
                  >
                    {
                      sessionStorage.isVideoCall == 'video' ?
                        <svg className="video__svg" viewBox="0 0 48 48" width={50} version="1" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 48 48" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#4CAF50" d="M8,12h22c2.2,0,4,1.8,4,4v16c0,2.2-1.8,4-4,4H8c-2.2,0-4-1.8-4-4V16C4,13.8,5.8,12,8,12z"></path> <polygon fill="#388E3C" points="44,35 34,29 34,19 44,13"></polygon> </g></svg>
                        :
                        <svg width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" fill="#000000">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path style={{ fill: '#51fb5c' }} d="M0,256.006C0,397.402,114.606,512.004,255.996,512C397.394,512.004,512,397.402,512,256.006 C512.009,114.61,397.394,0,255.996,0C114.606,0,0,114.614,0,256.006z"></path>
                            <path style={{ fill: '#3fe961' }} d="M512,256.005c0-4.151-0.117-8.273-0.313-12.378c-0.477-0.48-120.329-120.335-120.862-120.863 C356.415,87.948,308.701,66.313,256,66.313c-104.592,0-189.687,85.087-189.687,189.68c0,53.653,22.491,102.073,58.413,136.612 c0.395,0.396,118.509,118.478,119.043,119.005c0.029,0.029,0.055,0.055,0.083,0.083c4.026,0.189,8.071,0.307,12.144,0.307 C397.394,512.004,512,397.401,512,256.005z"></path>
                            <path style={{ fill: '#F6F6F6' }} d="M256,66.313c-104.592,0-189.687,85.088-189.687,189.68S151.408,445.68,255.935,445.68 c0.702,0.007,1.389,0.007,2.084,0.007c75.564,0,101.775-34.687,108.043-45.407c7.067-12.087,8.205-24.676,3.045-33.676 c-2.945-5.123-7.777-8.604-13.68-10.202l3.314-3.321c5.472-5.481,8.34-13.068,7.861-20.809c-0.479-7.742-4.26-14.912-10.37-19.682 L324.317,287.7c-9.849-7.703-23.58-7.642-33.375,0.116l-7.101,5.619c-4.458,3.527-10.852,3.165-14.877-0.873l-57.086-57.209 c-4.033-4.045-4.411-10.482-0.876-14.966l5.607-7.108c7.733-9.803,7.785-23.534,0.124-33.397l-24.842-31.985 c-4.763-6.128-11.933-9.918-19.675-10.397c-7.773-0.532-15.306,2.393-20.782,7.881l-20.388,20.431 c-11.813,11.84-29.187,49.49,64.345,143.215c60.559,60.69,97.811,73.433,118.397,73.433c12.928,0,20.496-4.863,24.568-8.946 l4.425-4.434c1.404,1.276,3.23,2.103,5.278,2.103c3.616,0,6.082,1.111,7.337,3.296c1.702,2.964,1.941,9.409-2.979,17.829 c-10.798,18.454-41.618,38.137-96.415,37.566c-95.878,0-173.881-78.002-173.881-173.881c0-95.871,78.002-173.873,173.881-173.873 s173.881,78.002,173.881,173.873c0,31.985-8.761,63.252-25.332,90.414c-2.273,3.721-1.095,8.591,2.628,10.86 c3.721,2.277,8.591,1.104,10.864-2.631c18.089-29.638,27.647-63.754,27.647-98.641C445.688,151.401,360.592,66.313,256,66.313z M327.164,362.352c-2.767,2.771-7.518,4.299-13.376,4.299c-14.406,0-47.484-8.938-107.205-68.786 c-89.897-90.082-67.228-118.006-64.345-120.894l20.388-20.431c2.13-2.138,4.913-3.289,7.892-3.289c0.239,0,0.482,0.007,0.722,0.023 c3.261,0.201,6.163,1.737,8.17,4.315l24.837,31.985c3.191,4.107,3.172,9.834-0.05,13.917l-5.612,7.108 c-8.482,10.774-7.58,26.212,2.099,35.914l57.086,57.209c9.698,9.725,25.123,10.621,35.883,2.107l7.098-5.619 c4.067-3.227,9.756-3.234,13.839-0.054l31.916,24.892c2.581,2.015,4.114,4.932,4.315,8.205c0.205,3.273-0.957,6.345-3.273,8.668 L327.164,362.352z"></path>
                          </g>
                        </svg>
                    }
                  </button>
                }
              </div>
            }
          </div>
        </Modal>
        <div className="d-none d-xl-block  container-fluid xl_header top__header">
          <header className="sticky-top ">
            <Link className="logoLeft " to="/" style={{ opacity: logoOpacity, display: "none" }}>
              <img src={logo} alt="" />
            </Link>
            <div className="d-flex align-items-center justify-content-end w-100 gap-2">

              <Categories />
              <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible} setIsNotificationOptionsVisible={setIsNotificationOptionsVisible} />

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
                            BiviClips
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

        <div className="d-block d-xl-none  pt-2">
          <div className="sm_header container-fluid">
            <div className="d-flex align-items-center mb-3 justify-content-between ">
              <div className={`top_section  ${openMenu ? "open" : ""}`}>
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
              <div className="burger_menu d-flex align-content-center w-100 gap-2">
                <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible} setIsNotificationOptionsVisible={setIsNotificationOptionsVisible} />
                {
                  user ? (
                    <div className="d-flex align-items-center gap-2">
                      <NavLink
                        className="upload basket"
                        to="/basket"
                        activeclassname="active"
                      >
                        <img src={Bag2} alt="" />

                        <span className="basket_items_count">{totalUniqueItems}</span>
                      </NavLink>
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
                              BiviClips
                            </Link>
                          </div>
                        )}
                      </div>
                      <button className="sm_ntf">
                        <img src={Notification} alt="" />
                      </button>
                      <NavLink
                        className="upload msg"
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
            <div className="mob-search d-md-none d-flex">
            <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible} setIsNotificationOptionsVisible={setIsNotificationOptionsVisible} />
            
            {
                  user && (
                    <div className="d-flex align-items-center gap-2">
                      <NavLink
                        className="upload basket"
                        to="/basket"
                        activeclassname="active"
                      >
                        <img src={Bag2} alt="" />

                        <span className="basket_items_count">{totalUniqueItems}</span>
                      </NavLink>
               
                      <button className="sm_ntf">
                        <img src={Notification} alt="" />
                      </button>
                     

                    </div>
                  )
                }
            
             <div className="d-flex gap-2">
                  <div className="filter">
                    <img src={filter} alt="" />
                  </div>
                </div> 
            </div>
       
            {/* <div className="d-flex justify-content-between align-items-center gap-3 my-2 mb-4 search__bar"> */}
            {/* <div className="search-wrapper" ref={searchRef}>
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
                      <div className="microphone">
                        <img src={microphone} alt="" />
                      </div>
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
                </div> */}
          
          </div>
        </div>
        {/* <div className="fixed-menu">
          {
            user ? (
              <div className="d-flex flex-column gap-4">
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
                        BiviClips
                      </Link>
                    </div>
                  )}
                </div>
                <NavLink
                  className="upload basket"
                  to="/basket"
                  activeclassname="active"
                >
                  <img src={Bag2} alt="" />

                  <span className="basket_items_count">{totalUniqueItems}</span>
                </NavLink>
                <button className="sm_ntf">
                  <img src={Notification} alt="" />
                </button>


              </div>
            ) : (
              null
            )
          }
        </div> */}
      </>
    );
  } else {
    return null;
  }
};

export default Header;