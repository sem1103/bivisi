import React from "react";
import "./style.scss";
import { NavLink } from "react-router-dom";
const Categories = () => {
  return (
    <>
      <section className="profile_categories container-fluid">
        <NavLink to="/your_profile/my_videos" activeclassname="active">
          My video
        </NavLink>
        <NavLink activeclassname="active" to="/your_profile/shorts">
          Shorts
        </NavLink>
        <NavLink activeclassname="active" to="/your_profile/liked_videos">
          Liked videos
        </NavLink>
        <NavLink activeclassname="active" to="/your_profile/favorites">
          Favorites
        </NavLink>
        <NavLink activeclassname="active" to="/your_profile/about">
          About
        </NavLink>
      </section>
    </>
  );
};

export default Categories;
