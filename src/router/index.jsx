import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Home from "../pages/Home";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import Lastest_Videos from "../pages/LatestVideos";
import Profile from "../pages/Profile";
import MyVideos from "../pages/Profile/pages/MyVideos";
import Shorts from "../pages/Profile/pages/Shorts";
import ShortsP from "../pages/ShortsP";
import Chat from "../pages/Chat";
import LikedVideos from "../pages/Profile/pages/LikedVideos";
import Favorites from "../pages/Profile/pages/Favorites";
import NotFound from "../pages/NotFound";
import History from "../pages/History";
import ProtectedRoute from "./ProtectedRoutes";
import Trending from "../pages/Trending";
import TopVideos from "../pages/TopVideos";
import PopularChannels from "../pages/PopularChannels";
import Subscription from "../pages/Subscriptions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Otp from "../pages/Otp";
import NewPassword from "../pages/NewPassword";
import Faq from "../pages/Faq";
import Settings from "../pages/Settings";
import Basket from "../pages/Basket";
import Payment from "../pages/Payment";
import ProductDetail from "../pages/ProductDetail";
import Call from "../pages/Call";
import About from "../pages/Profile/pages/About";
import { Toaster } from "react-hot-toast";
import UploadV from "../pages/UploadVideo";
import AllChannels from "../pages/AllChannels";
import UploadS from "../pages/UploadShorts";
import EditVideo from "../pages/Profile/pages/EditVideo";
import ChannelsDetail from "../pages/ChannelsDetail";
import ChannelsVideos from "../pages/ChannelsDetail/pages/ChannelsVideos";
import ChannelsShorts from "../pages/ChannelsDetail/pages/ChanellsShorts";
import EditMyShort from "../pages/Profile/pages/EditShort";
import AboutChanell from "../pages/ChannelsDetail/pages/About";
import LoadingBarPreloader from "../components/LoadingBarPreloader";
import LiveStreem from "../pages/LiveSteem";
import NewStream from "../pages/LiveSteem/CreateStreem";
import ShowMyStream from "../pages/LiveSteem/CreateStreem/ShowMyStream";
import { ThemeContext } from "../context/ThemeContext";
import Cookies from 'js-cookie';
import ReRegister from "../pages/ReRegister";
import ChannelShorts from "../pages/ChannelShorts";


const AppRouter = () => {
  const { setTheme} = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(true);
  const [themeMode, setThemeMode] = useState(localStorage.themeMode ? JSON.parse(localStorage.themeMode) : false)
  useEffect(() => {
    setTheme(themeMode);    
  }, []);
 
  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3200}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnHover={false}
          draggable
          theme="light"
          className="toast-container-custom"
        />
        <Toaster />
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}>
          <Header isOpen={isOpen} setIsOpen={setIsOpen} />
          <LoadingBarPreloader />

          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Register />} path="/register" />
            <Route element={<Login />} path="/login" />
            <Route element={<ResetPassword />} path="/reset_password" />
            <Route element={<ReRegister />} path="/re-register" />
            <Route element={<NewPassword />} path="/user/reset-password" />
            <Route element={<Otp />} path="/user/verify-otp" />
           

            <Route element={<ProtectedRoute />}>
              <Route element={<Settings />} path="/settings" />
              <Route element={<Chat />} path="/chat" />
              <Route element={<History />} path="/history" />
              <Route element={<Favorites />} path="/your_profile/favorites" />
              <Route element={<Profile />} path="/your_profile" />
              <Route element={<MyVideos />} path="/your_profile/my_videos" />
              <Route element={<Shorts />} path="/your_profile/shorts" />
              <Route element={<Favorites />} path="/your_profile/favorites" />
              <Route
                element={<LikedVideos />}
                path="/your_profile/liked_videos"
              />
              <Route
                element={<Subscription />}
                path="/your_profile/subscriptions"
              />
              <Route element={<About />} path="/your_profile/about" />
              <Route element={<Basket />} path="/basket" />
              <Route element={<Payment />} path="/payment" />
              <Route element={<Call />} path="/call/:roomId" />
              <Route element={<UploadV />} path="/your_profile/upload_video" />
              <Route element={<UploadS />} path="/your_profile/upload_shorts" />
              <Route
                element={<EditVideo />}
                path="/your_profile/edit_video/:id"
              />
              <Route
                element={<EditMyShort />}
                path="/your_profile/edit_short/:id"
              />

              <Route
                element={<ChannelsDetail />}
                path="/channels_detail/channels_videos/:username"
              />
              <Route
                element={<ChannelsDetail />}
                path="/channels_detail/channels_shorts/:username"
              />
              <Route
                element={<ChannelsDetail />}
                path="/channels_detail/about/:username"
              />
              <Route
                element={<ChannelShorts />}
                path="/channel_shorts/:username"
              />

            </Route>

            <Route element={<Lastest_Videos />} path="/latest_videos" />
            <Route element={<Faq />} path="/faq" />
            <Route element={<ShortsP />} path="/shorts" />
            <Route element={<Trending />} path="/trending" />
            <Route element={<TopVideos />} path="/top_videos" />
            <Route element={<AllChannels />} path="/all_channels" />
            <Route element={<PopularChannels />} path="/popular_channels" />
            <Route element={<ProductDetail />} path="/product_detail/:id/comment/:commentId" />
            <Route element={<ProductDetail />} path="/product_detail/:id" />

            <Route element={<LiveStreem />} path="/live-streams" />
            <Route element={<LiveStreem />} path="/live-streams/:roomId" />
            <Route element={<NewStream />} path="/new-stream" />
            <Route element={<ShowMyStream />} path="/new-stream/:roomId" />


            <Route path="*" element={<Navigate replace to="/404" />} />
            <Route element={<NotFound />} path="/404" />

            
          </Routes>
        </Sidebar>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
