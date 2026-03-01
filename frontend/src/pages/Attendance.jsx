import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EmptyState from "../components/EmptyState";
import * as yup from 'yup';
import api from '../services/api';
import { Calendar, User, CheckCircle2, XCircle, Filter } from "lucide-react";


const schema = yup.object({
  employee_id: yup.number().required('Employee is required'),
  date: yup.date().required('Date is required'),
  status: yup.string().oneOf(['Present', 'Absent'], 'Invalid status').required('Status is required'),
});

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, [startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await api.get('/attendance/', { params });
      setAttendance(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch attendance');
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/');
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees');
    }
  };

 
  const onSubmit = async (data) => {
  try {
    setSubmitting(true);
    await api.post('/attendance/', data);
    reset();
    fetchAttendance();
    setToast("Attendance marked successfully ✅");
    setTimeout(() => setToast(null), 3000);
  } catch (err) {
    setError('Failed to mark attendance');
  } finally {
    setSubmitting(false);
  }
};

  const filteredAttendance = attendance
  .filter(a =>
    filterEmployee ? a.employee_id === parseInt(filterEmployee) : true
  )
  .filter(a =>
    search
      ? employees.find(e => e.id === a.employee_id)
          ?.full_name.toLowerCase()
          .includes(search.toLowerCase())
      : true
  );
  if (loading) return <div className="text-center py-8">Loading...</div>;
  return (
  <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

      <div>
        <h2 className="text-4xl font-bold text-gray-800">
          Attendance
        </h2>
        <p className="text-gray-500">
          Manage attendance records efficiently
        </p>
      </div>

      <div className="flex gap-3 items-center">

        {/* Search */}
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none w-64"
        />

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl transition"
        >
          Filters
        </button>

        {/* Mark Attendance Toggle */}
        <button
          onClick={() => setShowMarkForm(!showMarkForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition"
        >
          + Mark Attendance
        </button>

      </div>
    </div>

    {/* Mark Attendance Panel */}
    {showMarkForm && (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition">

        <h3 className="text-xl font-semibold mb-4">
          Mark Attendance
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-3 gap-4">

            <select
              {...register('employee_id')}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              {...register('date')}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <select
              {...register('status')}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>

          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Save
            </button>

            <button
              type="button"
              onClick={() => setShowMarkForm(false)}
              className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Filters Panel */}
    {showFilters && (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition">

        <h3 className="text-xl font-semibold mb-4">
          Filters
        </h3>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>

        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setFilterEmployee('');
            }}
            className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            Clear
          </button>

          <button
            onClick={() => setShowFilters(false)}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>

      </div>
    )}

    {/* Attendance Table */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="max-h-[60vh] overflow-y-auto overflow-x-auto">
        {filteredAttendance.length === 0 ? (
          <EmptyState
            icon="search"
            title="No Attendance Records"
            message="Try adjusting filters or mark new attendance."
            action={
              <button
                onClick={() => setShowMarkForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Mark Attendance
              </button>
            }
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 uppercase text-xs text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map(att => {
                const employee = employees.find(e => e.id === att.employee_id);

                return (
                  <tr key={att.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 font-medium">
                      {employee ? employee.full_name : 'Unknown'}
                    </td>

                    <td className="px-6 py-4">
                      {new Date(att.date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          att.status === 'Present'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>

  </div>
);
}

export default Attendance;
