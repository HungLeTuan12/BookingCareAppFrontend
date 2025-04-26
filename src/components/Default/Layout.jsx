import React from "react";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Navigation />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Layout;
