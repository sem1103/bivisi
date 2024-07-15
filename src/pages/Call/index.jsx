import React, { useContext, useEffect, useRef } from 'react';
import './style.scss';
import microphone_mute from '../../assets/icons/microphone-mute.svg'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatContext';




const Call = () => {
  const {setIsAccept} = useContext(ChatContext)
  const callContainer = useRef(null)
  const navigate = useNavigate();
  const isVideoCall = sessionStorage.isVideoCall == 'video';
  let zp = '';

  let myMeeting = async (element) => {
     // generate Kit Token
      const appID = 404449518;
      const serverSecret = "f20de9d53af14b827bdd720d2a0f8410";
      const roomID = window.location.pathname.split('/').reverse()[0];
      const userId = Date.now().toString();
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userId,
        JSON.parse(localStorage.authTokens).username
    );
    zp = ZegoUIKitPrebuilt.create(kitToken);


    const handleUserLeave = (userList) => {
      console.log('User lefts:', userList);
      // Проверяем количество пользователей в комнате
      
    };

    
     // Create instance object from Kit Token.
      // start the call
      zp.joinRoom({
        container: element,
        showPreJoinView: false,
        showLeaveRoomConfirmDialog: false,
        turnOnCameraWhenJoining: isVideoCall,
        showMyCameraToggleButton: isVideoCall,
        showScreenSharingButton: isVideoCall,
        maxUsers: 2,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        
        },
        onLeaveRoom:  () => {
          zp?.destroy();
          navigate('/chat')
      },
        onUserLeave: (users) => {
          users.length == 1 && zp.destroy();
          navigate('/chat')
        },
      });

   

    
  };




  useEffect(() => {

    if (callContainer.current) {
        myMeeting(callContainer.current);

    }

    return () => {
      zp?.destroy()
      setIsAccept(false)
    }
}, []);



  return (
    <div className='call_section py-5' ref={callContainer}>





      {/* <div className="call_box">
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

      </div> */}
      {/* <div className='pt-4 call_section_end'>
        <button className='mute_btn'>
          <img src={microphone_mute}  alt="" />
        </button>
        <button className='leave_btn'>Leave</button>
      </div> */}

    </div>
  )
}

export default Call