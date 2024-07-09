import './../style.scss';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import emptyAvatar from '../../../assets/images/user-empty-avatar.png'

export default function ShowMyStream() {
    const roomId = window.location.pathname.split('/').reverse()[0];
    const streamContainer = useRef(null);
    const zp = useRef(null)

    const base64ToFile = (base64, filename) => {
        const byteString = atob(base64.split(',')[1]);
        const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], filename, { type: mimeString });
        return file;
    };







    const myMeeting = async (element) => {
        try {
           
                const appId = 1364666946;
                const serverSecret = '00e187d256dc675f3a9bedb57d81238f';
                const userId = Date.now().toString();
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    appId,
                    serverSecret,
                    roomId,
                    userId,
                    JSON.parse(localStorage.authTokens).username
                );

                console.log('Generated kitToken:', kitToken);

                zp.current = ZegoUIKitPrebuilt.create(kitToken);

                console.log('Joining room with roomId:', roomId);


                zp.current.joinRoom({
                    onJoinRoom: () => {
                        console.log('Join room');
                    },
                    onUserAvatarSetter:(userList) => {
                        if(localStorage.avatar != 'null'){
                            userList.forEach(user => {
                                user.setUserAvatar("localStorage.avatar")
                            })
                        }
                       
                    }
                    ,
                    onLiveStart: async () => {
                        console.log('Go live');


                        let res = await axios.post('http://64.226.112.70/api/core/stream/', {
                            room_id: roomId,
                            user_name: JSON.parse(localStorage.authTokens).username,
                            room_name: localStorage.roomName,
                            cover_image: base64ToFile(localStorage.streamThumb, 'image.png')
                        }, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': 'Bearer ' + JSON.parse(localStorage.authTokens).access
                            }
                        })

                    },
                    onLiveEnd: async () => {
                        console.log('live end');
                        let res = await axios.delete('http://64.226.112.70/api/core/stream/delete/' + zp.current.getRoomID())
                    },
                    onLeaveRoom: async () => {
                        let res = await axios.delete('http://64.226.112.70/api/core/stream/delete/' + roomId)
                        console.log(res.data);
                    },
                    showPreJoinView: false,
                    container: element,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.LiveStreaming,
                        config: {
                            role: ZegoUIKitPrebuilt.Host
                        }
                    }
                });
      
            console.log('Successfully joined the room');
        } catch (error) {
            console.error('Error joining the room:', error);
        }
    };



    useEffect(() => {

        if (streamContainer.current) {
            myMeeting(streamContainer.current);
            localStorage.setItem('isJoined', 'false')

        }
        return () => {
            axios.delete('http://64.226.112.70/api/core/stream/delete/' + roomId)
            if (zp.current) {
                zp.current.destroy()
                localStorage.setItem('isJoined', 'false')
            }
        }
    }, []);

    return (
        <div className="streams">
            <div className="stream__top__title">
                <h1>Create Stream</h1>
            </div>
            <div className="stream-container" ref={streamContainer} />
        </div>
    );
}
