import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import "./style.scss";
import { Progress, Select, Input, Radio, Space } from "antd";
import down_arrow from "../../assets/icons/down-arrow.svg";
import axios from "axios";
import useAxios from "../../utils/useAxios";
import toast from "react-hot-toast";
import ReactPlayer from "react-player";
import { ProductContext } from "../../context/ProductContext";
import { capitalizeFirstLetter } from "../../utils/validation";
import { FaCheck } from "react-icons/fa";
import Map from 'react-map-gl';
import GeocoderControl from "../../components/reactMap/geocoder-control";
import getCurrencyByCountry from "../../utils/getCurrencyService";
import { useForm, useFieldArray } from 'react-hook-form';
import { useLocation, useNavigate } from "react-router-dom";



const UploadS = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [firstProp, setFirstProp] = useState('');
  const [secondProp, setSecondProp] = useState('');

  const [editVideo, setEditVideo] = useState(localStorage.myEditVideo != undefined ? JSON.parse(localStorage.myEditVideo) : false)
  const { product, setProduct } = useContext(ProductContext);
  const { Option } = Select;
  const [category, setCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([])
  const [subcategory, setSubcategory] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [haveVideo, setHaveVideo] = useState(false);
  const [videoName, setVideoName] = useState(useState(localStorage.myEditVideo != undefined ? editVideo.name : ''))
  const [thumbnail, setThumbnail] = useState(!editVideo ? [] : [
    {
      dataURL: editVideo.product_video_type[0].cover_image,
      coverImageFile: {}
    }
  ]);
  const [activeCoverInd, setActiveCoverInd ] = useState(0);
  const imgRef = useRef(null);
  const TOKEN = 'pk.eyJ1Ijoic2VtMTEwMyIsImEiOiJjbHhyemNmYTIxY2l2MmlzaGpjMjlyM3BsIn0.CziZDkWQkfqlxfqiKWW3IA'; 
  const [mapLink, setMapLink] = useState('');

  const currency = getCurrencyByCountry();

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      rows: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'properties',
  });

  const [formData, setFormData] = useState({
    name: !editVideo ? '' : editVideo.name,
    description: !editVideo ? '' : editVideo.description,
    cover_image:  null ,
    category: !editVideo ? [] : editVideo.category, 
    phone_number: !editVideo ? "+994" : editVideo.phone_number , // Default country code
    product_type: "Shorts",
    price: !editVideo ? '' : editVideo.price.split('.')[0],
    original_video:  null ,
    properties : fields.length ? null : fields
  });
  const axiosInstance = useAxios();


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(
          "http://64.226.112.70/api/categories/"
        );
        setCategory(categoryRes.data.results);
        if(editVideo) {
          const selectedCategory = categoryRes.data.results.find((cat) => cat.id == editVideo.category[0]);
          setSubcategory(selectedCategory?.children || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    return () => {
      if(pathname.includes('upload')){
        localStorage.removeItem('myEditVideo');
        setEditVideo(false)
        setFormData({
          name: "",
          description: "",
          cover_image: null,
          category: [],
          phone_number: "+994",
          product_type: "Shorts",
          price: "",
          original_video: null,
        })
      }
    }
  }, []);

  const handleGeocoderResult = useCallback((event) => {
    const { result } = event;
    const { center, place_name } = result;
    const [longitude, latitude] = center;
    
    const link = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    setMapLink({
      url : link,
      location: place_name
    });
  }, []);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" && isNaN(value)) {
      toast.warning("Please enter a valid numeric value for price.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleThumbnailSelect = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      cover_image: thumbnail[index].coverImageFile,
    }));
   
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));

    if (name === "original_video") {
      setVideoPreview(null); // Reset the video preview
      setLoadingProgress(0); // Reset progress
      setShowProgressBar(true); // Show progress bar
      setHaveVideo(true)
      setVideoName(files[0].name.split('.')[0])
      setFormData((prev) => {
        return {
          ...prev,
          name: files[0].name.split('.')[0]
        }
      })

      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      console.log(video);

      
      const updateProgress = (percent) => {
        setLoadingProgress(percent);
        if (percent === 100) {
          setVideoPreview(video.src);
          setShowProgressBar(false); // Hide progress bar after completion
        }
      };

      video.onloadeddata = () => {
        const captureTimes = [
          video.duration * 0.25,
          video.duration * 0.5,
          video.duration * 0.75,
          video.duration * 0.9
        ];

        let thumbnails = [];
        let captureIndex = 0;

        const captureThumbnail = () => {
          if (captureIndex < captureTimes.length) {
            video.currentTime = captureTimes[captureIndex];
            video.onseeked = async () => {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataURL = canvas.toDataURL('image/png');

              canvas.toBlob((blob) => {
                const coverImageFile = new File([blob], `thumbnail.jpg`, {
                  type: "image/jpeg",
                });
                thumbnails.push({dataURL,coverImageFile });

                setFormData((prevData) => ({
                  ...prevData,
                  cover_image: coverImageFile,
                }));
              }, "image/jpeg");


              captureIndex++;
              captureThumbnail();
            };
          } else {
            setThumbnail(thumbnails);
            console.log(thumbnails);
          }

        };
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          updateProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 500); // Adjust the interval time for desired speed


        captureThumbnail();
      };
    }
  };

 

  const handleSelectChange = (name, value) => {
    if (name === "category") {
      const selectedCategory = category.find((cat) => cat.id === value);
      setSubcategory(selectedCategory?.children || []);
      setFormData((prevData) => ({
        ...prevData,
        category: [value, ""], // İkinci elementi təmizləyin
      }));
    } else if (name === "subcategory") {
      setFormData((prevData) => ({
        ...prevData,
        category: [prevData.category[0], value],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0) {
      return [
        <Option key="no-data" disabled>
          Empty
        </Option>,
      ];
    }
    return subcategories.map((subcategory) => (
      <Option key={subcategory.id} value={subcategory.id}>
        {subcategory.name}
      </Option>
    ));
  };

  const validateForm = () => {
    const { name, description, phone_number, category, price } =
      formData;
    const isCategoryValid = category.length >= 1 && category[0];

   


    if (
      !name.trim() ||
      !description.trim() ||
      !phone_number.trim() ||
      !isCategoryValid ||

      !price.trim() 
    ) {
      return false;
    }
    return true;
  };

  const onSubmit = async (data) => {
    


    // if (!validateForm()) {
    //   toast.error("Please fill out all required fields.");
    //   return;
    // }
    const { original_video, ...rest } = formData;
    const submitData = new FormData();
    submitData.append('location_url', mapLink.url)
    submitData.append('location', mapLink.location )
    if(!data.properties.length ) {
      submitData.append('properties', JSON.stringify(data.properties));
    } else submitData.set('properties', JSON.stringify(data.properties));

    
    if(  formData.original_video == null) {
      Object.keys(rest).forEach((key) => {
        if(rest[key] == null ) return

        if (key === "category") {
          formData[key].forEach((categoryId) => {
            submitData.append("category", categoryId);
          });
        }else {
          submitData.append(key, formData[key]);
        }
      });
    } else {
      Object.keys(formData).forEach((key) => {
        if (key === "category") {
          // Ana və alt kateqoriyanın indekslərini birlikdə göndər
          formData[key].forEach((categoryId) => {
            submitData.append("category", categoryId);
          });
        } else if (key === "cover_image" && formData[key]) {
          submitData.append(key, formData[key], formData[key].name);
        } else {
          submitData.append(key, formData[key]);
        }
      });
    }
    

    submitData.set("name", capitalizeFirstLetter(formData.name));
    submitData.set("description", capitalizeFirstLetter(formData.description));

    

    // [
    //   {
    //     "id":"b1e6badd-7164-4eaf-94d3-3d6458d8df2d",
    //     "product_property":"color",
    //     "property_value":"red"
    //   }
    // ]

      // Создаем новый объект FormData, копируя все, кроме последнего ключа
const newSubmitData = new FormData();

// Преобразуем FormData в массив ключей и значений
const entries = Array.from(submitData.entries());

// Удаляем последний ключ
entries.pop();

// Копируем оставшиеся пары ключ-значение в новый объект FormData
entries.forEach(([key, value]) => {
  newSubmitData.append(key, value);
});

// Логирование значений новой FormData для проверки
newSubmitData.forEach((value, key) => {
  console.log(`${key}: ${value}`);
}); 
    
    try {
        await toast.promise(
          !editVideo ?
          axiosInstance.post(`/upload_product/`, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          :
          axiosInstance.patch(
            `/update_product/${editVideo.id}/${editVideo.product_video_type[0].id}/`,
            newSubmitData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          ).then(res => {
            setTimeout(() => {
              navigate('/your_profile/my_videos')
            }, 200);
          })
          ,
          {
            loading: "Processing...",
            success: !editVideo ? "Upload successful!" : 'Update successful!',
            error: "Error uploading data",
          }
        );
      
     

      setFormData({
        name: "",
        description: "",
        cover_image: null,
        category: [],
        phone_number: "+994", // Reset country code
        product_type: "Video",
        price: "",
        original_video: null,
      });
      setVideoPreview(false);
      setHaveVideo(false)
      setShowProgressBar(false)
      setActiveCoverInd(0)
      

    } catch (error) {
      console.error("Error uploading data", error);
      toast.error("An error occurred during upload.");
    }
  };


  const thumbernailOnChangeHandler = (e) => {
    let { files } = e.target;
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageSrc = e.target.result;
        setThumbnail((prev) => {
          const newThumbnails = [
            ...prev,
            {
              dataURL: newImageSrc,
              coverImageFile: files[0]
            }
          ];
          setActiveCoverInd(newThumbnails.length - 1);
          setFormData((prevData) => ({
            ...prevData,
            cover_image: files[0],
          }));
          return newThumbnails;
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };




  return (
    <div className="upload_video">
      <div className="container-fluid upload_video_content mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="row pt-1">
          <div className="upload__video__form">
            {
              !editVideo &&
              <div className="upload__steps">

              <div className="steps">
                <div className="line"></div>
                <div className="step">
                  <div className="completed_part have__video">
                    <div className={`white_part active__step ${haveVideo ? 'active__step' : ''}`} style={{ display: `${videoPreview ? "none" : "block"}` }}
                    ></div>
                    <FaCheck
                      style={{ display: `${videoPreview ? "block" : "none"}` }}
                    />
                  </div>
                  <h3>Upload</h3>
                </div>

                <div className="step">
                  <div className={`completed_part ${videoPreview ? 'have__video' : ''}`}>
                    <div className={`white_part ${videoPreview ? 'active__step' : ''}`} style={{ display: `${videoPreview ? "block" : ""}` }}
                    ></div>
                    {/* <FaCheck
                  style={{ display: `${videoPreview ? "none" : ""}` }}
                /> */}
                  </div>
                  <h3>Details</h3>
                </div>
              </div>

            </div>
            }

          


            <div className="form__content">
              {
                
                <div className={`select_video ${videoPreview || editVideo ? 'selected__video' : ''} `}>
                <div className={` ${(!haveVideo && !editVideo) ? 'show__border' : ''}`} >
                  {(!showProgressBar && !haveVideo && !editVideo ) && <div className="upload__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 10.25L6.96421 10.25C6.05997 10.25 5.33069 10.25 4.7424 10.3033C4.13605 10.3583 3.60625 10.4746 3.125 10.7524C2.55493 11.0815 2.08154 11.5549 1.7524 12.125C1.47455 12.6063 1.35826 13.1361 1.3033 13.7424C1.24998 14.3307 1.24999 15.06 1.25 15.9642L1.25 15.9642L1.25 16L1.25 16.0358L1.25 16.0358C1.24999 16.94 1.24998 17.6693 1.3033 18.2576C1.35826 18.8639 1.47455 19.3937 1.7524 19.875C2.08154 20.4451 2.55493 20.9185 3.125 21.2476C3.60625 21.5254 4.13605 21.6417 4.7424 21.6967C5.33067 21.75 6.05992 21.75 6.96412 21.75L6.96418 21.75L7 21.75L17 21.75L17.0357 21.75C17.94 21.75 18.6693 21.75 19.2576 21.6967C19.8639 21.6417 20.3937 21.5254 20.875 21.2476C21.4451 20.9185 21.9185 20.4451 22.2476 19.875C22.5254 19.3937 22.6417 18.8639 22.6967 18.2576C22.75 17.6693 22.75 16.94 22.75 16.0358L22.75 16L22.75 15.9642C22.75 15.06 22.75 14.3307 22.6967 13.7424C22.6417 13.1361 22.5254 12.6063 22.2476 12.125C21.9185 11.5549 21.4451 11.0815 20.875 10.7524C20.3937 10.4746 19.8639 10.3583 19.2576 10.3033C18.6693 10.25 17.94 10.25 17.0358 10.25L17 10.25L16 10.25C15.5858 10.25 15.25 10.5858 15.25 11C15.25 11.4142 15.5858 11.75 16 11.75L17 11.75C17.9484 11.75 18.6096 11.7507 19.1222 11.7972C19.6245 11.8427 19.9101 11.9274 20.125 12.0514C20.467 12.2489 20.7511 12.533 20.9486 12.875C21.0726 13.0899 21.1573 13.3755 21.2028 13.8778C21.2493 14.3904 21.25 15.0516 21.25 16C21.25 16.9484 21.2493 17.6096 21.2028 18.1222C21.1573 18.6245 21.0726 18.9101 20.9486 19.125C20.7511 19.467 20.467 19.7511 20.125 19.9486C19.9101 20.0726 19.6245 20.1573 19.1222 20.2028C18.6096 20.2493 17.9484 20.25 17 20.25L7 20.25C6.05158 20.25 5.39041 20.2493 4.87779 20.2028C4.37549 20.1573 4.0899 20.0726 3.875 19.9486C3.53296 19.7511 3.24892 19.467 3.05144 19.125C2.92737 18.9101 2.8427 18.6245 2.79718 18.1222C2.75072 17.6096 2.75 16.9484 2.75 16C2.75 15.0516 2.75072 14.3904 2.79718 13.8778C2.84271 13.3755 2.92737 13.0899 3.05144 12.875C3.24892 12.533 3.53296 12.2489 3.875 12.0514C4.0899 11.9274 4.37549 11.8427 4.87779 11.7972C5.39041 11.7507 6.05158 11.75 7 11.75L8 11.75C8.41421 11.75 8.75 11.4142 8.75 11C8.75 10.5858 8.41421 10.25 8 10.25L7 10.25ZM16.5303 6.46967L12.5303 2.46967C12.2374 2.17678 11.7626 2.17678 11.4697 2.46967L7.46967 6.46967C7.17678 6.76256 7.17678 7.23744 7.46967 7.53033C7.76256 7.82322 8.23744 7.82322 8.53033 7.53033L11.25 4.81066L11.25 16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16L12.75 4.81066L15.4697 7.53033C15.7626 7.82322 16.2374 7.82322 16.5303 7.53033C16.8232 7.23744 16.8232 6.76256 16.5303 6.46967Z" fill="currentColor"></path></svg></div>}
                  {showProgressBar && (
                    <div className="progress-container">
                      <Progress percent={loadingProgress} size={['100%', 20]} />

                    </div>
                  )}
                  {
                  (videoPreview  || editVideo) ?
                    <div className="video__preview">
                      <img ref={imgRef} className="thumbnail" src={ thumbnail[activeCoverInd]?.dataURL} alt="" />
                      <h5>File Name</h5>
                      <h6>{videoName}</h6>
                      {
                        !editVideo &&
                        <p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"></path></svg>
                        <span>Video upload complete. No issues found.</span>
                      </p>
                      }
                    </div>
                    :
                    ''
                  }
                  {
                    (!showProgressBar && !haveVideo && !editVideo) &&
                    <>
                      <input
                        name="original_video"
                        title=""
                        type="file"
                        id="original_video"
                        onChange={handleFileChange}

                      />
                      <div className="upload__desc">
                        <h4>Drag and drop video files to upload</h4>
                        <p>Your videos will be private until you publish them.</p>
                      </div>

                      <button
                        type="button"

                      >
                        Select Media
                      </button>
                    </>
                  }
                </div>
              </div>
              }
             


              {
                (videoPreview || editVideo) &&
                <div className={` select_form `}>
                  <div>
                    <div className="input_data">
                      <label htmlFor="title">Title</label>
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Video Title"
                      />
                    </div>

                    <div className="input_data">
                      <label htmlFor="description">Description</label>
                      <textarea
                      name="description"

                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                      ></textarea>
                    </div>

                    <div className="input_data" >
                      <label htmlFor="price" >Price</label>
                      <div className="file_price" >
                        <input
                          name="price"

                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder={currency.currencyCode}
                        />
                        <span className="countryCurrencySymbol">{currency.countryCurrencySymbol}</span>
                      </div>
                    </div>

                    <div className="input_data">
                      <label htmlFor="phone_number">Phone Number</label>
                      <input
                        name="phone_number"
                        type="text"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="+994"
                      />
                    </div>

                    <div className="input_data">
                      <label htmlFor="category">Category (Add category to your video)</label>
                      <div className="custom-select">
                        <Select
                          value={formData.category[0]}
                          onChange={(value) => handleSelectChange("category", value)}
                          className="select"
                          popupClassName="custom-dropdown"
                          suffixIcon={<img src={down_arrow} alt="Dropdown Arrow" />}
                          defaultValue={editVideo && editVideo?.category[0]}
                        >
                          {
                            category?.map((item) => {
                            return <Option key={item.id} value={item.id} >
                              {item.name}
                            </Option>
                            }
                          )
                          }
                        </Select>
                      </div>



                      {/* <div className="video__type__settings">
                         <label >Tags</label>
                  <Select mode="tags" className="tags" notFoundContent="" popupClassName='tags-input' suffixIcon={<img src={down_arrow} alt="Dropdown Arrow" />}>

                  </Select>
                    <div className="video__privacy">
                      <h5>Privacy</h5>
                      <h6>Choose the video privacy</h6>

                      <Radio.Group  >
                              <Space direction="vertical">
                                <Radio value={'public_video'}>Public</Radio>
                                <Radio value={'private_video'}>Private</Radio>
                                <Radio value={'unlisted_video'}>Unlisted</Radio>
                                <Radio value={'scheduled_video'} > Scheduled</Radio>
                              </Space>
                        </Radio.Group>
                    </div>

                    <div className="video__age">
                      <h5>Age</h5>
                      <h6>Age Restriction</h6>

                      <Radio.Group  >
                              <Space direction="vertical">
                                <Radio value={'for_all'}>All ages can view this video</Radio>
                                <Radio value={'for__adults'}>Only +18</Radio>
                              </Space>
                        </Radio.Group>
                    </div>
                  </div> */}

                    </div>

                    <div className="input_data">
                      <label htmlFor="subcategory">Subcategory</label>
                      <div className="custom-select">
                        <Select
                          value={formData.category[1]}
                          onChange={(value) =>
                            handleSelectChange("subcategory", value)
                          }
                          className="select"
                          popupClassName="custom-dropdown"
                          suffixIcon={<img src={down_arrow} alt="Dropdown Arrow" />}
                          notFoundContent="Empty Subcategory"
                          defaultValue={editVideo && editVideo?.category[1]}
                        >
                        
                          {renderSubcategories(subcategory)}
                        </Select>
                      </div>


                    </div>

                    <div className="input_data ">
                      <label>Manual Property
                      </label>
                      <div className="manual__props">

                        { 
                        fields.map((item, index) => {
                         
                           return  <div key={item.id} >
                            <input
                              {...register(`properties.${index}.product_property`)}
                              placeholder="Property"
                                       
                            />
                            <input
                              {...register(`properties.${index}.property_value`)}
                              placeholder="Value"
                              
                            />
                           
                            <button type="button" onClick={() => remove(index)} style={{ padding: '5px 10px' }}>
                              Remove
                            </button>
                          </div>
                          
                          })}

                      <button className="add__input" type="button" onClick={() => {
                        append({ product_property: '', property_value: '' });
                        
                        
                      }} >
                              Add
                            </button>

                      </div>


                    </div>

                    <div className="react__map input_data">
                      <label >Address</label>
                      <Map
                        initialViewState={{
                          longitude: -79.4512,
                          latitude: 43.6568,
                          zoom: 13
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v9"
                        mapboxAccessToken={TOKEN}
                      >
                        <GeocoderControl mapboxAccessToken={TOKEN} position="top-left" placeholder={' '} onResult={handleGeocoderResult}
 />
                      </Map>
                    </div>

                    <div className="input_data thumbernails">
                      <label>Thumbnail</label>
                      <p>Select Or Upload A Picture That Shows What's In Your Video. A Good Thumbnail Stands Out And Draws Viewers' Attention</p>

                      <div className="thumbernails__wrapper">
                        <div className="upload__thumbernail">
                          <input name='thumbernail' type="file" title=" " onChange={e => thumbernailOnChangeHandler(e)} className="thumbernail__input" />
                          <svg xmlns="http://www.w3.org/2000/svg" width={28} viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 10.25L6.96421 10.25C6.05997 10.25 5.33069 10.25 4.7424 10.3033C4.13605 10.3583 3.60625 10.4746 3.125 10.7524C2.55493 11.0815 2.08154 11.5549 1.7524 12.125C1.47455 12.6063 1.35826 13.1361 1.3033 13.7424C1.24998 14.3307 1.24999 15.06 1.25 15.9642L1.25 15.9642L1.25 16L1.25 16.0358L1.25 16.0358C1.24999 16.94 1.24998 17.6693 1.3033 18.2576C1.35826 18.8639 1.47455 19.3937 1.7524 19.875C2.08154 20.4451 2.55493 20.9185 3.125 21.2476C3.60625 21.5254 4.13605 21.6417 4.7424 21.6967C5.33067 21.75 6.05992 21.75 6.96412 21.75L6.96418 21.75L7 21.75L17 21.75L17.0357 21.75C17.94 21.75 18.6693 21.75 19.2576 21.6967C19.8639 21.6417 20.3937 21.5254 20.875 21.2476C21.4451 20.9185 21.9185 20.4451 22.2476 19.875C22.5254 19.3937 22.6417 18.8639 22.6967 18.2576C22.75 17.6693 22.75 16.94 22.75 16.0358L22.75 16L22.75 15.9642C22.75 15.06 22.75 14.3307 22.6967 13.7424C22.6417 13.1361 22.5254 12.6063 22.2476 12.125C21.9185 11.5549 21.4451 11.0815 20.875 10.7524C20.3937 10.4746 19.8639 10.3583 19.2576 10.3033C18.6693 10.25 17.94 10.25 17.0358 10.25L17 10.25L16 10.25C15.5858 10.25 15.25 10.5858 15.25 11C15.25 11.4142 15.5858 11.75 16 11.75L17 11.75C17.9484 11.75 18.6096 11.7507 19.1222 11.7972C19.6245 11.8427 19.9101 11.9274 20.125 12.0514C20.467 12.2489 20.7511 12.533 20.9486 12.875C21.0726 13.0899 21.1573 13.3755 21.2028 13.8778C21.2493 14.3904 21.25 15.0516 21.25 16C21.25 16.9484 21.2493 17.6096 21.2028 18.1222C21.1573 18.6245 21.0726 18.9101 20.9486 19.125C20.7511 19.467 20.467 19.7511 20.125 19.9486C19.9101 20.0726 19.6245 20.1573 19.1222 20.2028C18.6096 20.2493 17.9484 20.25 17 20.25L7 20.25C6.05158 20.25 5.39041 20.2493 4.87779 20.2028C4.37549 20.1573 4.0899 20.0726 3.875 19.9486C3.53296 19.7511 3.24892 19.467 3.05144 19.125C2.92737 18.9101 2.8427 18.6245 2.79718 18.1222C2.75072 17.6096 2.75 16.9484 2.75 16C2.75 15.0516 2.75072 14.3904 2.79718 13.8778C2.84271 13.3755 2.92737 13.0899 3.05144 12.875C3.24892 12.533 3.53296 12.2489 3.875 12.0514C4.0899 11.9274 4.37549 11.8427 4.87779 11.7972C5.39041 11.7507 6.05158 11.75 7 11.75L8 11.75C8.41421 11.75 8.75 11.4142 8.75 11C8.75 10.5858 8.41421 10.25 8 10.25L7 10.25ZM16.5303 6.46967L12.5303 2.46967C12.2374 2.17678 11.7626 2.17678 11.4697 2.46967L7.46967 6.46967C7.17678 6.76256 7.17678 7.23744 7.46967 7.53033C7.76256 7.82322 8.23744 7.82322 8.53033 7.53033L11.25 4.81066L11.25 16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16L12.75 4.81066L15.4697 7.53033C15.7626 7.82322 16.2374 7.82322 16.5303 7.53033C16.8232 7.23744 16.8232 6.76256 16.5303 6.46967Z" fill="currentColor"></path></svg>

                          <p>
                            Upload <br />
                            Thumbnai
                          </p>
                        </div>
                        <ul className="thumbernail__items">

                          {
                            thumbnail?.map((item, ind) => {
                              return <li className={`${activeCoverInd == ind ?  'active__cover' : ''}`}><img onClick={() => {
                                handleThumbnailSelect(ind);
                                setActiveCoverInd(ind)
                              }} src={item.dataURL} alt="" /></li>
                            }).reverse()
                           
                          }
                          
                        </ul>
                      </div>


                    </div>
                    <button type="submit">{!editVideo ? 'Publish' : 'Save'}</button>
                  </div>
                </div>
              }
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UploadS;
