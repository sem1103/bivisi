import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import logoLightMode from "../../assets/images/logoLightMode.png";

import rightIcon from "../../assets/images/rightIcon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";
import cameraOutline from "./icons/camera-outline.svg";
import helpOutline from "./icons/help-outline.svg";
import home from "./icons/home.svg";
import shortsOutline from "./icons/shorts-outline.svg";
import starOutline from "./icons/star-outline.svg";
import trendOutline from "./icons/trend-outline.svg";
import videoOutline from "./icons/video-outline.svg";
import liveStreemIcon from "./icons/live-streem.svg";

import historyOutline from "./icons/history-outline.svg";
import userOutline from "./icons/userOutline.svg";
import subscribeOutline from "./icons/subscribeOutline.svg";
import boardOutline from "./icons/board_outline.svg";
import { AuthContext } from "../../context/authContext";
import { ThemeContext } from "../../context/ThemeContext";

const Sidebar = ({ children, isOpen, setIsOpen }) => {
  const {themeMode} = useContext(ThemeContext)
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const { user } = useContext(AuthContext);
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
<path d="M2.3335 9.33329C2.3335 6.75596 4.42283 4.66663 7.00016 4.66663H15.1668C17.7442 4.66663 19.8335 6.75596 19.8335 9.33329V18.6666C19.8335 21.244 17.7442 23.3333 15.1668 23.3333H7.00016C4.42283 23.3333 2.3335 21.244 2.3335 18.6666V9.33329Z" stroke="#A2A8B7" strokeWidth="1.5"/>
<path d="M19.8335 10.8888L21.6312 8.97125C23.078 7.42809 25.6668 8.45186 25.6668 10.5671V17.4328C25.6668 19.5481 23.078 20.5718 21.6312 19.0287L19.8335 17.1111V10.8888Z" stroke="#A2A8B7" strokeWidth="1.5"/>
<path d="M15.1668 11.6666C15.1668 12.9553 14.1222 14 12.8335 14C11.5448 14 10.5002 12.9553 10.5002 11.6666C10.5002 10.378 11.5448 9.33329 12.8335 9.33329C14.1222 9.33329 15.1668 10.378 15.1668 11.6666Z" stroke="#A2A8B7" strokeWidth="1.5"/>
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
<path id="Vector" d="M8.16634 8.16671H19.833M8.16634 14H13.9997M18.6663 19.8334L22.1663 25.6667M9.33301 19.8334L5.83301 25.6667M13.9997 19.8334V23.3334M22.1663 2.33338L5.83301 2.33337C3.90001 2.33337 2.33301 3.90038 2.33301 5.83337L2.33301 16.3334C2.33301 18.2664 3.90001 19.8334 5.83301 19.8334L22.1663 19.8334C24.0993 19.8334 25.6663 18.2664 25.6663 16.3334L25.6663 5.83338C25.6663 3.90038 24.0993 2.33338 22.1663 2.33338Z" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"/>
</g>
</svg>
`,
    },
    {
      path: "/popular_channels",
      name: "Popular Channels",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Star/Outline">
<path id="Star 2" d="M11.7051 3.81669C12.6439 1.83894 15.3564 1.83893 16.2952 3.81668L17.9177 7.23475C18.2905 8.02011 19.0111 8.56447 19.8447 8.69041L23.4727 9.23852C25.5719 9.55566 26.4102 12.2378 24.8911 13.7773L22.2659 16.4379C21.6627 17.0492 21.3874 17.93 21.5298 18.7932L22.1496 22.55C22.5082 24.7238 20.3137 26.3814 18.4361 25.3551L15.1911 23.5814C14.4455 23.1739 13.5548 23.1739 12.8092 23.5814L9.56422 25.3551C7.68662 26.3814 5.49216 24.7238 5.85075 22.55L6.47048 18.7932C6.61288 17.93 6.33763 17.0492 5.73443 16.4379L3.10918 13.7773C1.59017 12.2378 2.42838 9.55566 4.5276 9.23852L8.1556 8.69041C8.9892 8.56447 9.70982 8.02011 10.0826 7.23475L11.7051 3.81669Z" stroke="#A2A8B7" strokeWidth="1.5" stroke-linejoin="round"/>
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
<circle cx="3.5" cy="3.5" r="3.5" transform="matrix(1 0 0 -1 10.5 14)" stroke="#A2A8B7" strokeWidth="1.5" stroke-linejoin="round"/>
<path d="M22.1651 25.52C24.1785 25.0024 25.6663 23.175 25.6663 21V7.00001C25.6663 4.42268 23.577 2.33334 20.9997 2.33334H6.99968C4.42235 2.33334 2.33301 4.42268 2.33301 7.00001V21C2.33301 23.175 3.82088 25.0024 5.8343 25.52M22.1651 25.52C21.7926 25.6158 21.4021 25.6667 20.9997 25.6667H6.99967C6.59729 25.6667 6.2068 25.6158 5.8343 25.52M22.1651 25.52C22.0868 21.0773 18.461 17.5 13.9997 17.5C9.53835 17.5 5.91255 21.0773 5.8343 25.52" stroke="#A2A8B7" strokeWidth="1.5"/>
</svg>
`,
    },
    {
      path: "/history",
      name: "History",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.3333 7.00002H24.5M16.3333 12.8333H24.5M3.5 18.6667H24.5M3.5 24.5H24.5M6.87683 13.4783L10.9927 11.4203C12.7124 10.5605 12.7125 8.10624 10.9927 7.24635L6.87684 5.18843C5.3254 4.41272 3.5 5.54087 3.5 7.27543V11.3913C3.5 13.1258 5.3254 14.254 6.87683 13.4783Z" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"/>
</svg>
`,
    },
    {
      path: "/your_profile/subscriptions",
      name: "Your subscriptions",
      icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 25.6666C20.4433 25.6666 25.6667 20.4433 25.6667 14C25.6667 7.55666 20.4433 2.33331 14 2.33331" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M13.9997 25.6666C7.55635 25.6666 2.33301 20.4433 2.33301 14C2.33301 7.55666 7.55635 2.33331 13.9997 2.33331" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" stroke-dasharray="0.5 3"/>
<path d="M15.75 14C15.75 14.9665 14.9665 15.75 14 15.75C13.0335 15.75 12.25 14.9665 12.25 14C12.25 13.0335 13.0335 12.25 14 12.25C14.9665 12.25 15.75 13.0335 15.75 14Z" stroke="#A2A8B7" strokeWidth="1.5"/>
<path d="M14 15.75L14 17.7917V18.6667" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"/>
<path d="M14 7V9.91667L14 12.25" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"/>
</svg>
`,
    },
  ];

  return (
    <div className="d-flex">
      <div className="d-none d-xl-block  b_container">
        <div
          style={{ width: isOpen ? "300px" : "113px" }}
          className={
            location.pathname == "/login" ||
              location.pathname == "/register" ||
              location.pathname == "/reset_password" ||
              location.pathname == "/404" ||
              location.pathname == "/user/verify-otp" ||
              location.pathname == "/user/reset-password" ||
              location.pathname == "/basket" ||
              location.pathname == "/payment"
              ? "none"
              : "sidebar"
          }
        >
          <div className="top_section mb-3">
            <button onClick={toggle}>
              {isOpen ? (
                // <img src={rightIcon} alt="" className="bars" />
                <svg className="bars" style={{ marginRight: "25px" }} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 276.167 276.167"> <g fill="currentColor"><path d="M33.144,2.471C15.336,2.471,0.85,16.958,0.85,34.765s14.48,32.293,32.294,32.293s32.294-14.486,32.294-32.293 S50.951,2.471,33.144,2.471z"></path> <path d="M137.663,2.471c-17.807,0-32.294,14.487-32.294,32.294s14.487,32.293,32.294,32.293c17.808,0,32.297-14.486,32.297-32.293 S155.477,2.471,137.663,2.471z"></path> <path d="M243.873,67.059c17.804,0,32.294-14.486,32.294-32.293S261.689,2.471,243.873,2.471s-32.294,14.487-32.294,32.294 S226.068,67.059,243.873,67.059z"></path> <path d="M32.3,170.539c17.807,0,32.297-14.483,32.297-32.293c0-17.811-14.49-32.297-32.297-32.297S0,120.436,0,138.246 C0,156.056,14.493,170.539,32.3,170.539z"></path> <path d="M136.819,170.539c17.804,0,32.294-14.483,32.294-32.293c0-17.811-14.478-32.297-32.294-32.297 c-17.813,0-32.294,14.486-32.294,32.297C104.525,156.056,119.012,170.539,136.819,170.539z"></path> <path d="M243.038,170.539c17.811,0,32.294-14.483,32.294-32.293c0-17.811-14.483-32.297-32.294-32.297 s-32.306,14.486-32.306,32.297C210.732,156.056,225.222,170.539,243.038,170.539z"></path> <path d="M33.039,209.108c-17.807,0-32.3,14.483-32.3,32.294c0,17.804,14.493,32.293,32.3,32.293s32.293-14.482,32.293-32.293 S50.846,209.108,33.039,209.108z"></path> <path d="M137.564,209.108c-17.808,0-32.3,14.483-32.3,32.294c0,17.804,14.487,32.293,32.3,32.293 c17.804,0,32.293-14.482,32.293-32.293S155.368,209.108,137.564,209.108z"></path> <path d="M243.771,209.108c-17.804,0-32.294,14.483-32.294,32.294c0,17.804,14.49,32.293,32.294,32.293 c17.811,0,32.294-14.482,32.294-32.293S261.575,209.108,243.771,209.108z"></path> </g></svg>
              ) : (
                // <img
                //   src={leftIcon}
                //   alt=""
                //   className="bars"
                //   style={{ marginLeft: "6x" }}
                // />

                <svg className="bars" style={{ marginLeft: "15px" }} xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 276.167 276.167"> <g fill="currentColor"><path d="M33.144,2.471C15.336,2.471,0.85,16.958,0.85,34.765s14.48,32.293,32.294,32.293s32.294-14.486,32.294-32.293 S50.951,2.471,33.144,2.471z"></path> <path d="M137.663,2.471c-17.807,0-32.294,14.487-32.294,32.294s14.487,32.293,32.294,32.293c17.808,0,32.297-14.486,32.297-32.293 S155.477,2.471,137.663,2.471z"></path> <path d="M243.873,67.059c17.804,0,32.294-14.486,32.294-32.293S261.689,2.471,243.873,2.471s-32.294,14.487-32.294,32.294 S226.068,67.059,243.873,67.059z"></path> <path d="M32.3,170.539c17.807,0,32.297-14.483,32.297-32.293c0-17.811-14.49-32.297-32.297-32.297S0,120.436,0,138.246 C0,156.056,14.493,170.539,32.3,170.539z"></path> <path d="M136.819,170.539c17.804,0,32.294-14.483,32.294-32.293c0-17.811-14.478-32.297-32.294-32.297 c-17.813,0-32.294,14.486-32.294,32.297C104.525,156.056,119.012,170.539,136.819,170.539z"></path> <path d="M243.038,170.539c17.811,0,32.294-14.483,32.294-32.293c0-17.811-14.483-32.297-32.294-32.297 s-32.306,14.486-32.306,32.297C210.732,156.056,225.222,170.539,243.038,170.539z"></path> <path d="M33.039,209.108c-17.807,0-32.3,14.483-32.3,32.294c0,17.804,14.493,32.293,32.3,32.293s32.293-14.482,32.293-32.293 S50.846,209.108,33.039,209.108z"></path> <path d="M137.564,209.108c-17.808,0-32.3,14.483-32.3,32.294c0,17.804,14.487,32.293,32.3,32.293 c17.804,0,32.293-14.482,32.293-32.293S155.368,209.108,137.564,209.108z"></path> <path d="M243.771,209.108c-17.804,0-32.294,14.483-32.294,32.294c0,17.804,14.49,32.293,32.294,32.293 c17.811,0,32.294-14.482,32.294-32.293S261.575,209.108,243.771,209.108z"></path> </g></svg>
              )}
            </button>
            <Link to="/" style={{ display: isOpen ? "block" : "none" }}>
             {themeMode ? 
             <img src={logoLightMode} alt="" className="logo" />
             :
             <img src={logo} alt="" className="logo" /> }
            </Link>
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
                    to={item.path}
                    key={index}
                    className="menu-item"
                    activeclassname="active"
                    style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                  >
                   <div
        className="menu-icon"
        dangerouslySetInnerHTML={{ __html: item.icon }}
      />
                    <span style={{ display: isOpen ? "block" : "none" }}>
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
                        <span style={{ display: isOpen ? "block" : "none" }}>
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
                      <span style={{ display: isOpen ? "block" : "none" }}>
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
                    to="/help"
                    className="menu-item"
                    activeclassname="active"
                    style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                  >
                    <div className="menu-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Icon/Help/Outline">
<path id="Vector" d="M11.6667 10.5C11.6667 9.21134 12.7113 8.16667 14 8.16667C15.2887 8.16667 16.3333 9.21134 16.3333 10.5C16.3333 10.9645 16.1976 11.3973 15.9636 11.7609C15.2663 12.8446 14 13.878 14 15.1667V15.75M14 18.6667V19.8333M3.5 10.654V17.3461C3.5 19.1233 4.42436 20.7656 5.92487 21.6542L11.5751 25.0003C13.0756 25.8889 14.9244 25.8889 16.4249 25.0003L22.0751 21.6542C23.5756 20.7656 24.5 19.1233 24.5 17.3461V10.654C24.5 8.87674 23.5756 7.23453 22.0751 6.34592L16.4249 2.99983C14.9244 2.11122 13.0756 2.11122 11.5751 2.99983L5.92487 6.34592C4.42436 7.23452 3.5 8.87674 3.5 10.654Z" stroke="#A2A8B7" strokeWidth="1.5" strokeLinecap="round"/>
</g>
</svg>
                    </div>

                    <span style={{ display: isOpen ? "block" : "none" }}>
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
                <NavLink to="/faq">FAQs</NavLink>
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

      <main style={{ overflowX: "hidden" }}>{children}</main>
    </div>
  );
};

export default Sidebar;
