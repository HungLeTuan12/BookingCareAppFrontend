import React from "react";

export default function AppointmentRegistrationProcess() {
  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Quy trình đăng ký khám bệnh theo hẹn
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Nếu bạn là người mới, còn thắc mắc về quy trình, hãy đọc hướng dân sử
          dụng của Diệp Sinh
        </p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-8 w-0.5 h-[1200px] bg-gray-200"></div>

        {/* Step 1 */}
        <div className="mb-12 relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="text-blue-500 font-semibold mb-2">BƯỚC 1</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
            </div>
            <div className="bg-white w-full">
              <h2 className="text-xl font-bold text-blue-500 mb-6">
                ĐẶT LỊCH KHÁM
              </h2>
              <ul className="space-y-4 pl-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Truy cập vào mục <b>ĐẶT LỊCH KHÁM</b> trên thanh điều hướng
                  </span>
                </li>

                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Nếu khám lần đầu, cần nhập thông tin hồ sơ mới. Nếu đã từng
                    khám, chọn <b>Đặt lịch ngay</b>.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Chọn ngày khám, giờ khám chuyên khoa, dịch vụ khám phù hợp
                    với bản thân
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Xác nhận thông tin, hệ thống sẽ gửi cho khách hàng mã OTP
                    đặt lịch, khách hàng nhập đúng OTP chọn xác nhận đặt lịch.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Cuối cùng, khách hàng kiểm tra email với phiếu khám đã xác
                    nhận đặt thành công.
                  </span>
                </li>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-4">
                  <p className="font-medium mb-2">Lưu ý:</p>
                  <ul className="space-y-2">
                    <li>
                      - Vui lòng khi đăng ký bằng email là email cá nhân của
                      bạn, không sử dụng email không có thật sẽ gây khó khăn
                      trong quá trình đặt lịch.
                    </li>
                    <li>
                      - Đảm bảo các thông tin khi đăng ký lịch khám của bạn là
                      thật. Nếu không phải thật, bệnh viện sẽ từ chối khám.
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 2
        <div className="mb-12 relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="text-blue-500 font-semibold mb-2">BƯỚC 2</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
            </div>
            <div className="bg-white w-full">
              <h2 className="text-xl font-bold text-blue-500 mb-6">
                THANH TOÁN TIỀN KHÁM
              </h2>
              <ul className="space-y-4 pl-4 mb-6">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Chọn loại thẻ thanh toán: Thẻ khám bệnh của bệnh viện Đại
                    Học Y Dược TPHCM, thẻ thanh toán quốc tế hoặc thẻ ATM nội
                    địa.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Kiểm tra tiền khám, các loại phí và tổng tiền thanh toán.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>Nhập thông tin thẻ để tiến hành thanh toán.</span>
                </li>
              </ul>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-4">
                <p className="font-medium mb-2">Lưu ý:</p>
                <ul className="space-y-2">
                  <li>
                    - Thanh toán bằng thẻ khám bệnh của Bệnh viện Đại học Y Dược
                    TPHCM, phí tiện ích sẽ có mức thấp nhất.
                  </li>
                  <li>
                    - Đối với thẻ khám Bệnh viện Đại học Y Dược TPHCM, vui lòng
                    đăng ký chức năng thanh toán trực tuyến tại các chi nhánh
                    Vietinbank trong cả nước, trước khi sử dụng.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}

        {/* Step 3 */}
        <div className="mb-12 relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="text-blue-500 font-semibold mb-2">BƯỚC 2</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
            </div>
            <div className="bg-white w-full">
              <h2 className="text-xl font-bold text-blue-500 mb-6">
                XÁC NHẬN NGƯỜI BỆNH ĐẾN BỆNH VIỆN KHÁM THEO HẸN
              </h2>
              <ul className="space-y-4 pl-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Sau khi đặt khám thành công phiếu khám điện tử sẽ được gửi
                    ngay qua email gồm thông tin cá nhân đã được đăng ký trên
                    phần mềm.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span className="font-semibold">Đến ngày khám</span>
                  <ul className="pl-8 mt-2 space-y-4 w-full">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">›</span>
                      <span>
                        Người bệnh sẽ đến quầy lễ tân tại quầy A để xác nhận
                        rằng đã đặt lịch trên hệ thống. Y tá sẽ xác nhận lịch,
                        thông tin về phòng khám, chi phí khám.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">›</span>

                      <span>
                        Người bệnh sẽ chờ đợi cho đến khi bác sĩ gọi đến tên và
                        số phiếu khám. Nếu bệnh viên quá đông, người bệnh có thể
                        sẽ phải chờ quá lịch hẹn một lúc. Bệnh viện rất xin lỗi
                        về sự bất tiện này.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">›</span>
                      <span>
                        Người bệnh khám BHYT vui lòng đến quầy 12,13,14 khu A
                        trước giờ hẹn 15-30 phút để xác nhận bảo hiểm trước khi
                        vào phòng khám.
                      </span>
                    </li>
                  </ul>
                </li>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-4">
                  <p className="font-medium mb-2">Lưu ý:</p>
                  <ul className="space-y-2">
                    <li>
                      Tại phiếu khám đính kèm trong email, quý khách sẽ nhận
                      được một <b>Mã bệnh nhân</b>. Mã bệnh nhân này quý khách
                      hãy lưu lại để có thể sử dụng các dịch vụ khác trong hệ
                      thống.
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="mb-12 relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="text-blue-500 font-semibold mb-2">BƯỚC 3</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
            </div>
            <div className="bg-white w-full">
              <h2 className="text-xl font-bold text-blue-500 mb-6">
                KHÁM VÀ THỰC HIỆN CẬN LÂM SÀNG
              </h2>
              <ul className="space-y-4 pl-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Người bệnh khám tại các phòng khám chuyên khoa theo thông
                    tin khám đã đặt.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Thực hiện cận lâm sàng (nếu có) và đóng phí tại các quầy thu
                    ngân hoặc trừ vào tài khoản thẻ khám bệnh (nếu có).
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span>
                    Khi đủ kết quả cận lâm sàng, người bệnh quay lại phòng khám
                    gặp Bác sĩ nhận toa thuốc.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="relative">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="text-blue-500 font-semibold mb-2">BƯỚC 4</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10"></div>
            </div>
            <div className="bg-white w-full">
              <h2 className="text-xl font-bold text-blue-500 mb-6">
                NHẬN THUỐC
              </h2>
              <ul className="space-y-4 pl-4">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span className="font-semibold">
                    Người bệnh có BHYT:
                  </span>{" "}
                  Thực hiện kết toán BHYT tại quầy 17,18,19,20 tầng trệt khu A
                  và nhận thuốc tại nhà thuốc khu B.
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">›</span>
                  <span className="font-semibold">
                    Người bệnh không có BHYT:
                  </span>{" "}
                  Đến nhà thuốc khu A hoặc khu B mua thuốc, thanh toán tiền
                  thuốc tại quầy hoặc trừ vào tài khoản thẻ khám bệnh (nếu có).
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
