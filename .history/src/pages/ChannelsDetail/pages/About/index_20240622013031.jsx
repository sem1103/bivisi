import React from 'react'
import './style.scss'
import MainChannels from '../../components/Main'
import Categories from '../../components/Categories'
import ChannelsVideo from '../../components/ChannelsVideo'
import { useParams } from 'react-router-dom'
const ChannelsVideos = () => {
  const { username } = useParams();
  return (
    <>
      <MainChannels username={username} />
      <Categories username={username} />

      <div className="channels_videos">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 mb-3">
              <h6>Videos</h6>
            </div>
            <ChannelsVideo />
          </div>
        </div>
      </div>

    </>
  )
}

export default ChannelsVideos