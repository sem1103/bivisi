import React, { useContext } from "react";
import "./style.scss";
import Main from "../../components/Main";
import Categories from "../../components/Categories";
import mail from "../../../../assets/icons/mail.svg";
import whatsapp from "../../../../assets/icons/Whatsapp.svg";
import call from "../../../../assets/icons/call.svg";
import { AuthContext } from "../../../../context/authContext";

const About = () => {
  const { userDetails } = useContext(AuthContext);
  return (
    <>
      <Main />
      <Categories />
      <div className="my_about_profile">
        <div className="container-fluid">
          <div className="pt-3">
            {userDetails?.bio ? (
              <>
                <h3>About</h3>
                <p>{userDetails?.bio}</p>
              </>
            ) : (
              ""
            )}
          </div>

          <div className="my_about_info pt-4">
            <h5>Contact information</h5>

            <div className="mt-4">
              <div className="d-flex align-items-center gap-3">
                <img src={mail} alt="" />
                <span>{userDetails?.email}</span>
              </div>

              <div className="d-flex align-items-center gap-3 mt-2">
                <img src={call} alt="" />
                <span>+994 12 345 67 89</span>
              </div>

              <div className="d-flex align-items-center gap-3 mt-2">
                <img src={whatsapp} alt="" />
                <span>+994 12 345 67 89</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
