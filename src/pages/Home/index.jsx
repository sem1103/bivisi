import React from "react";
import "./style.scss";
import FeaturedVideo from "./components/FeaturedVideo";
import ShortCards from "./components/ShortCards";
import Channels from "./components/Channels";
import LatestVideos from "./components/LatestVideos";
import TopVideos from "./components/TopVideos";
const Home = () => {
  return (
    <section className="b_home">
      <FeaturedVideo />
      <ShortCards />
      <LatestVideos />
      <Channels />
      <TopVideos />
    </section>
  );
};

export default Home;
