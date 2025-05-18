import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Star, Award, BookOpen } from "lucide-react";
import Layout from "../Default/Layout"; // Sử dụng Layout component
import AnimatedPageWrapper, {
  childVariants,
} from "../Default/AnimatedPageWrapper"; // Giả định bạn đã có AnimatedPageWrapper

// Hàm định dạng phí khám
const formatFee = (fee) => {
  if (fee === 0 || fee === null || fee === undefined) {
    return "Miễn phí";
  }
  return `${fee.toLocaleString("vi-VN")}đ`;
};
// Variants cho hiệu ứng stagger
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("intro");

  const fakeDataEnhancer = (doctorData) => {
    return {
      ...doctorData,
      experience:
        "Với hơn 15 năm kinh nghiệm, bác sĩ đã từng làm việc tại các bệnh viện lớn như Bệnh viện Chợ Rẫy và Bệnh viện Tim Tâm Đức. Ngoài ra, bác sĩ còn tham gia giảng dạy tại Đại học Y Dược TP.HCM, đào tạo hàng trăm bác sĩ trẻ về chuyên môn.",
      certificates: [
        `Chứng chỉ hành nghề Y khoa - Bộ Y tế (2008)`,
        `Chứng chỉ chuyên môn ${doctorData.major.name} - Đại học Y Dược TP.HCM (2010)`,
        `Chứng nhận đào tạo chuyên sâu tại Đại học Harvard, Mỹ (2015)`,
        `Chứng chỉ Nâng cao - Hội ${doctorData.major.name} Châu Âu (2018)`,
      ],
      email: doctorData.email,
      phone: doctorData.phone,
      workplace: "Phòng khám Diệp Sinh, 106 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
    };
  };

  const fakeReviews = [
    {
      comment:
        "Bác sĩ rất tận tâm, giải thích cặn kẽ và luôn theo dõi sát sao tình trạng của tôi. Tôi rất hài lòng với sự chăm sóc của bác sĩ!",
      patientName: "Nguyễn Thị Minh Thư",
      rating: 5,
    },
    {
      comment:
        "Tôi đã được bác sĩ điều trị và cảm thấy rất yên tâm. Bác sĩ không chỉ giỏi chuyên môn mà còn rất thân thiện.",
      patientName: "Trần Văn Hùng",
      rating: 4,
    },
    {
      comment:
        "Bác sĩ là người rất có tâm với nghề. Tôi đã giới thiệu bác sĩ cho nhiều người thân và bạn bè của mình.",
      patientName: "Lê Thị Hồng Nhung",
      rating: 5,
    },
  ];

  const fakeArticles = [
    {
      title: `Hiểu Biết và Phòng Ngừa Bệnh Liên Quan đến ${
        doctor?.major.name || "Sức Khỏe"
      }`,
      description:
        "Bài viết cung cấp thông tin chi tiết về các yếu tố nguy cơ và những biện pháp phòng ngừa hiệu quả, dựa trên kinh nghiệm thực tiễn và nghiên cứu khoa học.",
      link: "#",
    },
    {
      title: "Tầm Quan Trọng của Kiểm Tra Sức Khỏe Định Kỳ",
      description:
        "Nghiên cứu về lợi ích của việc kiểm tra sức khỏe định kỳ, giúp phát hiện sớm các vấn đề tiềm ẩn và cải thiện chất lượng cuộc sống.",
      link: "#",
    },
    {
      title: `Ứng Dụng Công Nghệ Mới Trong Điều Trị ${
        doctor?.major.name || "Bệnh"
      }`,
      description:
        "Bài viết chia sẻ về những tiến bộ công nghệ trong điều trị, bao gồm các phương pháp can thiệp không xâm lấn và sử dụng trí tuệ nhân tạo.",
      link: "#",
    },
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const [doctorResponse, reviewsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/doctor/${id}`),
        ]);
        const doctorData = doctorResponse.data.data;
        setDoctor(fakeDataEnhancer(doctorData));
        setReviews(fakeReviews);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi fetch bác sĩ:", error);
        setReviews(fakeReviews);
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const SkeletonProfile = () => (
    <div className="flex flex-col md:flex-row gap-6 border p-6 rounded-xl shadow-md animate-pulse">
      <div className="flex-shrink-0 w-60 h-72 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="p-6">
        <SkeletonProfile />
      </div>
    );
  if (!doctor)
    return <div className="p-6 text-red-500">Không tìm thấy bác sĩ.</div>;

  return (
    <Layout>
      <AnimatedPageWrapper className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
        <motion.div className="max-w-6xl mx-auto p-6">
          {/* Thông tin bác sĩ chính */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row gap-8 border p-8 rounded-xl shadow-lg bg-white"
          >
            <motion.div className="flex-shrink-0" variants={childVariants}>
              <motion.img
                src={doctor.avatar || "/doctor-placeholder.png"}
                alt={doctor.fullName}
                className="rounded-xl w-64 h-80 object-cover border-2 border-blue-600 shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            <motion.div className="flex-1" variants={childVariants}>
              <motion.h2
                className="text-3xl font-bold text-gray-800 flex items-center gap-2"
                variants={childVariants}
              >
                {doctor.fullName}
                <span className="text-blue-600">✔️</span>
              </motion.h2>
              <motion.p
                className="text-gray-600 mt-2 text-lg"
                variants={childVariants}
              >
                Chuyên khoa:{" "}
                <span className="font-semibold text-blue-600">
                  {doctor.major.name}
                </span>
              </motion.p>
              <motion.p
                className="text-gray-600 mt-2 text-lg"
                variants={childVariants}
              >
                Giá khám:{" "}
                <span className="font-semibold text-blue-600">
                  {formatFee(doctor.fee)} -
                  <span className="text-sm text-gray-600">
                    (Chưa bao gồm chi phí chụp chiếu, xét nghiệm)
                  </span>{" "}
                </span>
              </motion.p>

              <motion.div
                className="flex items-center gap-2 mt-2"
                variants={childVariants}
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    doctor.trangthai !== "" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    doctor.trangthai !== "" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {doctor.trangthai !== "" ? "Đang làm việc" : "Đã nghỉ"}
                </span>
              </motion.div>

              <motion.div className="mt-4 flex gap-6" variants={childVariants}>
                <motion.div
                  className="flex items-center gap-2"
                  variants={childVariants}
                >
                  <Award className="text-blue-600" size={20} />
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-blue-600">15+ năm</span>{" "}
                    kinh nghiệm
                  </p>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  variants={childVariants}
                >
                  <Award className="text-blue-600" size={20} />
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold text-blue-600">500+</span>{" "}
                    bệnh nhân điều trị
                  </p>
                </motion.div>
              </motion.div>

              <motion.div className="mt-6" variants={childVariants}>
                <motion.div
                  className="flex gap-4 border-b mb-4"
                  variants={childVariants}
                >
                  <motion.button
                    onClick={() => setActiveTab("intro")}
                    className={`pb-2 font-semibold text-lg transition-all duration-300 ${
                      activeTab === "intro"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } focus:outline-none focus:ring-0`}
                    aria-label="Xem giới thiệu"
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Giới thiệu
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab("experience")}
                    className={`pb-2 font-semibold text-lg transition-all duration-300 ${
                      activeTab === "experience"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } focus:outline-none focus:ring-0`}
                    aria-label="Xem kinh nghiệm"
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Kinh nghiệm
                  </motion.button>
                  <motion.button
                    onClick={() => setActiveTab("certificates")}
                    className={`pb-2 font-semibold text-lg transition-all duration-300 ${
                      activeTab === "certificates"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    } focus:outline-none focus:ring-0`}
                    aria-label="Xem chứng chỉ"
                    variants={childVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Chứng chỉ
                  </motion.button>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === "intro" && (
                      <p
                        className="text-gray-600 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: doctor.description }}
                      ></p>
                    )}
                    {activeTab === "experience" && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {doctor.experience}
                      </p>
                    )}
                    {activeTab === "certificates" && (
                      <ul className="list-disc list-inside text-gray-600 text-sm">
                        {doctor.certificates.map((certificate, index) => (
                          <motion.li key={index} variants={childVariants}>
                            {certificate}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Thông tin liên lạc */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-10 bg-white p-8 rounded-xl shadow-lg"
          >
            <motion.h3
              className="text-lg font-semibold text-gray-800 mb-4 flex items-center"
              variants={childVariants}
            >
              Thông tin liên hệ <span className="ml-2 text-blue-600">📞</span>
            </motion.h3>
            <motion.div
              className="space-y-3 text-gray-600 text-sm"
              variants={childVariants}
            >
              <motion.p
                className="flex items-center gap-2"
                variants={childVariants}
              >
                <Mail className="text-blue-600" size={18} />
                Email:{" "}
                <a
                  href={`mailto:${doctor.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {doctor.email}
                </a>
              </motion.p>
              <motion.p
                className="flex items-center gap-2"
                variants={childVariants}
              >
                <Phone className="text-blue-600" size={18} />
                Số điện thoại:{" "}
                <a
                  href={`tel:${doctor.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {doctor.phone}
                </a>
              </motion.p>
              <motion.p
                className="flex items-center gap-2"
                variants={childVariants}
              >
                <MapPin className="text-blue-600" size={18} />
                Địa điểm làm việc: {doctor.workplace}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Đánh giá từ bệnh nhân */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mt-10 bg-white p-8 rounded-xl shadow-lg"
          >
            <motion.h3
              className="text-lg font-semibold text-gray-800 mb-4 flex items-center"
              variants={childVariants}
            >
              Đánh giá từ bệnh nhân{" "}
              <Star className="ml-2 text-yellow-500" size={20} />
            </motion.h3>
            {reviews.length > 0 ? (
              <motion.div className="space-y-4" variants={childVariants}>
                {reviews.map((review, index) => (
                  <motion.div
                    key={index}
                    className="border-b pb-4"
                    variants={childVariants}
                    custom={index}
                  >
                    <p className="text-gray-600 text-sm">
                      "{review.comment}"{" "}
                      <span className="font-semibold text-blue-600">
                        - {review.patientName}
                      </span>
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="text-yellow-500"
                          size={16}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.p
                className="text-gray-600 text-sm"
                variants={childVariants}
              >
                Chưa có đánh giá nào cho bác sĩ này.
              </motion.p>
            )}
          </motion.div>

          {/* Bài viết hoặc nghiên cứu của bác sĩ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="mt-10 bg-white p-8 rounded-xl shadow-lg"
          >
            <motion.h3
              className="text-lg font-semibold text-gray-800 mb-4 flex items-center"
              variants={childVariants}
            >
              Bài viết và nghiên cứu{" "}
              <BookOpen className="ml-2 text-blue-600" size={20} />
            </motion.h3>
            <motion.div className="space-y-4" variants={childVariants}>
              {fakeArticles.map((article, index) => (
                <motion.div key={index} variants={childVariants}>
                  <h4 className="text-gray-800 font-semibold">
                    {article.title}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {article.description}
                  </p>
                  <motion.a
                    href={article.link}
                    className="text-blue-600 text-sm hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Đọc thêm
                  </motion.a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Thành tựu nổi bật */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            className="mt-10 bg-white p-8 rounded-xl shadow-lg"
          >
            <motion.h3
              className="text-lg font-semibold text-gray-800 mb-4 flex items-center"
              variants={childVariants}
            >
              Thành tựu nổi bật{" "}
              <Award className="ml-2 text-blue-600" size={20} />
            </motion.h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
              variants={childVariants}
            >
              <motion.div variants={childVariants}>
                <p className="text-3xl font-bold text-blue-600">500+</p>
                <p className="text-gray-600 text-sm">Bệnh nhân đã điều trị</p>
              </motion.div>
              <motion.div variants={childVariants}>
                <p className="text-3xl font-bold text-blue-600">15+</p>
                <p className="text-gray-600 text-sm">Năm kinh nghiệm</p>
              </motion.div>
              <motion.div variants={childVariants}>
                <p className="text-3xl font-bold text-blue-600">4.9/5</p>
                <p className="text-gray-600 text-sm">Đánh giá trung bình</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatedPageWrapper>
    </Layout>
  );
}
