import "./assets/style.css";
import HomePage from "./components/Default/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Specialty from "./components/Specialty/Specialty";
import Doctor from "./components/Doctor/Doctor";
import Dashboard from "./components/Admin/Dashboard/DashBoard";
import DoctorManagement from "./components/Admin/Tables/DoctorManagement";
import Register from "./components/Authentication/Register";
import Login from "./components/Authentication/Login";
import AddDoctorPage from "./components/Admin/Dashboard/AddDoctorPage";
import Appointment from "./components/Admin/Dashboard/Appointment";
import MajorList from "./components/Admin/Dashboard/MajorList";
import DoctorList from "./components/Admin/Doctor/DoctorList";
import DoctorProfile from "./components/Doctor/DoctorDetail";
import DoctorScheduleForm from "./components/Doctor/DoctorSchedule";
import PatientBookingForm from "./components/Booking/PatientBookingForm";
import PatientAppointmentManager from "./components/Appointment/PatientAppointmentManager";
import MedproLoginPage from "./components/Authentication/Login_v2";
import NotFound from "./components/Default/NotFound";

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Specialty */}
          <Route path="/specialty" element={<Specialty />} />
          {/* Register */}
          <Route path="/register" element={<Register />} />
          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/login_v2" element={<MedproLoginPage />} />
          {/* Doctor */}
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/doctor-schedule" element={<DoctorScheduleForm />} />
          {/* Admin */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-doctor" element={<AddDoctorPage />} />
          <Route path="/admin/tables" element={<DoctorManagement />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/doctors-list" element={<DoctorList />} />
          <Route path="/major-list" element={<MajorList />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          {/* Booking */}
          <Route path="/booking" element={<PatientBookingForm />} />
          <Route path="/appointment" element={<PatientAppointmentManager />} />

          {/* Route mặc định cho các URL không tồn tại */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
