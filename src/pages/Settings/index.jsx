import React, { useContext, useRef, useState , useEffect} from "react";
import GeneralSettings from "./components/General";
import ProfileInformation from "./components/ProfileInfo";
import Privacy from "./components/Privacy";
import Password from "./components/Password";
import Balance from "./components/Balance";
import DeleteAccount from "./components/DeleteAccount";
import User from "./icons/User.svg";
import SettingsIcon from "./icons/SettingOutline.svg";
import Lock from "./icons/Lock.svg";
import Trash from "./icons/Trash.svg";
import PrivacyIcon from "./icons/Privacy.svg";
import MoneyBag from "./icons/MoneyBag.svg";
import "./style.scss";
import { AuthContext } from "../../context/authContext";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const {userDetails} = useContext(AuthContext)
  const passwordChangeRef = useRef(null);

  useEffect(() => {
    passwordChangeRef.current.disabled = 
      userDetails?.sign_up_method === 'facebook' || 
      userDetails?.sign_up_method === 'google';
  }, [userDetails]);

  const renderContent = () => {
    if((userDetails?.sign_up_method === 'facebook' || userDetails?.sign_up_method === 'google') && activeTab == 'password') return
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "profile":
        return <ProfileInformation />;
      case "privacy":
        return <Privacy />;
      case "password":
        return <Password />;
      case "balance":
        return <Balance />;
      case "delete":
        return <DeleteAccount />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <section className="settings-container">
      <div className="settings_sidebar">
      <h1>Settings</h1>
      <ul>
       
       <li
         className={activeTab === "general" ? "active" : ""}
         onClick={() => setActiveTab("general")}
       >
         <button>
         <img src={SettingsIcon} alt="" />
         General
         </button>
       </li>
       <li
         className={activeTab === "profile" ? "active" : ""}
         onClick={() => setActiveTab("profile")}
       >
         <button>
         <img src={User} alt="" />
         Profile Information
         </button>
       </li>
       <li
         className={activeTab === "privacy" ? "active" : ""}
         onClick={() => setActiveTab("privacy")}
       >
        <button>
        <img src={PrivacyIcon} alt="" />
        Privacy
        </button>
       </li>
       <li
         className={activeTab === "password" ? "active" : ""}
         onClick={() => setActiveTab("password")}
       >
        <button ref={passwordChangeRef}>
        <img src={Lock} alt="" />
        Password
        </button>
       </li>
       <li
         className={activeTab === "balance" ? "active" : ""}
         onClick={() => setActiveTab("balance")}
       >
       <button>
       <img src={MoneyBag} alt="" />
       Balance
       </button>
       </li>
       <li
         className={activeTab === "delete" ? "active" : ""}
         onClick={() => setActiveTab("delete")}
       >
        <button>
        <img src={Trash} alt="" />
        Delete Account
        </button>
       </li>
     </ul>
      </div>
      
      <div className="content">{renderContent()}</div>
    </section>
  );
};

export default Settings;
