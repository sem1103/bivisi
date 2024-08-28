import React from 'react'
import './style.scss'
import MainChannels from './components/Main'
import Categories from './components/Categories'
import { useLocation, useParams } from 'react-router-dom'
import ChannelsVideos from './pages/ChannelsVideos'
import ChannelsShorts from './pages/ChanellsShorts'
import AboutChanell from './pages/About'
const ChannelsDetail = () => {
  const { username } = useParams();
  const {pathname} = useLocation();
  
  
  
  return (
    <>
        <MainChannels username={username}/>
        <Categories username={username}/>
        {
          pathname.includes('channels_videos') && <ChannelsVideos />
        }
        {
          pathname.includes('channels_shorts') && <ChannelsShorts />
        }
        {
          pathname.includes('about') && <AboutChanell />
        }
   
    </>
  )
}

export default ChannelsDetail