import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";
import { LayoutDashboard, Users, Calendar } from "lucide-react";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  // 👇 Reusable handler for forcing refresh on same route
  const handleNavigation = (path) => (e) => {
    if (location.pathname === path) {
      e.preventDefault();

      // Trick: navigate to temp route then back
      navigate("/temp", { replace: true });

      setTimeout(() => {
        navigate(path, { replace: true });
      }, 0);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 text-2xl font-bold text-blue-600">
          {sidebarOpen ? "HRMS Lite" : "HR"}
        </div>

        <nav className="flex-1 px-3 space-y-2">

          <NavLink
            to="/dashboard"
            className={navLinkClass}
            onClick={handleNavigation("/dashboard")}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && "Dashboard"}
          </NavLink>

          <NavLink
            to="/employees"
            className={navLinkClass}
            onClick={handleNavigation("/employees")}
          >
            <Users size={20} />
            {sidebarOpen && "Employees"}
          </NavLink>

          <NavLink
            to="/attendance"
            className={navLinkClass}
            onClick={handleNavigation("/attendance")}
          >
            <Calendar size={20} />
            {sidebarOpen && "Attendance"}
          </NavLink>

        </nav>

        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg transition"
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Human Resource Management System
          </h1>

          <div className="text-gray-500 text-sm">
            Welcome, Admin 👋
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/temp" element={<div />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default App;