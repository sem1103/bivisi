import React, { useContext, useEffect, useState, useRef } from "react";
import "./style.scss";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoLight.svg";
import logoLightMode from "../../assets/images/logoLightMode.png";
import Ntf from "../../assets/icons/ntf.svg";
import ProfileMenu from "../../components/ProfileMenu";
import login from "../../assets/icons/login.svg";
import { AuthContext } from "../../context/authContext";
import bars from "../../assets/images/bars.svg";
import helpOutline from "../../layout/Sidebar/icons/help-outline.svg";
import { useCart } from "react-use-cart";
import { AiOutlineClose } from "react-icons/ai";
import { ChatContext } from "../../context/ChatContext";
import { Modal } from 'antd';
import callRingtone from './../../assets/images/call.mp3'
import notificationSound from './../../assets/images/notification.mp3'
import Search from "./components/Search/Search";
import Categories from "../Categories";
import { ThemeContext } from "../../context/ThemeContext";
import FilterModal from "../../components/FilterModal";
import { menuItem, menuItem2, authItems } from "../../contsant";
import Notifications from "./components/Notifications";
import { NotificationContext } from "../../context/NotificationContext";
import Cookies from 'js-cookie'
import axios from "axios";


const Header = ({ isOpen }) => {
  const USER_TOKEN = Cookies.get('authTokens') != undefined ? JSON.parse(Cookies.get('authTokens')).access : false;

  const navigate = useNavigate();
  const {notificationSocket} = useContext(NotificationContext);
  const { themeMode } = useContext(ThemeContext);
  const notificationRef1 = useRef(null);
  const notificationRef2 = useRef(null);
  const notificationRef3 = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const { isModalCallOpen, setIsModalCallOpen, callModalText, declineCall, iCall, acceptACall, isAccept, setIsAccept } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const [isUploadOptionsVisible, setIsUploadOptionsVisible] = useState(false);
  
  const [isNotificationOptionsVisible, setIsNotificationOptionsVisible] = useState(false);
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const ringtoneRef = useRef(new Audio(callRingtone)); // Создание рефа для аудиоэлемента
  const notificationSoundRef = useRef(new Audio(notificationSound)); // Создание рефа для аудиоэлемента
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { totalUniqueItems, totalItems } = useCart();
  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };
  const logoOpacity = isOpen ? 0 : 1;

  const toggleUploadOptions = () => {
    setIsUploadOptionsVisible(!isUploadOptionsVisible);
    
  };



  const handleOptionClick = () => {
    setIsUploadOptionsVisible(false);
  };


  const getNotifications = async () => {
    const resp = await axios.get(`https://bivisibackend.store/api/notifications`, {
        headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
        }
    });

    setNotifications(resp.data);
}

