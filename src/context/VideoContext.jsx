import React, { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [playingVideo, setPlayingVideo] = useState(null);

  const setPlaying = (videoId) => {
    setPlayingVideo(videoId);
  };

  return (
    <VideoContext.Provider value={{ playingVideo, setPlaying }}>
      {children}
    </VideoContext.Provider>
  );
};
