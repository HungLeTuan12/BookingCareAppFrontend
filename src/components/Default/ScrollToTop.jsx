import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 outline-none border-none right-10 bg-[#06a3da] hover:bg-[#0589b7] text-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg transition focus:outline-none focus:ring-2"
        >
          ↑
        </button>
      )}
    </>
  );
};
export default ScrollToTop;
