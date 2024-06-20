import React, { useRef, useState } from 'react';
import './style.scss'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import delete_img from "../../../../assets/icons/delete.svg";
import edit from "../../../../assets/icons/edit.svg";


const ChannelsShort = () => {

  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    setShowMenu(!showMenu);
  };
  return (
    <div className="col-lg-3 col-md-4 col-sm-12 col-12 p-3">
      <div className='channels_shortcard'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="wrapper">
          <div className="main">
            <img
              className={`coverImage ${isHovered ? "hidden" : ""}`}
              src="https://bivisi-media.s3.amazonaws.com/Accounts/Cover-images/dYWElM4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATCKAOUIJN6CUS7GS%2F20240615%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T095246Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d0aa16860d9ddcb3326e543c5818c52ba91c4b6be7bcdeddbdde65319927c34d"
              alt="cover"
            />
            <HiOutlineDotsHorizontal
              className="menu-icon"
            onClick={toggleMenu}
            />
            <div  ref={menuRef} className={`menu ${showMenu ? "open" : ""}`}>
              <button onClick={(e) => handleMenuActionClick("Edit", e)}>
                <img src={edit} alt="" />
              </button>
              <button onClick={(e) => handleMenuActionClick("Delete", e)}>
                <img src={delete_img} alt="" />
              </button>
            </div>
          </div>
          <div className="shortCard-content">
            <div className="text">
              <p>fdeeg</p>
              <span>5651$</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelsShort