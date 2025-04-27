import HomePage from "../Default/HomePage";
import Specialty from "../Specialty/Specialty";
import Doctor from "../Doctor/Doctor";
import Dashboard from "../Admin/Dashboard/DashBoard";
import DoctorManagement from "../Admin/Tables/DoctorManagement";
import Register from "../Authentication/Register";
import Login from "../Authentication/Login";
import AddDoctorPage from "../Admin/Dashboard/AddDoctorPage";
import Appointment from "../Admin/Dashboard/Appointment";
import MajorList from "../Admin/Dashboard/MajorList";
import DoctorList from "../Admin/Doctor/DoctorList";
import DoctorProfile from "../Doctor/DoctorDetail";
import DoctorScheduleForm from "../Doctor/DoctorSchedule";
import PatientBookingForm from "../Booking/PatientBookingForm";
import PatientAppointmentManager from "../Appointment/PatientAppointmentManager";
import MedproLoginPage from "../Authentication/Login_v2";
import NotFound from "../Default/NotFound";

// Định nghĩa các route theo nhóm
export const routes = {
  public: [
    { path: "/", element: <HomePage /> },
    { path: "/specialty", element: <Specialty /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/login_v2", element: <MedproLoginPage /> },
    { path: "/doctor", element: <Doctor /> },
    { path: "/doctor/:id", element: <DoctorProfile /> },
    { path: "/booking", element: <PatientBookingForm /> },
    { path: "/appointment", element: <PatientAppointmentManager /> },
    { path: "*", element: <NotFound /> }, // Route 404
  ],
  doctor: [
    {
      path: "/doctor-schedule",
      element: <DoctorScheduleForm />,
      allowedRoles: ["doctor"],
    },
    // {
    //   path: "/doctors-list",
    //   element: <DoctorList />,
    //   allowedRoles: ["doctor"],
    // },
  ],
  admin: [
    { path: "/dashboard", element: <Dashboard />, allowedRoles: ["admin"] },
    {
      path: "/add-doctor",
      element: <AddDoctorPage />,
      allowedRoles: ["admin"],
    },
    {
      path: "/doctors-list",
      element: <DoctorList />,
      allowedRoles: ["admin"],
    },
    {
      path: "/appointments",
      element: <Appointment />,
      allowedRoles: ["admin"],
    },
    { path: "/major-list", element: <MajorList />, allowedRoles: ["admin"] },
  ],
};
