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
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const ProfileMenu = () => {
  const {i18n, t} = useTranslation(['topHeader']);
  const { setTheme} = useContext(ThemeContext)
  const { userDetails, logoutUser } = useContext(AuthContext);
  const [themeMode, setThemeMode] = useState(localStorage.themeMode ? JSON.parse(localStorage.themeMode) : false)
  const [menuOpened, setMenuOpened] = useState(false);
  const menuRef = useRef(null);
  const themeSwitcher = useRef(null)
  const handleMenuClose = () => {
    setMenuOpened(false);
  };
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      handleMenuClose();
    }
  };
  const [showLangs, setShowLangs] = useState(false);
  const activeLocalLang = localStorage.i18nextLng
  const [activeShowLang, setActiveShowLang] = useState(activeLocalLang == 'en' ? 'English' : activeLocalLang == 'ru' ? 'Русский' : '')

 
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
    <div className="profile_menu_dropdown" >
      <Menu
      ref={menuRef}
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
            {/* <img src={User} alt="" /> */}

            <svg width={18} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="9.99996" cy="14.5832" rx="5.83333" ry="2.91667" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="9.99996" cy="5.83333" r="3.33333" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
</svg>

          </button>
        </Menu.Target>

        <Menu.Dropdown>
          <div className="profile_sidebar">
            <div className="profile-card">
              <div className="profile-image">
                <Avatar src={userDetails?.avatar} alt="it's me" />
              </div>
              <div className="user-name">
                <div className="name">{userDetails?.username}</div>
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
              <h6>{t('profileMenu.name1')}</h6>
            </NavLink>
            <div className={`profile-menu-item set__lang ${showLangs ? 'active' : ''}`} >
              <button 
              onClick={() => {
                setShowLangs(!showLangs)
              }}
              >
              <img src={langGray} alt="" />
                
                {
                  activeShowLang ? 
                  activeShowLang 
                  :
                  'English'
                }
                
               
              </button>
              <ul className={`${showLangs ? 'show__langs' : ''}`}>
              <li><button
                className={`${activeShowLang == 'English' ? 'active__lang' : ''}`}
                onClick={() => {
                  i18n.changeLanguage('en')
                  setActiveShowLang('English')
                  setShowLangs(!showLangs)
                }}
                >
                  English
                </button>
                </li>
                <li><button
                className={`${activeShowLang == 'Русский' ? 'active__lang' : ''}`}

                onClick={() => {
                  i18n.changeLanguage('ru')
                  setActiveShowLang('Русский')
                  setShowLangs(!showLangs)
                }}
                >
                  Русский
                </button>
                </li>
              </ul>
            </div>
            <NavLink
              to="/settings"
              className="profile-menu-item"
              onClick={handleMenuClose}
            >
              <img src={settingsGray} alt="" />
              <h6>{t('profileMenu.name2')}</h6>
            </NavLink>
            <div className="profile-menu-item align-items-center d-flex justify-content-between mode__switcher" onClick={() => {
                      setTheme(!themeMode, themeSwitcher.current)
                      setThemeMode(!themeMode)
                }}>
              <div className="d-flex align-items-center gap-2">
                <img src={nightmodeGray} alt="" />
                <h6 className="m-0">{t('profileMenu.name3')}</h6>
              </div>
             

<div class="wrapper d-flex">
<input  name="checkbox" class="switch" ref={themeSwitcher} type="checkbox" id="dark-mode-toggle" checked={themeMode} />
</div>
            </div>
            <div className="profile-menu-item mt-2 mb-2" onClick={() => {
              setTheme(false, themeSwitcher.current)
              setThemeMode(false)
              logoutUser()
            }}>
              <img src={logout} alt="" />
              <span>{t('profileMenu.name4')}</span>
            </div>
          </div>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default ProfileMenu;
