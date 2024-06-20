import React from "react";
import notFound from "../../assets/icons/not_found.svg";
import leftArrow from "../../assets/icons/Left-Arrow.svg";
import "./style.scss";
import { NavLink } from "react-router-dom";
const NotFound = () => {
  return (
    <>
      <section className="notFound">
        <div className="box">
          <h1>Oops!</h1>
          <p>Looks like we couldn't find the page you're looking for.</p>
          <img src={notFound} alt="" />
          <NavLink to="/">
            {" "}
            <img src={leftArrow} alt="" />
            Back to Homepage
          </NavLink>
        </div>
      </section>
    </>
  );
};

export default NotFound;
