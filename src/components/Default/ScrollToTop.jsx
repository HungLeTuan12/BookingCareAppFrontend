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
          className="fixed bottom-10 outline-none border-none right-10 bg-blue-500 text-white w-12 h-12 rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
        >
          ↑
        </button>
      )}
    </>
  );
};
export default ScrollToTop;
