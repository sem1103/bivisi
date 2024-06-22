import React from 'react'
import './style.scss'
import { NavLink, useParams } from 'react-router-dom'
const Categories = ({ username }) => {
  // const { username } = useParams();
  console.log(username);
  return (
    <div className="channels_categories container-fluid">
      <NavLink to={`/channels_detail/channels_videos/${username}`} activeclassname="active">
        My video
      </NavLink>
      <NavLink activeclassname="active" to="/channels_detail/channels_shorts">
        Shorts
      </NavLink>
      <NavLink activeclassname="active" to="/channels_detail/about">
        About
      </NavLink>
    </div>
  )
}

export default Categories