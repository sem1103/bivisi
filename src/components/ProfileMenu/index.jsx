import React, { useContext, useState, useEffect, useRef } from "react";
import { Menu, Avatar } from "@mantine/core";
import "./style.scss";
import userGray from "./icons/user-gray.svg";
import profilePoint from "./icons/profilePoint.svg";
import langGray from "./icons/language-gray.svg";
import settingsGray from "./icons/setting-gray.svg";
import logout from "./icons/logout.svg";
import nightmodeGray from "./icons/nightmode-gray.svg";
import User from "../../assets/icons/User.svg";
import { AuthContext } from "../../context/authContext";
import { NavLink } from "react-router-dom";

const ProfileMenu = () => {
  const { userDetails, logoutUser } = useContext(AuthContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const menuRef = useRef(null);

  const handleMenuClose = () => {
    setMenuOpened(false);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      handleMenuClose();
    }
  };

  useEffect(() => {
    if (menuOpened) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpened]);

  return (
    <div className="profile_menu_dropdown" ref={menuRef}>
      <Menu
        shadow="md"
        width={200}
        transitionProps={{ transition: "rotate-right", duration: 600 }}
        position="bottom-right"
        arrowPosition="center"
        offset={20}
        opened={menuOpened}
        onClose={handleMenuClose}
      >
        <Menu.Target>
          <button className="upload" onClick={() => setMenuOpened((o) => !o)}>
            <img src={User} alt="" />
          </button>
        </Menu.Target>

        <Menu.Dropdown>
          <div className="profile_sidebar">
            <div className="profile-card">
              <div className="profile-image">
                <Avatar src={userDetails?.avatar} alt="it's me" />
              </div>
              <div className="user-name">
                <h1>{userDetails?.username}</h1>
                <p>{userDetails?.email}</p>
              </div>
            </div>
            <div className="user-points">
              <div className="profile-point">
                <img src={profilePoint} alt="" />
              </div>
              <div className="profile-point-content">
                <span>16 Points</span>
                <h2>Points for happy memories</h2>
              </div>
            </div>
            <NavLink
              to="/your_profile/my_videos"
              className="profile-menu-item"
              onClick={handleMenuClose}
            >
              <img src={userGray} alt="" />
              <h6>View profile</h6>
            </NavLink>
            <div className="profile-menu-item">
              <img src={langGray} alt="" />
              <h6>English</h6>
            </div>
            <NavLink
              to="/settings"
              className="profile-menu-item"
              onClick={handleMenuClose}
            >
              <img src={settingsGray} alt="" />
              <h6>Settings</h6>
            </NavLink>
            <div className="profile-menu-item d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img src={nightmodeGray} alt="" />
                <h6 className="m-0">Dark mode</h6>
              </div>
              <div className="dark-mode-switch">
                <input type="checkbox" id="dark-mode-toggle" />
                <label htmlFor="dark-mode-toggle" />
              </div>
            </div>
            <div className="profile-menu-item mt-2 mb-2" onClick={logoutUser}>
              <img src={logout} alt="" />
              <span>Log out</span>
            </div>
          </div>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