function getFormattedDate() {
  const date = new Date();
  const isoString = date.toISOString();
  
  const microseconds = String(date.getMilliseconds()).padStart(3, '0') + '133';
  
  return isoString.slice(0, -1) + microseconds + 'Z';
}


  useEffect(() => {
    isAccept && navigate(`/call/${localStorage.videoCallRoomId}`)

    setIsAccept(false)
  }, [isAccept])

  useEffect(() => {
    if(notificationSocket != null){
      getNotifications()
      notificationSocket.onmessage = function (event) {
        let eventObj = JSON.parse(event.data);
        
        setNotifications(prev => {
          notificationSoundRef.current.pause();
          notificationSoundRef.current.play();
            return [
                {
                    id: eventObj.notification_id,
                    created_at: getFormattedDate(),
                    notification_type: eventObj.notification_type,
                    message: eventObj.message,
                    product_id: eventObj.product_id,
                    sender: eventObj.sender
                },
                ...prev
            ]
        });
    };
    }
  
  }, [notificationSocket]);

  useEffect(() => {
    if (isModalCallOpen && sessionStorage.iCall == 'false') {
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play();
    } else {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0; // Сброс времени воспроизведения

    }

  }, [isModalCallOpen]);


  const handleClickOutside = (event) => {
    if (
      notificationRef1.current &&
      notificationRef2.current &&
      notificationRef3.current &&
      !notificationRef1.current.contains(event.target) &&
      !notificationRef2.current.contains(event.target) &&
      !notificationRef3.current.contains(event.target) 
    ) {
      setIsNotificationOptionsVisible(false);
    }
  };

  useEffect(() => {
    if (isNotificationOptionsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOptionsVisible]);

  if (
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/reset_password" &&
    location.pathname !== "/user/reset-password" &&
  
    location.pathname !== "/re-register" &&
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
              <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible} />

              {user ? (
                <div className="content_left d-flex align-items-center justify-content-end gap-3">

                  <div className="content_left_icons">
                    <div className="upload-container">
                      <div className="upload " onClick={toggleUploadOptions}>
                        {/* <img src={upload} alt="" /> */}
                        <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="Icon/Upload/Outline">
                            <path id="Vector 345" d="M8 4.5L10.5 2M10.5 2L13 4.5M10.5 2V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            <path id="Vector 355" d="M6.75 7V7C4.67893 7 3 8.67893 3 10.75V13C3 15.2091 4.79086 17 7 17H14C16.2091 17 18 15.2091 18 13V10.75C18 8.67893 16.3211 7 14.25 7V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                          </g>
                        </svg>

                      </div>
                      {isUploadOptionsVisible && (
                        <div className="upload-options">
                          <Link
                            to="/your_profile/upload_video"
                            onClick={handleOptionClick}
                          >
                            {/* <img src={videoOutline} alt="" className="me-2" /> */}
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 28 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="Icon/Video Tick/Outline">
                                <path
                                  id="Vector"
                                  d="M15.7095 8.91735C15.4797 9.262 15.5728 9.72765 15.9175 9.95741C16.2621 10.1872 16.7278 10.094 16.9575 9.7494L15.7095 8.91735ZM12.2909 2.7494C12.5206 2.40475 12.4275 1.9391 12.0829 1.70934C11.7382 1.47957 11.2726 1.5727 11.0428 1.91735L12.2909 2.7494ZM6.37613 8.91735C6.14636 9.262 6.23949 9.72765 6.58414 9.95741C6.92878 10.1872 7.39444 10.094 7.6242 9.7494L6.37613 8.91735ZM10.9687 15.7477C10.6452 15.489 10.1733 15.5414 9.91451 15.8649C9.65575 16.1883 9.7082 16.6603 10.0316 16.919L10.9687 15.7477ZM12.5451 17.9693L13.0136 17.3837L12.5451 17.9693ZM14.1519 17.8266L13.5875 17.3327V17.3327L14.1519 17.8266ZM18.0646 14.4939C18.3374 14.1822 18.3058 13.7084 17.994 13.4356C17.6823 13.1628 17.2085 13.1944 16.9357 13.5062L18.0646 14.4939ZM7.00016 3.08337H21.0002V1.58337H7.00016V3.08337ZM3.0835 21V7.00004H1.5835V21H3.0835ZM24.9168 7.00004V21H26.4168V7.00004H24.9168ZM21.0002 24.9167H7.00016V26.4167H21.0002V24.9167ZM24.9168 21C24.9168 23.1632 23.1633 24.9167 21.0002 24.9167V26.4167C23.9917 26.4167 26.4168 23.9916 26.4168 21H24.9168ZM1.5835 21C1.5835 23.9916 4.00862 26.4167 7.00016 26.4167V24.9167C4.83705 24.9167 3.0835 23.1632 3.0835 21H1.5835ZM21.0002 3.08337C23.1633 3.08337 24.9168 4.83693 24.9168 7.00004H26.4168C26.4168 4.0085 23.9917 1.58337 21.0002 1.58337V3.08337ZM7.00016 1.58337C4.00862 1.58337 1.5835 4.0085 1.5835 7.00004H3.0835C3.0835 4.83693 4.83705 3.08337 7.00016 3.08337V1.58337ZM2.3335 10.0834H25.6668V8.58337H2.3335V10.0834ZM20.3761 1.91735L15.7095 8.91735L16.9575 9.7494L21.6242 2.7494L20.3761 1.91735ZM11.0428 1.91735L6.37613 8.91735L7.6242 9.7494L12.2909 2.7494L11.0428 1.91735ZM10.0316 16.919L12.0766 18.555L13.0136 17.3837L10.9687 15.7477L10.0316 16.919ZM14.7164 18.3205L18.0646 14.4939L16.9357 13.5062L13.5875 17.3327L14.7164 18.3205ZM12.0766 18.555C12.8775 19.1957 14.0409 19.0924 14.7164 18.3205L13.5875 17.3327C13.4407 17.5005 13.1878 17.523 13.0136 17.3837L12.0766 18.555Z"
                                  fill="#A2A8B7"
                                />
                              </g>
                            </svg>

                            Video
                          </Link>
                          <Link
                            to="/your_profile/upload_shorts"
                            onClick={handleOptionClick}
                          >
                            {/* <img src={shortsOutline} alt="" className="me-2" /> */}

                            <svg
                              width="28px"
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
                                    d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z"
                                    style={{ fill: 'currentcolor', color: 'rgb(4, 171, 242)' }}
                                  />
                                  <g id="XMLID_15_">
                                    <g>
                                      <path
                                        d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z"
                                        style={{ fill: 'currentcolor' }}
                                      />
                                      <path
                                        d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z"
                                        style={{ fill: 'var(--textColor)' }}
                                      />
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>


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
                      {/* <img src={Bag2} alt="" /> */}

                      <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3334 4.99984C13.3334 3.15889 11.841 1.6665 10 1.6665C8.15907 1.6665 6.66669 3.15889 6.66669 4.99984" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                        <path d="M3.8017 7.91988C4.01022 6.25179 5.42822 5 7.1093 5H12.8907C14.5718 5 15.9898 6.25179 16.1983 7.91988L17.0317 14.5865C17.2804 16.5761 15.7291 18.3333 13.7241 18.3333H6.27596C4.27097 18.3333 2.71968 16.5761 2.96837 14.5865L3.8017 7.91988Z" stroke="white" strokeWidth="1.5" stroke-linejoin="round" />
                        <path d="M7.5 13.3335C9.46345 14.4505 10.5396 14.4387 12.5 13.3335" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                      </svg>


                      <span className="basket_items_count">{totalUniqueItems}</span>
                    </NavLink>
                    <div
                    ref={notificationRef1}
                      className=" ntf"
                     
                    >
                      <button className="ntf__button"
                       onClick={() => {
                        setIsNotificationOptionsVisible(!isNotificationOptionsVisible);
                      }}
                      >
  <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.22647 3.39111C6.88616 3.74444 5.01449 5.67732 4.73307 8.16156L4.44567 10.6986C4.37426 11.329 4.11876 11.9223 3.71295 12.3999C2.85178 13.4135 3.55072 14.9999 4.85849 14.9999H15.1416C16.4494 14.9999 17.1483 13.4135 16.2871 12.3999C15.8813 11.9223 15.6258 11.329 15.5544 10.6986L15.3645 9.02215M12.5 16.6665C12.1361 17.6375 11.1542 18.3332 10 18.3332C8.84585 18.3332 7.86394 17.6375 7.50004 16.6665" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="14" cy="4" r="2.4" stroke="white" strokeWidth="1.2" />
                      </svg>
                      </button>
                    


                      {isNotificationOptionsVisible && (
                        <div className="notification-options">
                          <h1>Notifications</h1>
                          <Notifications notifications={notifications} setNotifications={setNotifications}/>
                        </div>
                      )}
                    </div>

                    <NavLink
                      className="upload"
                      to="/chat"
                      activeclassname="active"
                    >
                      {/* <img src={Chat} alt="" /> */}

                      <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8333 2.5H9.16663C5.02449 2.5 1.66663 5.85786 1.66663 10V14.1667C1.66663 16.0076 3.15901 17.5 4.99996 17.5H10.8333C14.9754 17.5 18.3333 14.1421 18.3333 10C18.3333 5.85786 14.9754 2.5 10.8333 2.5Z" stroke="white" strokeWidth="1.5" stroke-linejoin="round" />
                        <circle cx="9.99996" cy="9.99984" r="0.833333" fill="white" />
                        <circle cx="13.3333" cy="9.99984" r="0.833333" fill="white" />
                        <circle cx="6.66671" cy="9.99984" r="0.833333" fill="white" />
                      </svg>

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
                  <button onClick={toggleMenu} className="toggle-button bars">
                  <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="#fff"
  width="24px"
  height="24px"
  viewBox="0 0 276.167 276.167"
  style={{ marginRight: '25px' }}
>
  <g fill="#fff">
    <path d="M33.144,2.471C15.336,2.471,0.85,16.958,0.85,34.765s14.48,32.293,32.294,32.293s32.294-14.486,32.294-32.293 S50.951,2.471,33.144,2.471z"></path>
    <path d="M137.663,2.471c-17.807,0-32.294,14.487-32.294,32.294s14.487,32.293,32.294,32.293c17.808,0,32.297-14.486,32.297-32.293 S155.477,2.471,137.663,2.471z"></path>
    <path d="M243.873,67.059c17.804,0,32.294-14.486,32.294-32.293S261.689,2.471,243.873,2.471s-32.294,14.487-32.294,32.294 S226.068,67.059,243.873,67.059z"></path>
    <path d="M32.3,170.539c17.807,0,32.297-14.483,32.297-32.293c0-17.811-14.49-32.297-32.297-32.297S0,120.436,0,138.246 C0,156.056,14.493,170.539,32.3,170.539z"></path>
    <path d="M136.819,170.539c17.804,0,32.294-14.483,32.294-32.293c0-17.811-14.478-32.297-32.294-32.297 c-17.813,0-32.294,14.486-32.294,32.297C104.525,156.056,119.012,170.539,136.819,170.539z"></path>
    <path d="M243.038,170.539c17.811,0,32.294-14.483,32.294-32.293c0-17.811-14.483-32.297-32.294-32.297 s-32.306,14.486-32.306,32.297C210.732,156.056,225.222,170.539,243.038,170.539z"></path>
    <path d="M33.039,209.108c-17.807,0-32.3,14.483-32.3,32.294c0,17.804,14.493,32.293,32.3,32.293s32.293-14.482,32.293-32.293 S50.846,209.108,33.039,209.108z"></path>
    <path d="M137.564,209.108c-17.808,0-32.3,14.483-32.3,32.294c0,17.804,14.487,32.293,32.3,32.293 c17.804,0,32.293-14.482,32.293-32.293S155.368,209.108,137.564,209.108z"></path>
    <path d="M243.771,209.108c-17.804,0-32.294,14.483-32.294,32.294c0,17.804,14.49,32.293,32.294,32.293 c17.811,0,32.294-14.482,32.294-32.293S261.575,209.108,243.771,209.108z"></path>
  </g>
</svg>


                  </button>
                  <Link to="/" style={{ display: isOpen ? "block" : "none" }}>
                    {themeMode ?
                      <img src={logoLightMode} alt="" className="logo" />
                      :
                      <img src={logo} alt="" className="logo" />}
                  </Link>
                </div>
                <div className="offcanvas-menu">
                  <div
                    onClick={toggleMenu}
                    className="close-button d-flex justify-content-between align-items-center gap-2 mb-3"
                  >
                    <Link to="/" style={{ display: isOpen ? "block" : "none" }}>
                      {themeMode ?
                        <img src={logoLightMode} alt="" className="logo" />
                        :
                        <img src={logo} alt="" className="logo" />}
                    </Link>
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
                            <div
                              className="menu-icon"
                              dangerouslySetInnerHTML={{ __html: item.icon }}
                            />
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
                                <div
                                  className="menu-icon"
                                  dangerouslySetInnerHTML={{ __html: item.icon }}
                                />                                <span
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
                              <div
                                className="menu-icon"
                                dangerouslySetInnerHTML={{ __html: item.icon }}
                              />
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
                <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible}  />
                {
                  user ? (
                    <div className="d-flex align-items-center gap-2 tablet__menu">
                      <NavLink
                        className="upload basket"
                        to="/basket"
                        activeclassname="active"
                      >
                        {/* <img src={Bag2} alt="" /> */}
                        <svg width="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.3334 4.99984C13.3334 3.15889 11.841 1.6665 10 1.6665C8.15907 1.6665 6.66669 3.15889 6.66669 4.99984" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                          <path d="M3.8017 7.91988C4.01022 6.25179 5.42822 5 7.1093 5H12.8907C14.5718 5 15.9898 6.25179 16.1983 7.91988L17.0317 14.5865C17.2804 16.5761 15.7291 18.3333 13.7241 18.3333H6.27596C4.27097 18.3333 2.71968 16.5761 2.96837 14.5865L3.8017 7.91988Z" stroke="white" strokeWidth="1.5" stroke-linejoin="round" />
                          <path d="M7.5 13.3335C9.46345 14.4505 10.5396 14.4387 12.5 13.3335" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                        </svg>


                        <span className="basket_items_count">{totalUniqueItems}</span>
                      </NavLink>
                      <div className="upload-container">
                        <div className="upload " onClick={toggleUploadOptions}>
                          {/* <img src={upload} alt="" /> */}
                          <svg width="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icon/Upload/Outline">
                              <path id="Vector 345" d="M8 4.5L10.5 2M10.5 2L13 4.5M10.5 2V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                              <path id="Vector 355" d="M6.75 7V7C4.67893 7 3 8.67893 3 10.75V13C3 15.2091 4.79086 17 7 17H14C16.2091 17 18 15.2091 18 13V10.75C18 8.67893 16.3211 7 14.25 7V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                            </g>
                          </svg>

                        </div>
                        {isUploadOptionsVisible && (
                          <div className="upload-options mt-2">
                            <Link
                              to="/your_profile/upload_video"
                              onClick={handleOptionClick}
                            >
                              {/* <img src={videoOutline} alt="" className="me-2" /> */}
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g id="Icon/Video Tick/Outline">
                                  <path
                                    id="Vector"
                                    d="M15.7095 8.91735C15.4797 9.262 15.5728 9.72765 15.9175 9.95741C16.2621 10.1872 16.7278 10.094 16.9575 9.7494L15.7095 8.91735ZM12.2909 2.7494C12.5206 2.40475 12.4275 1.9391 12.0829 1.70934C11.7382 1.47957 11.2726 1.5727 11.0428 1.91735L12.2909 2.7494ZM6.37613 8.91735C6.14636 9.262 6.23949 9.72765 6.58414 9.95741C6.92878 10.1872 7.39444 10.094 7.6242 9.7494L6.37613 8.91735ZM10.9687 15.7477C10.6452 15.489 10.1733 15.5414 9.91451 15.8649C9.65575 16.1883 9.7082 16.6603 10.0316 16.919L10.9687 15.7477ZM12.5451 17.9693L13.0136 17.3837L12.5451 17.9693ZM14.1519 17.8266L13.5875 17.3327V17.3327L14.1519 17.8266ZM18.0646 14.4939C18.3374 14.1822 18.3058 13.7084 17.994 13.4356C17.6823 13.1628 17.2085 13.1944 16.9357 13.5062L18.0646 14.4939ZM7.00016 3.08337H21.0002V1.58337H7.00016V3.08337ZM3.0835 21V7.00004H1.5835V21H3.0835ZM24.9168 7.00004V21H26.4168V7.00004H24.9168ZM21.0002 24.9167H7.00016V26.4167H21.0002V24.9167ZM24.9168 21C24.9168 23.1632 23.1633 24.9167 21.0002 24.9167V26.4167C23.9917 26.4167 26.4168 23.9916 26.4168 21H24.9168ZM1.5835 21C1.5835 23.9916 4.00862 26.4167 7.00016 26.4167V24.9167C4.83705 24.9167 3.0835 23.1632 3.0835 21H1.5835ZM21.0002 3.08337C23.1633 3.08337 24.9168 4.83693 24.9168 7.00004H26.4168C26.4168 4.0085 23.9917 1.58337 21.0002 1.58337V3.08337ZM7.00016 1.58337C4.00862 1.58337 1.5835 4.0085 1.5835 7.00004H3.0835C3.0835 4.83693 4.83705 3.08337 7.00016 3.08337V1.58337ZM2.3335 10.0834H25.6668V8.58337H2.3335V10.0834ZM20.3761 1.91735L15.7095 8.91735L16.9575 9.7494L21.6242 2.7494L20.3761 1.91735ZM11.0428 1.91735L6.37613 8.91735L7.6242 9.7494L12.2909 2.7494L11.0428 1.91735ZM10.0316 16.919L12.0766 18.555L13.0136 17.3837L10.9687 15.7477L10.0316 16.919ZM14.7164 18.3205L18.0646 14.4939L16.9357 13.5062L13.5875 17.3327L14.7164 18.3205ZM12.0766 18.555C12.8775 19.1957 14.0409 19.0924 14.7164 18.3205L13.5875 17.3327C13.4407 17.5005 13.1878 17.523 13.0136 17.3837L12.0766 18.555Z"
                                    fill="#A2A8B7"
                                  />
                                </g>
                              </svg>

                              Video
                            </Link>
                            <Link
                              to="/your_profile/upload_shorts"
                              onClick={handleOptionClick}
                            >
                              {/* <img src={shortsOutline} alt="" className="me-2" /> */}

                              <svg
                                width="28px"
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
                                      d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z"
                                      style={{ fill: 'currentcolor', color: 'rgb(4, 171, 242)' }}
                                    />
                                    <g id="XMLID_15_">
                                      <g>
                                        <path
                                          d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z"
                                          style={{ fill: 'currentcolor' }}
                                        />
                                        <path
                                          d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z"
                                          style={{ fill: 'var(--textColor)' }}
                                        />
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>


                              BiviClips
                            </Link>
                          </div>
                        )}
                      </div>
                     <div className="ntf sm__ntf__dropdown"  ref={notificationRef2}>
                     <button className="sm_ntf " 
                       onClick={() => {
                        
                        setIsNotificationOptionsVisible(!isNotificationOptionsVisible);
                      }}
                      >
                        <svg width="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.22647 3.39111C6.88616 3.74444 5.01449 5.67732 4.73307 8.16156L4.44567 10.6986C4.37426 11.329 4.11876 11.9223 3.71295 12.3999C2.85178 13.4135 3.55072 14.9999 4.85849 14.9999H15.1416C16.4494 14.9999 17.1483 13.4135 16.2871 12.3999C15.8813 11.9223 15.6258 11.329 15.5544 10.6986L15.3645 9.02215M12.5 16.6665C12.1361 17.6375 11.1542 18.3332 10 18.3332C8.84585 18.3332 7.86394 17.6375 7.50004 16.6665" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="14" cy="4" r="2.4" stroke="white" strokeWidth="1.2" />
                        </svg>
                      </button>
                      
                      {isNotificationOptionsVisible && (
                        <div className="notification-options medium__dropdown" >
                          <h1>Notifications</h1>
                          <Notifications notifications={notifications} setNotifications={setNotifications}/>
                        </div>
                      )}
                     </div>
                      <NavLink
                        className="upload msg"
                        to="/chat"
                        activeclassname="active"
                      >
                        {/* <img src={Chat} alt="" /> */}

                        <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.8333 2.5H9.16663C5.02449 2.5 1.66663 5.85786 1.66663 10V14.1667C1.66663 16.0076 3.15901 17.5 4.99996 17.5H10.8333C14.9754 17.5 18.3333 14.1421 18.3333 10C18.3333 5.85786 14.9754 2.5 10.8333 2.5Z" stroke="white" strokeWidth="1.5" stroke-linejoin="round" />
                          <circle cx="9.99996" cy="9.99984" r="0.833333" fill="white" />
                          <circle cx="13.3333" cy="9.99984" r="0.833333" fill="white" />
                          <circle cx="6.66671" cy="9.99984" r="0.833333" fill="white" />
                        </svg>

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
            <div className="mob-search d-md-none d-flex align-items-center">
              <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible}/>
              <div className="d-flex gap-2">
                <div className="filter" onClick={() => setShowFilterModal(true)}>
                  <svg width="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Icon/Filter">
                      <path id="Vector" d="M2.5 4.16667H8.33333M8.33333 4.16667C8.33333 5.08714 9.07953 5.83333 10 5.83333C10.9205 5.83333 11.6667 5.08714 11.6667 4.16667M8.33333 4.16667C8.33333 3.24619 9.07953 2.5 10 2.5C10.9205 2.5 11.6667 3.24619 11.6667 4.16667M2.5 10H10M15.8333 10H17.5M15.8333 10C15.8333 10.9205 15.0871 11.6667 14.1667 11.6667C13.2462 11.6667 12.5 10.9205 12.5 10C12.5 9.07953 13.2462 8.33333 14.1667 8.33333C15.0871 8.33333 15.8333 9.07953 15.8333 10ZM11.6667 4.16667H17.5M10 15.8333H17.5M2.5 15.8333H4.16667M4.16667 15.8333C4.16667 16.7538 4.91286 17.5 5.83333 17.5C6.75381 17.5 7.5 16.7538 7.5 15.8333C7.5 14.9129 6.75381 14.1667 5.83333 14.1667C4.91286 14.1667 4.16667 14.9129 4.16667 15.8333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                  </svg>

                </div>
                {showFilterModal && <FilterModal setShowModal={setShowFilterModal} />}
              </div>
              {
                user && (
                  <div className="d-flex align-items-center gap-2 tablet__menu">
                    <NavLink
                      className="upload basket"
                      to="/basket"
                      activeclassname="active"
                    >
                      {/* <img src={Bag2} alt="" /> */}
                      <svg width="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3334 4.99984C13.3334 3.15889 11.841 1.6665 10 1.6665C8.15907 1.6665 6.66669 3.15889 6.66669 4.99984" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                        <path d="M3.8017 7.91988C4.01022 6.25179 5.42822 5 7.1093 5H12.8907C14.5718 5 15.9898 6.25179 16.1983 7.91988L17.0317 14.5865C17.2804 16.5761 15.7291 18.3333 13.7241 18.3333H6.27596C4.27097 18.3333 2.71968 16.5761 2.96837 14.5865L3.8017 7.91988Z" stroke="white" strokeWidth="1.5" stroke-linejoin="round" />
                        <path d="M7.5 13.3335C9.46345 14.4505 10.5396 14.4387 12.5 13.3335" stroke="white" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                      </svg>


                      <span className="basket_items_count">{totalUniqueItems}</span>
                    </NavLink>


                    <div className="ntf sm__ntf__dropdown"  ref={notificationRef3}>
                     <button className="sm_ntf " 
                       onClick={() => {
                        
                        setIsNotificationOptionsVisible(!isNotificationOptionsVisible);
                      }}
                      >
                         <svg width="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.22647 3.39111C6.88616 3.74444 5.01449 5.67732 4.73307 8.16156L4.44567 10.6986C4.37426 11.329 4.11876 11.9223 3.71295 12.3999C2.85178 13.4135 3.55072 14.9999 4.85849 14.9999H15.1416C16.4494 14.9999 17.1483 13.4135 16.2871 12.3999C15.8813 11.9223 15.6258 11.329 15.5544 10.6986L15.3645 9.02215M12.5 16.6665C12.1361 17.6375 11.1542 18.3332 10 18.3332C8.84585 18.3332 7.86394 17.6375 7.50004 16.6665" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="14" cy="4" r="2.4" stroke="white" strokeWidth="1.2" />
                      </svg>
                      </button>
                      {isNotificationOptionsVisible && (
                        <div className="notification-options " >
                          <h1>Notifications</h1>
                          <Notifications notifications={notifications} setNotifications={setNotifications}/>
                        </div>
                      )}
                     </div>

                  </div>
                )
              }


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
      </>
    );
  } else {
    return null;
  }
};

export default Header;