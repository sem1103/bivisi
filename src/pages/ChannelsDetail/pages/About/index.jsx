import React from 'react'
import './style.scss'
import MainChannels from '../../components/Main'
import Categories from '../../components/Categories'
import ChannelsVideo from '../../components/ChannelsVideo'
import { useParams } from 'react-router-dom'

const AboutChanell = () => {
  const { username } = useParams();
  return (
    <>
      <div className="channels_videos">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h6>About Chanell</h6>
            </div>
           
          </div>
        </div>
      </div>

    </>
  )
}

export default AboutChanell