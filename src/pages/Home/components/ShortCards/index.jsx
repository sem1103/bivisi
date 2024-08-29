import React, { useContext, useEffect } from "react";
import ShortCard from "../../../../components/ShortCard";
import "./style.scss";
import { ProductContext } from "../../../../context/ProductContext";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useTranslation } from "react-i18next";
const ShortCards = () => {
  const {t} = useTranslation(['homePage'])
  const { filteredProducts, selectedCategory, minPrice, maxPrice, setSelectedCategory } = useContext(ProductContext);
  useEffect(() => {
    if (selectedCategory === null) {
      setSelectedCategory("All");
    }
  }, [selectedCategory, setSelectedCategory]);


  if (
    !filteredProducts ||
    !Array.isArray(filteredProducts) ||
    filteredProducts.length === 0
  ) {
    return null;
  }

  const videoProducts = filteredProducts
    .filter((item) => {
      const isCategoryMatch = selectedCategory === "All" || item.category.includes(Number(selectedCategory));
      const isPriceMatch = (minPrice === 0 || Number(item.price) >= minPrice) && (maxPrice === 0 || Number(item.price) <= maxPrice);

      return item.product_video_type[0]?.product_type === "Shorts" && isCategoryMatch && isPriceMatch;
    })
    .sort((a, b) => new Date(b._added) - new Date(a.date_added))
    .slice(0, 15);
  return (
    <>
      <section className="shortCards">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 d-flex justify-content-between align-items-center">
              <div className="section__title">
                <div className="shorts_logo">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnxlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 168.071 168.071"
                    xmlSpace="preserve">

                    <g>
                      <g>
                        <path style={{ fill: "currentColor", color: "#04abf2" }} d="M154.932,91.819L42.473,27.483c-2.219-1.26-4.93-1.26-7.121-0.027 c-2.219,1.233-3.588,3.533-3.615,6.026L31.08,161.059c0,0,0,0,0,0.027c0,2.465,1.369,4.766,3.533,6.026 c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214c2.219-1.26,3.588-3.533,3.588-6.053 c0,0,0,0,0-0.027C158.465,95.38,157.123,93.079,154.932,91.819z">
                        </path>
                        <g id="XMLID_15_">
                          <g>
                            <path
                              style={{ fill: "currentColor" }} d="M79.952,44.888L79.952,44.888c3.273-3.273,2.539-8.762-1.479-11.06l-7.288-4.171 c-2.75-1.572-6.212-1.109-8.452,1.128l0,0c-3.273,3.273-2.539,8.762,1.479,11.06l7.291,4.169 C74.25,47.589,77.712,47.126,79.952,44.888z">
                            </path>
                            <path style={{ fill: "var(--textColor)" }} d="M133.459,65.285L99.103,45.631c-2.75-1.572-6.209-1.109-8.449,1.128l0,0 c-3.273,3.273-2.539,8.759,1.479,11.057l23.497,13.44L23.931,122.5l0.52-103.393l19.172,10.964 c2.722,1.558,6.152,1.098,8.367-1.12l0.104-0.104c3.24-3.24,2.514-8.674-1.463-10.95L21,0.948 c-2.219-1.26-4.93-1.26-7.121-0.027c-2.219,1.233-3.588,3.533-3.615,6.026L9.607,134.524c0,0,0,0,0,0.027 c0,2.465,1.369,4.766,3.533,6.026c1.123,0.63,2.355,0.959,3.615,0.959c1.205,0,2.438-0.301,3.533-0.931l113.116-63.214 c2.219-1.26,3.588-3.533,3.588-6.053c0,0,0,0,0-0.027C136.992,68.845,135.65,66.545,133.459,65.285z">
                            </path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <h4>BiviClips</h4>
              </div>
              <Link to="/shorts" className="see__all">
                {t('seeAllBtn')}

                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="Icon/Right arrow">
                    <path id="Vector 190" d="M11.6667 6.66687L15 10.0002M15 10.0002L11.6667 13.3335M15 10.0002L5 10.0002" stroke="var(--textColor)" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round" />
                  </g>
                </svg>

              </Link>
            </div>
            <Swiper
              grabCursor={true}
              slidesPerView={3}
              spaceBetween={10}
              loop={true}

              breakpoints={{
                0: {
                  spaceBetween: 5,
                  slidesPerView: 2.3,

                },
                480: {
                  spaceBetween: 1,
                  slidesPerView: 2.3,
                },
                768: {
                  spaceBetween: 15,
                  slidesPerView: 3.3,
                },

                912: {
                  spaceBetween: 15,
                  slidesPerView: 4.3,
                },
                1280: {
                  spaceBetween: 5,
                  slidesPerView: 6.3,
                },
              }}
            >
              {videoProducts.length === 0 ? (
                <p style={{ color: "white", textAlign: "center" }}>
                  No product found in this category
                </p>
              ) : (
                videoProducts
                  .map((item) =>
                    <SwiperSlide key={item.id}><ShortCard product={item} /></SwiperSlide>)
              )}

            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShortCards;
