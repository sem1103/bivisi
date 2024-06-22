import React, { useEffect, useState } from "react";
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
import Categories from "../layout/Categories";
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
const AppRouter = () => {
  const [isOpen, setIsOpen] = useState(true);

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
          <Categories />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Register />} path="/register" />
            <Route element={<Login />} path="/login" />
            <Route element={<ResetPassword />} path="/reset_password" />
            <Route element={<NewPassword />} path="/user/reset-password" />
            <Route element={<Otp />} path="/user/verify-otp" />
            <Route path="*" element={<Navigate replace to="/404" />} />
            <Route element={<NotFound />} path="/404" />

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
              <Route element={<Call />} path="/call" />
              <Route element={<UploadV />} path="/your_profile/upload_video" />
              <Route element={<UploadS />} path="/your_profile/upload_shorts" />
              <Route
                element={<EditVideo />}
                path="/your_profile/edit_product/:id"
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
                element={<ChannelsVideos />}
                path="/channels_detail/channels_videos/:username"
              />
              <Route
                element={<ChannelsShorts />}
                path="/channels_detail/channels_shorts/:username"
              />
               <Route
                element={<AboutChanell />}
                path="/channels_detail/about/:username"
              />
            </Route>

            <Route element={<Lastest_Videos />} path="/latest_videos" />
            <Route element={<Faq />} path="/faq" />
            <Route element={<ShortsP />} path="/shorts" />
            <Route element={<Trending />} path="/trending" />
            <Route element={<TopVideos />} path="/top_videos" />
            <Route element={<AllChannels />} path="/all_channels" />
            <Route element={<PopularChannels />} path="/popular_channels" />
            <Route element={<ProductDetail />} path="/product_detail/:id" />
          </Routes>
        </Sidebar>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
