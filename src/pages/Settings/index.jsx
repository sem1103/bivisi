import React, { useState } from "react";
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

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
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
      <ul className="settings_sidebar">
        <h1>Settings</h1>
        <li
          className={activeTab === "general" ? "active" : ""}
          onClick={() => setActiveTab("general")}
        >
          <img src={SettingsIcon} alt="" />
          General
        </li>
        <li
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          <img src={User} alt="" />
          Profile Information
        </li>
        <li
          className={activeTab === "privacy" ? "active" : ""}
          onClick={() => setActiveTab("privacy")}
        >
          <img src={PrivacyIcon} alt="" />
          Privacy
        </li>
        <li
          className={activeTab === "password" ? "active" : ""}
          onClick={() => setActiveTab("password")}
        >
          <img src={Lock} alt="" />
          Password
        </li>
        <li
          className={activeTab === "balance" ? "active" : ""}
          onClick={() => setActiveTab("balance")}
        >
          <img src={MoneyBag} alt="" />
          Balance
        </li>
        <li
          className={activeTab === "delete" ? "active" : ""}
          onClick={() => setActiveTab("delete")}
        >
          <img src={Trash} alt="" />
          Delete Account
        </li>
      </ul>
      <div className="content">{renderContent()}</div>
    </section>
  );
};

export default Settings;
