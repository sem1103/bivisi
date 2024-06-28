import React from 'react'
import './style.scss'
import MainChannels from './components/Main'
import Categories from './components/Categories'
import { useParams } from 'react-router-dom'
const ChannelsDetail = () => {
  const { username } = useParams();
  return (
    <>
        <MainChannels username={username}/>
        <Categories username={username}/>
    </>
  )
}

export default ChannelsDetail