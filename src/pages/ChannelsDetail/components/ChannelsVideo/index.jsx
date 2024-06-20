import React from 'react'
import './style.scss'
import blueHeartd from "../../../../assets/icons/blue-heart.svg";
import edit from "../../../../assets/icons/edit.svg";
import trash from "../../../../assets/icons/trash.svg";
import { NavLink } from 'react-router-dom';

const ChannelsVideo = () => {
  return (
    <>
      <div className='col-lg-4 pb-3'>
        <div className='channels_videocard'>
          <img src="https://bivisi-media.s3.amazonaws.com/Accounts/Cover-images/dYWElM4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATCKAOUIJN6CUS7GS%2F20240615%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240615T095246Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=d0aa16860d9ddcb3326e543c5818c52ba91c4b6be7bcdeddbdde65319927c34d" alt="" className="main" />

          <NavLink className="heading">
            <h1>Bivisi Company</h1>
            <h6>
              <img src={blueHeartd} alt="" />
              45
            </h6>
          </NavLink>
          <p>Lorem ipsum dolor sit amet consectetur</p>
          <div className="cardBottom">
            <span>1000</span>
            <div className="icons">
              <NavLink >
                <img src={edit} alt="" />
              </NavLink>
              <button>
                <img src={trash} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChannelsVideo