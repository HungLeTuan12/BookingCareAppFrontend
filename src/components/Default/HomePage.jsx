import Footer from "./Footer";
import HospitalUI from "./HospitalUI";
import ScrollToTop from "./ScrollToTop";

const HomePage = () => {
  return (
    <div className="min-h-screen w-100 bg-gray-100">
      <HospitalUI />

      <Footer />
      <ScrollToTop />
    </div>
  );
};
export default HomePage;
