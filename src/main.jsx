import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@mantine/core/styles.css";
import "plyr-react/plyr.css"
import { MantineProvider } from "@mantine/core";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "react-use-cart";
ReactDOM.createRoot(document.getElementById("root")).render(
  
    <CartProvider>
      <ProductProvider>
        <MantineProvider withGlobalClasses withNormalizeCSS>
          <App />
        </MantineProvider>
      </ProductProvider>
    </CartProvider>
  
);
