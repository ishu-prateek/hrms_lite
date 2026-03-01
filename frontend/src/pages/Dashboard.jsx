import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  // const [stats, setStats] = useState(null);
  const [stats, setStats] = useState({
    total_employees: 0,
    total_attendance_records: 0,
    total_present: 0,
    total_absent: 0
  });
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, summaryResponse] = await Promise.all([
        api.get('/attendance/stats'),
        api.get('/attendance/summary')
      ]);
      setStats(statsResponse.data);
      setSummary(summaryResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch dashboard data');
      setLoading(false);
    }
  };



if (loading) return <LoadingSpinner message="Loading dashboard..." />;
if (!stats) return <EmptyState
  icon="users"
  title="No Employees Found"
  message="Start by adding your first employee."
  action={
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
      Add Employee
    </button>
  }
/>

return (
  <div className="space-y-8">

    {/* Page Title */}
    {/* Page Header with Action Buttons */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h2>
        <p className="text-gray-500">
          Attendance analytics and employee performance summary
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/employees")}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md"
        >
          + Add Employee
        </button>

        <button
          onClick={() => navigate("/attendance")}
          className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md"
        >
          Manage Attendance
        </button>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <Card className="hover:shadow-xl transition duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Employees</p>
            <h3 className="text-3xl font-bold text-blue-600">
              {stats.total_employees}
            </h3>
          </div>
          <Users className="text-blue-500" size={32} />
        </div>
      </Card>

      <Card className="hover:shadow-xl transition duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Attendance Records</p>
            <h3 className="text-3xl font-bold text-gray-700">
              {stats.total_attendance_records}
            </h3>
          </div>
          <ClipboardList className="text-gray-500" size={32} />
        </div>
      </Card>

      <Card className="hover:shadow-xl transition duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Present</p>
            <h3 className="text-3xl font-bold text-green-600">
              {stats.total_present}
            </h3>
          </div>
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
      </Card>

      <Card className="hover:shadow-xl transition duration-300">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">Total Absent</p>
            <h3 className="text-3xl font-bold text-red-600">
              {stats.total_absent}
            </h3>
          </div>
          <XCircle className="text-red-500" size={32} />
        </div>
      </Card>
    </div>

    {/* Attendance Summary */}
    <Card title="Employee Attendance Summary">

      {summary.length === 0 ? (
        <EmptyState
          title="No Attendance Data"
          message="No attendance records available yet."
        />
      ) : (
        <div className="overflow-x-auto max-h-[450px] overflow-y-auto rounded-xl border">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-left">Total Days</th>
                <th className="px-6 py-4 text-left">Present</th>
                <th className="px-6 py-4 text-left">Absent</th>
                <th className="px-6 py-4 text-left">Attendance Rate</th>
              </tr>
            </thead>

            <tbody>
              {summary.map((emp) => {
                const rate =
                  emp.total_days > 0
                    ? ((emp.present_days / emp.total_days) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr
                    key={emp.employee_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{emp.full_name}</div>
                      <div className="text-xs text-gray-500">
                       ID: {emp.employee_id}
                      </div>
                    </td>

                    <td className="px-6 py-4">{emp.total_days}</td>

                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {emp.present_days}
                    </td>

                    <td className="px-6 py-4 text-red-600 font-semibold">
                      {emp.absent_days}
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${
                            rate >= 80
                              ? "bg-green-500"
                              : rate >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          rate >= 80
                            ? "text-green-600"
                            : rate >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  </div>
);
}

export default Dashboard;
