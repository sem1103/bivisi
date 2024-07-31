import React, { useContext, useEffect, useState, useRef } from "react";
import "./style.scss";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import upload from "../../assets/icons/upload.svg";
import logo from "../../assets/images/logoLight.svg";
import logoLightMode from "../../assets/images/logoLightMode.png";

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
import { ThemeContext } from "../../context/ThemeContext";


const Header = ({ isOpen }) => {
  const navigate = useNavigate();
  const { themeMode } = useContext(ThemeContext);
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
      icon: `<svg id="home__icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g >
<path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M24.5 11.8421V20.9614C24.5 23.56 22.4107 25.6667 19.8333 25.6667H8.16667C5.58934 25.6667 3.5 23.5601 3.5 20.9614V11.8421C3.5 10.4293 4.12959 9.09129 5.21484 8.19765L11.0482 3.39428C12.766 1.97974 15.234 1.97974 16.9518 3.39428L22.7852 8.19765C23.8704 9.09129 24.5 10.4293 24.5 11.8421ZM11.6667 20.125C11.1834 20.125 10.7917 20.5168 10.7917 21C10.7917 21.4833 11.1834 21.875 11.6667 21.875H16.3333C16.8166 21.875 17.2083 21.4833 17.2083 21C17.2083 20.5168 16.8166 20.125 16.3333 20.125H11.6667Z" fill="white"/>
</g>
</svg>
`,
      iconActive: videoOutline,
    },
    {
      path: "/shorts",
      name: "BiviClips",
      icon: `<svg width="28px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnxlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 168.071 168.071" xml:space="preserve"><g><g><path d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z" style="fill: currentcolor; color: rgb(4, 171, 242);"></path><g id="XMLID_15_"><g><path d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z" style="fill: currentcolor;"></path><path d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z" style="fill: var(--textColor);"></path></g></g></g></g></svg>`,
      iconActive: videoOutline,
    },
  ];

  const menuItem2 = [
    {
      path: "/latest_videos",
      name: "Latest videos",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Camera Video/Outline">
<g id="Vector">
<path d="M2.3335 9.33329C2.3335 6.75596 4.42283 4.66663 7.00016 4.66663H15.1668C17.7442 4.66663 19.8335 6.75596 19.8335 9.33329V18.6666C19.8335 21.244 17.7442 23.3333 15.1668 23.3333H7.00016C4.42283 23.3333 2.3335 21.244 2.3335 18.6666V9.33329Z" stroke="#A2A8B7" stroke-width="1.5"/>
<path d="M19.8335 10.8888L21.6312 8.97125C23.078 7.42809 25.6668 8.45186 25.6668 10.5671V17.4328C25.6668 19.5481 23.078 20.5718 21.6312 19.0287L19.8335 17.1111V10.8888Z" stroke="#A2A8B7" stroke-width="1.5"/>
<path d="M15.1668 11.6666C15.1668 12.9553 14.1222 14 12.8335 14C11.5448 14 10.5002 12.9553 10.5002 11.6666C10.5002 10.378 11.5448 9.33329 12.8335 9.33329C14.1222 9.33329 15.1668 10.378 15.1668 11.6666Z" stroke="#A2A8B7" stroke-width="1.5"/>
</g>
</g>
</svg>
`,
    },
    {
      path: "/trending",
      name: "Trending",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Chart/Outline">
<path id="Vector" d="M16.9168 9.75004C16.5026 9.75004 16.1668 10.0858 16.1668 10.5C16.1668 10.9143 16.5026 11.25 16.9168 11.25V9.75004ZM20.156 11.145L19.4851 11.4804H19.4851L20.156 11.145ZM20.3293 13.1688C20.5146 13.5393 20.9651 13.6894 21.3356 13.5042C21.7061 13.319 21.8562 12.8684 21.671 12.498L20.3293 13.1688ZM19.8774 11.4946L20.2886 10.8673L19.0341 10.0449L18.6229 10.6722L19.8774 11.4946ZM16.0587 15.9517L15.4314 15.5405L16.0587 15.9517ZM14.0849 15.9162L13.4433 16.3046L14.0849 15.9162ZM11.8587 12.2384L11.2171 12.6268V12.6268L11.8587 12.2384ZM9.83568 12.2853L9.17679 11.927L9.83568 12.2853ZM6.34127 17.1418C6.1434 17.5057 6.27799 17.9611 6.64189 18.1589C7.00579 18.3568 7.46119 18.2222 7.65906 17.8583L6.34127 17.1418ZM7.00016 3.08337H21.0002V1.58337H7.00016V3.08337ZM24.9168 7.00004V21H26.4168V7.00004H24.9168ZM21.0002 24.9167H7.00016V26.4167H21.0002V24.9167ZM3.0835 21V7.00004H1.5835V21H3.0835ZM7.00016 24.9167C4.83705 24.9167 3.0835 23.1632 3.0835 21H1.5835C1.5835 23.9916 4.00862 26.4167 7.00016 26.4167V24.9167ZM24.9168 21C24.9168 23.1632 23.1633 24.9167 21.0002 24.9167V26.4167C23.9917 26.4167 26.4168 23.9916 26.4168 21H24.9168ZM21.0002 3.08337C23.1633 3.08337 24.9168 4.83693 24.9168 7.00004H26.4168C26.4168 4.0085 23.9917 1.58337 21.0002 1.58337V3.08337ZM7.00016 1.58337C4.00862 1.58337 1.5835 4.0085 1.5835 7.00004H3.0835C3.0835 4.83693 4.83705 3.08337 7.00016 3.08337V1.58337ZM16.9168 11.25H19.1125V9.75004H16.9168V11.25ZM19.4851 11.4804L20.3293 13.1688L21.671 12.498L20.8268 10.8095L19.4851 11.4804ZM19.1125 11.25C19.2703 11.25 19.4146 11.3392 19.4851 11.4804L20.8268 10.8095C20.5021 10.1602 19.8384 9.75004 19.1125 9.75004V11.25ZM18.6229 10.6722L15.4314 15.5405L16.6859 16.3629L19.8774 11.4946L18.6229 10.6722ZM14.7265 15.5278L12.5003 11.8501L11.2171 12.6268L13.4433 16.3046L14.7265 15.5278ZM9.17679 11.927L6.34127 17.1418L7.65906 17.8583L10.4946 12.6436L9.17679 11.927ZM12.5003 11.8501C11.7341 10.5843 9.88358 10.6272 9.17679 11.927L10.4946 12.6436C10.6482 12.361 11.0505 12.3517 11.2171 12.6268L12.5003 11.8501ZM15.4314 15.5405C15.2633 15.7969 14.8853 15.7901 14.7265 15.5278L13.4433 16.3046C14.1736 17.511 15.9127 17.5423 16.6859 16.3629L15.4314 15.5405Z" fill="#A2A8B7"/>
</g>
</svg>
`,
    },
    {
      path: "/top_videos",
      name: "Top videos",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Video Tick/Outline">
<path id="Vector" d="M15.7095 8.91735C15.4797 9.262 15.5728 9.72765 15.9175 9.95741C16.2621 10.1872 16.7278 10.094 16.9575 9.7494L15.7095 8.91735ZM12.2909 2.7494C12.5206 2.40475 12.4275 1.9391 12.0829 1.70934C11.7382 1.47957 11.2726 1.5727 11.0428 1.91735L12.2909 2.7494ZM6.37613 8.91735C6.14636 9.262 6.23949 9.72765 6.58414 9.95741C6.92878 10.1872 7.39444 10.094 7.6242 9.7494L6.37613 8.91735ZM10.9687 15.7477C10.6452 15.489 10.1733 15.5414 9.91451 15.8649C9.65575 16.1883 9.7082 16.6603 10.0316 16.919L10.9687 15.7477ZM12.5451 17.9693L13.0136 17.3837L12.5451 17.9693ZM14.1519 17.8266L13.5875 17.3327V17.3327L14.1519 17.8266ZM18.0646 14.4939C18.3374 14.1822 18.3058 13.7084 17.994 13.4356C17.6823 13.1628 17.2085 13.1944 16.9357 13.5062L18.0646 14.4939ZM7.00016 3.08337H21.0002V1.58337H7.00016V3.08337ZM3.0835 21V7.00004H1.5835V21H3.0835ZM24.9168 7.00004V21H26.4168V7.00004H24.9168ZM21.0002 24.9167H7.00016V26.4167H21.0002V24.9167ZM24.9168 21C24.9168 23.1632 23.1633 24.9167 21.0002 24.9167V26.4167C23.9917 26.4167 26.4168 23.9916 26.4168 21H24.9168ZM1.5835 21C1.5835 23.9916 4.00862 26.4167 7.00016 26.4167V24.9167C4.83705 24.9167 3.0835 23.1632 3.0835 21H1.5835ZM21.0002 3.08337C23.1633 3.08337 24.9168 4.83693 24.9168 7.00004H26.4168C26.4168 4.0085 23.9917 1.58337 21.0002 1.58337V3.08337ZM7.00016 1.58337C4.00862 1.58337 1.5835 4.0085 1.5835 7.00004H3.0835C3.0835 4.83693 4.83705 3.08337 7.00016 3.08337V1.58337ZM2.3335 10.0834H25.6668V8.58337H2.3335V10.0834ZM20.3761 1.91735L15.7095 8.91735L16.9575 9.7494L21.6242 2.7494L20.3761 1.91735ZM11.0428 1.91735L6.37613 8.91735L7.6242 9.7494L12.2909 2.7494L11.0428 1.91735ZM10.0316 16.919L12.0766 18.555L13.0136 17.3837L10.9687 15.7477L10.0316 16.919ZM14.7164 18.3205L18.0646 14.4939L16.9357 13.5062L13.5875 17.3327L14.7164 18.3205ZM12.0766 18.555C12.8775 19.1957 14.0409 19.0924 14.7164 18.3205L13.5875 17.3327C13.4407 17.5005 13.1878 17.523 13.0136 17.3837L12.0766 18.555Z" fill="#A2A8B7"/>
</g>
</svg>
`,
    },

    {
      path: "/all_channels",
      name: "All Channels",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Board/Outline">
<path id="Vector" d="M8.16634 8.16671H19.833M8.16634 14H13.9997M18.6663 19.8334L22.1663 25.6667M9.33301 19.8334L5.83301 25.6667M13.9997 19.8334V23.3334M22.1663 2.33338L5.83301 2.33337C3.90001 2.33337 2.33301 3.90038 2.33301 5.83337L2.33301 16.3334C2.33301 18.2664 3.90001 19.8334 5.83301 19.8334L22.1663 19.8334C24.0993 19.8334 25.6663 18.2664 25.6663 16.3334L25.6663 5.83338C25.6663 3.90038 24.0993 2.33338 22.1663 2.33338Z" stroke="#A2A8B7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`,
    },
    {
      path: "/popular_channels",
      name: "Popular Channels",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Star/Outline">
<path id="Star 2" d="M11.7051 3.81669C12.6439 1.83894 15.3564 1.83893 16.2952 3.81668L17.9177 7.23475C18.2905 8.02011 19.0111 8.56447 19.8447 8.69041L23.4727 9.23852C25.5719 9.55566 26.4102 12.2378 24.8911 13.7773L22.2659 16.4379C21.6627 17.0492 21.3874 17.93 21.5298 18.7932L22.1496 22.55C22.5082 24.7238 20.3137 26.3814 18.4361 25.3551L15.1911 23.5814C14.4455 23.1739 13.5548 23.1739 12.8092 23.5814L9.56422 25.3551C7.68662 26.3814 5.49216 24.7238 5.85075 22.55L6.47048 18.7932C6.61288 17.93 6.33763 17.0492 5.73443 16.4379L3.10918 13.7773C1.59017 12.2378 2.42838 9.55566 4.5276 9.23852L8.1556 8.69041C8.9892 8.56447 9.70982 8.02011 10.0826 7.23475L11.7051 3.81669Z" stroke="#A2A8B7" stroke-width="1.5" stroke-linejoin="round"/>
</g>
</svg>
`,
    },
    {
      path: "/live-streams",
      name: "Live",
      icon: `<svg width="28px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.6727 3.66836C7.85585 4.03988 7.70315 4.48953 7.33163 4.67268C4.61229 6.01327 2.75 8.79333 2.75 12C2.75 15.2066 4.61229 17.9867 7.33163 19.3273C7.70315 19.5104 7.85585 19.9601 7.6727 20.3316C7.48954 20.7031 7.03989 20.8558 6.66837 20.6727C3.46083 19.0914 1.25 15.8043 1.25 12C1.25 8.19571 3.46083 4.90855 6.66837 3.32729C7.03989 3.14413 7.48954 3.29683 7.6727 3.66836ZM16.3273 3.66836C16.5105 3.29683 16.9601 3.14413 17.3316 3.32729C20.5392 4.90855 22.75 8.19571 22.75 12C22.75 15.8043 20.5392 19.0914 17.3316 20.6727C16.9601 20.8558 16.5105 20.7031 16.3273 20.3316C16.1441 19.9601 16.2969 19.5104 16.6684 19.3273C19.3877 17.9867 21.25 15.2066 21.25 12C21.25 8.79333 19.3877 6.01327 16.6684 4.67268C16.2969 4.48953 16.1441 4.03988 16.3273 3.66836ZM8.59913 7.54948C8.84794 7.88064 8.78118 8.3508 8.45002 8.5996C7.41628 9.37627 6.75 10.6102 6.75 12C6.75 13.3898 7.41628 14.6237 8.45002 15.4004C8.78118 15.6492 8.84794 16.1193 8.59913 16.4505C8.35033 16.7817 7.88017 16.8484 7.54901 16.5996C6.1544 15.5518 5.25 13.8814 5.25 12C5.25 10.1186 6.1544 8.44816 7.54901 7.40036C7.88017 7.15156 8.35033 7.21832 8.59913 7.54948ZM15.4009 7.54948C15.6497 7.21832 16.1198 7.15156 16.451 7.40036C17.8456 8.44816 18.75 10.1186 18.75 12C18.75 13.8814 17.8456 15.5518 16.451 16.5996C16.1198 16.8484 15.6497 16.7817 15.4009 16.4505C15.1521 16.1193 15.2188 15.6492 15.55 15.4004C16.5837 14.6237 17.25 13.3898 17.25 12C17.25 10.6102 16.5837 9.37627 15.55 8.5996C15.2188 8.3508 15.1521 7.88064 15.4009 7.54948ZM10.75 12C10.75 11.3096 11.3096 10.75 12 10.75C12.6904 10.75 13.25 11.3096 13.25 12C13.25 12.6903 12.6904 13.25 12 13.25C11.3096 13.25 10.75 12.6903 10.75 12ZM12 9.24998C10.4812 9.24998 9.25 10.4812 9.25 12C9.25 13.5188 10.4812 14.75 12 14.75C13.5188 14.75 14.75 13.5188 14.75 12C14.75 10.4812 13.5188 9.24998 12 9.24998Z" fill="#04ABF2"></path></svg>`,
    },
  ];

  const authItems = [
    {
      path: "/your_profile/my_videos",
      name: "Your profile",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="3.5" cy="3.5" r="3.5" transform="matrix(1 0 0 -1 10.5 14)" stroke="#A2A8B7" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M22.1651 25.52C24.1785 25.0024 25.6663 23.175 25.6663 21V7.00001C25.6663 4.42268 23.577 2.33334 20.9997 2.33334H6.99968C4.42235 2.33334 2.33301 4.42268 2.33301 7.00001V21C2.33301 23.175 3.82088 25.0024 5.8343 25.52M22.1651 25.52C21.7926 25.6158 21.4021 25.6667 20.9997 25.6667H6.99967C6.59729 25.6667 6.2068 25.6158 5.8343 25.52M22.1651 25.52C22.0868 21.0773 18.461 17.5 13.9997 17.5C9.53835 17.5 5.91255 21.0773 5.8343 25.52" stroke="#A2A8B7" stroke-width="1.5"/>
</svg>
`,
    },
    {
      path: "/history",
      name: "History",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.3333 7.00002H24.5M16.3333 12.8333H24.5M3.5 18.6667H24.5M3.5 24.5H24.5M6.87683 13.4783L10.9927 11.4203C12.7124 10.5605 12.7125 8.10624 10.9927 7.24635L6.87684 5.18843C5.3254 4.41272 3.5 5.54087 3.5 7.27543V11.3913C3.5 13.1258 5.3254 14.254 6.87683 13.4783Z" stroke="#A2A8B7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
    },
    {
      path: "/your_profile/subscriptions",
      name: "Your subscriptions",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 25.6666C20.4433 25.6666 25.6667 20.4433 25.6667 14C25.6667 7.55666 20.4433 2.33331 14 2.33331" stroke="#A2A8B7" stroke-width="1.5" stroke-linecap="round"/>
<path d="M13.9997 25.6666C7.55635 25.6666 2.33301 20.4433 2.33301 14C2.33301 7.55666 7.55635 2.33331 13.9997 2.33331" stroke="#A2A8B7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.5 3"/>
<path d="M15.75 14C15.75 14.9665 14.9665 15.75 14 15.75C13.0335 15.75 12.25 14.9665 12.25 14C12.25 13.0335 13.0335 12.25 14 12.25C14.9665 12.25 15.75 13.0335 15.75 14Z" stroke="#A2A8B7" stroke-width="1.5"/>
<path d="M14 15.75L14 17.7917V18.6667" stroke="#A2A8B7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 7V9.91667L14 12.25" stroke="#A2A8B7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
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
                        {/* <img src={upload} alt="" /> */}
                        <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="Icon/Upload/Outline">
                            <path id="Vector 345" d="M8 4.5L10.5 2M10.5 2L13 4.5M10.5 2V12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path id="Vector 355" d="M6.75 7V7C4.67893 7 3 8.67893 3 10.75V13C3 15.2091 4.79086 17 7 17H14C16.2091 17 18 15.2091 18 13V10.75C18 8.67893 16.3211 7 14.25 7V7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                        <path d="M13.3334 4.99984C13.3334 3.15889 11.841 1.6665 10 1.6665C8.15907 1.6665 6.66669 3.15889 6.66669 4.99984" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M3.8017 7.91988C4.01022 6.25179 5.42822 5 7.1093 5H12.8907C14.5718 5 15.9898 6.25179 16.1983 7.91988L17.0317 14.5865C17.2804 16.5761 15.7291 18.3333 13.7241 18.3333H6.27596C4.27097 18.3333 2.71968 16.5761 2.96837 14.5865L3.8017 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                        <path d="M7.5 13.3335C9.46345 14.4505 10.5396 14.4387 12.5 13.3335" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>


                      <span className="basket_items_count">{totalUniqueItems}</span>
                    </NavLink>
                    <div
                      className="upload ntf"
                      onClick={toggleNotificationOptions}
                    >
                      {/* <img src={Notification} alt="" /> */}
                      <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.22647 3.39111C6.88616 3.74444 5.01449 5.67732 4.73307 8.16156L4.44567 10.6986C4.37426 11.329 4.11876 11.9223 3.71295 12.3999C2.85178 13.4135 3.55072 14.9999 4.85849 14.9999H15.1416C16.4494 14.9999 17.1483 13.4135 16.2871 12.3999C15.8813 11.9223 15.6258 11.329 15.5544 10.6986L15.3645 9.02215M12.5 16.6665C12.1361 17.6375 11.1542 18.3332 10 18.3332C8.84585 18.3332 7.86394 17.6375 7.50004 16.6665" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                        <circle cx="14" cy="4" r="2.4" stroke="white" stroke-width="1.2" />
                      </svg>


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
                      {/* <img src={Chat} alt="" /> */}

                      <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.8333 2.5H9.16663C5.02449 2.5 1.66663 5.85786 1.66663 10V14.1667C1.66663 16.0076 3.15901 17.5 4.99996 17.5H10.8333C14.9754 17.5 18.3333 14.1421 18.3333 10C18.3333 5.85786 14.9754 2.5 10.8333 2.5Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
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
                  <button onClick={toggleMenu} className="toggle-button">

                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="Icon/Burger menu">
                        <path id="Vector" d="M3.33325 5H16.6666M3.33325 10.3333H16.6666M3.33325 15.6667H16.6666" stroke="var(--textColor)" stroke-width="1.5" stroke-linecap="round" />
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
                <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible} setIsNotificationOptionsVisible={setIsNotificationOptionsVisible} />
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
                          <path d="M13.3334 4.99984C13.3334 3.15889 11.841 1.6665 10 1.6665C8.15907 1.6665 6.66669 3.15889 6.66669 4.99984" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M3.8017 7.91988C4.01022 6.25179 5.42822 5 7.1093 5H12.8907C14.5718 5 15.9898 6.25179 16.1983 7.91988L17.0317 14.5865C17.2804 16.5761 15.7291 18.3333 13.7241 18.3333H6.27596C4.27097 18.3333 2.71968 16.5761 2.96837 14.5865L3.8017 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                          <path d="M7.5 13.3335C9.46345 14.4505 10.5396 14.4387 12.5 13.3335" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                        <span className="basket_items_count">{totalUniqueItems}</span>
                      </NavLink>
                      <div className="upload-container">
                        <div className="upload " onClick={toggleUploadOptions}>
                          {/* <img src={upload} alt="" /> */}
                          <svg width="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="Icon/Upload/Outline">
                              <path id="Vector 345" d="M8 4.5L10.5 2M10.5 2L13 4.5M10.5 2V12" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path id="Vector 355" d="M6.75 7V7C4.67893 7 3 8.67893 3 10.75V13C3 15.2091 4.79086 17 7 17H14C16.2091 17 18 15.2091 18 13V10.75C18 8.67893 16.3211 7 14.25 7V7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                      <button className="sm_ntf">
                        {/* <img src={Notification} alt="" /> */}
                        <svg width="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.22647 3.39111C6.88616 3.74444 5.01449 5.67732 4.73307 8.16156L4.44567 10.6986C4.37426 11.329 4.11876 11.9223 3.71295 12.3999C2.85178 13.4135 3.55072 14.9999 4.85849 14.9999H15.1416C16.4494 14.9999 17.1483 13.4135 16.2871 12.3999C15.8813 11.9223 15.6258 11.329 15.5544 10.6986L15.3645 9.02215M12.5 16.6665C12.1361 17.6375 11.1542 18.3332 10 18.3332C8.84585 18.3332 7.86394 17.6375 7.50004 16.6665" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                          <circle cx="14" cy="4" r="2.4" stroke="white" stroke-width="1.2" />
                        </svg>

                      </button>
                      <NavLink
                        className="upload msg"
                        to="/chat"
                        activeclassname="active"
                      >
                        {/* <img src={Chat} alt="" /> */}

                        <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.8333 2.5H9.16663C5.02449 2.5 1.66663 5.85786 1.66663 10V14.1667C1.66663 16.0076 3.15901 17.5 4.99996 17.5H10.8333C14.9754 17.5 18.3333 14.1421 18.3333 10C18.3333 5.85786 14.9754 2.5 10.8333 2.5Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
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
              <Search setIsUploadOptionsVisible={setIsUploadOptionsVisible} setIsNotificationOptionsVisible={setIsNotificationOptionsVisible} />
              <div className="d-flex gap-2">
                <div className="filter">
                  {/* <img src={filter} alt="" /> */}
                  <svg width="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Icon/Filter">
                      <path id="Vector" d="M2.5 4.16667H8.33333M8.33333 4.16667C8.33333 5.08714 9.07953 5.83333 10 5.83333C10.9205 5.83333 11.6667 5.08714 11.6667 4.16667M8.33333 4.16667C8.33333 3.24619 9.07953 2.5 10 2.5C10.9205 2.5 11.6667 3.24619 11.6667 4.16667M2.5 10H10M15.8333 10H17.5M15.8333 10C15.8333 10.9205 15.0871 11.6667 14.1667 11.6667C13.2462 11.6667 12.5 10.9205 12.5 10C12.5 9.07953 13.2462 8.33333 14.1667 8.33333C15.0871 8.33333 15.8333 9.07953 15.8333 10ZM11.6667 4.16667H17.5M10 15.8333H17.5M2.5 15.8333H4.16667M4.16667 15.8333C4.16667 16.7538 4.91286 17.5 5.83333 17.5C6.75381 17.5 7.5 16.7538 7.5 15.8333C7.5 14.9129 6.75381 14.1667 5.83333 14.1667C4.91286 14.1667 4.16667 14.9129 4.16667 15.8333Z" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                    </g>
                  </svg>

                </div>
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
                        <path d="M13.3334 4.99984C13.3334 3.15889 11.841 1.6665 10 1.6665C8.15907 1.6665 6.66669 3.15889 6.66669 4.99984" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M3.8017 7.91988C4.01022 6.25179 5.42822 5 7.1093 5H12.8907C14.5718 5 15.9898 6.25179 16.1983 7.91988L17.0317 14.5865C17.2804 16.5761 15.7291 18.3333 13.7241 18.3333H6.27596C4.27097 18.3333 2.71968 16.5761 2.96837 14.5865L3.8017 7.91988Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
                        <path d="M7.5 13.3335C9.46345 14.4505 10.5396 14.4387 12.5 13.3335" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>


                      <span className="basket_items_count">{totalUniqueItems}</span>
                    </NavLink>

                    <button className="sm_ntf">
                      {/* <img src={Notification} alt="" /> */}
                      <svg width="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.22647 3.39111C6.88616 3.74444 5.01449 5.67732 4.73307 8.16156L4.44567 10.6986C4.37426 11.329 4.11876 11.9223 3.71295 12.3999C2.85178 13.4135 3.55072 14.9999 4.85849 14.9999H15.1416C16.4494 14.9999 17.1483 13.4135 16.2871 12.3999C15.8813 11.9223 15.6258 11.329 15.5544 10.6986L15.3645 9.02215M12.5 16.6665C12.1361 17.6375 11.1542 18.3332 10 18.3332C8.84585 18.3332 7.86394 17.6375 7.50004 16.6665" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                        <circle cx="14" cy="4" r="2.4" stroke="white" stroke-width="1.2" />
                      </svg>

                    </button>


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