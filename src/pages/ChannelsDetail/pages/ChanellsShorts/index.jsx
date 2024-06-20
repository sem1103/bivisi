import React from 'react';
import './style.scss'
import MainChannels from '../../components/Main';
import Categories from '../../components/Categories';
import ChannelsShort from '../../components/ChannelsShort'
import { useParams } from 'react-router-dom';
const ChannelsShorts = () => {
  const { username } = useParams();
  return (
    <>
 <MainChannels username={username} />
 <Categories username={username} />

      <div className='channels_shorts'>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 mb-3">
              <h6>Shorts</h6>
            </div>
            <ChannelsShort/>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChannelsShorts