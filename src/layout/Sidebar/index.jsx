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
                <img src={rightIcon} alt="" className="bars" />
              ) : (
                <img
                  src={leftIcon}
                  alt=""
                  className="bars"
                  style={{ marginLeft: "6x" }}
                />
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
