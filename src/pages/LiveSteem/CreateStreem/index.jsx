import { useState, useEffect, useRef } from 'react';
import './../style.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function randomID(len) {
    let result = '';
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export default function NewStream() {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res = await axios.get('http://64.226.112.70/api/user/user_detail/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.authTokens).access
            }
        })
        localStorage.setItem('avatar', res.data.avatar)
        localStorage.setItem('roomName', roomName)
        navigate(`/new-stream/${randomID(17)}`);
    };

    const thumbernailOnChangeHandler = (e) => {
        let { files } = e.target;
        if (files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const newImageSrc = e.target.result;
            console.log(files[0]);
            localStorage.setItem('streamThumb', JSON.stringify(newImageSrc))

           
          };
          reader.readAsDataURL(files[0]);
        }
      };

    

    return (
        <div className="streams">
            <div className="stream__top__title">
                <h1>Create Stream</h1>
            </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Stream Name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
<br />
<input name='thumbernail' type="file" title=" " onChange={e => thumbernailOnChangeHandler(e)} className="thumbernail__input" />
                    <button type="submit">Create</button>
                </form>
            
        </div>
    );
}
