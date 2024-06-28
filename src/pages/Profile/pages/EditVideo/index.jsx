import React , {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import UploadV from "../../../UploadVideo";


const EditVideo = () => {
  const { id } = useParams();

  
  return (
    <>
        <UploadV productId={id} type="Video"  />
    </>
  );
};

export default EditVideo;
