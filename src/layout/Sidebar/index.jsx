import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./style.scss";
import logo from "../../assets/images/logoLight.svg";
import rightIcon from "../../assets/images/rightIcon.svg";
import leftIcon from "../../assets/images/leftIcon.svg";
import cameraOutline from "./icons/camera-outline.svg";
import helpOutline from "./icons/help-outline.svg";
import home from "./icons/home.svg";
import shortsOutline from "./icons/shorts-outline.svg";
import starOutline from "./icons/star-outline.svg";
import trendOutline from "./icons/trend-outline.svg";
import videoOutline from "./icons/video-outline.svg";
import historyOutline from "./icons/history-outline.svg";
import userOutline from "./icons/userOutline.svg";
import subscribeOutline from "./icons/subscribeOutline.svg";
import boardOutline from "./icons/board_outline.svg";
import { AuthContext } from "../../context/authContext";

const Sidebar = ({ children, isOpen, setIsOpen }) => {
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();
  const { user } = useContext(AuthContext);
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

  return (
    <div className="d-flex">
      <div className="d-none d-lg-block d-xl-block d-lg-block  b_container">
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
              <img src={logo} alt="" className="logo" />
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
                    <img src={item.icon} alt="" />
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
                        <img src={item.icon} alt="" />
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
                      <img src={item.icon} alt="" />
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
                    <img src={helpOutline} alt="" />
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
