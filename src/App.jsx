import "./assets/style.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "./components/Default/routes";
import ProtectedRoute from "./components/Default/ProtectedRoute";
import Unauthorized from "./components/Default/Unauthorized";

function App() {
  return (
    <div className="w-full">
      <BrowserRouter>
        <Routes>
          {routes.public.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
          {routes.doctor.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.allowedRoles}>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}
          {routes.admin.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute allowedRoles={route.allowedRoles}>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
