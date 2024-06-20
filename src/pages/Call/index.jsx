import React from 'react';
import './style.scss';
import microphone_mute from '../../assets/icons/microphone-mute.svg'

const Call = () => {
  return (
    <div className='call_section py-5'>
      <div className="call_box">
        <div className="call_box_head">
          <img src={microphone_mute} alt="" />
        </div>
        <div className='call_medium'>
          <div className='call_content'>
            <div className='nickname'>
              GS
            </div>
          </div>
        </div>

        <div className='call_footer'>
          <div>
            <p className='nickname'>Giana Schleifer</p>
          </div>

          <div className='video_call'>
            <div className='video_call_head'>
              <img src={microphone_mute} alt="" />
            </div>
            <div className='video_call_medium'>
              <div className='video_content'>
                MG
              </div>
            </div>
            <div>
              <p className='video_nickname mb-0'>Miracle George</p>
            </div>
          </div>
        </div>

      </div>
      <div className='pt-4 call_section_end'>
        <button className='mute_btn'>
          <img src={microphone_mute}  alt="" />
        </button>
        <button className='leave_btn'>Leave</button>
      </div>

    </div>
  )
}

export default Call