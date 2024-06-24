import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const LoadingBarPreloader = () => {
  const ref = useRef(null);
  const location = useLocation(); 

  useEffect(() => {
    ref.current.continuousStart();
    setTimeout(() => {
      ref.current.complete();
    }, 1100);
  }, [location]);

  return (
    <>
      <LoadingBar color="#3a5eaf" ref={ref} height={3} />;
    </>
  );
};

export default LoadingBarPreloader;
