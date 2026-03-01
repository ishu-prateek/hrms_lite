import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import EmptyState from "../components/EmptyState";
import * as yup from 'yup';
import api from '../services/api';
import { User, Mail, Briefcase, Pencil, Trash2, Plus, Search, X } from "lucide-react";


const schema = yup.object({
  employee_id: yup.string().required('Employee ID is required'),
  full_name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  department: yup.string().required('Department is required'),
});

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/');
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };
const onSubmit = async (data) => {
  try {
    setError(null);

    if (editingId) {
      await api.put(`/employees/${editingId}`, data);
      setEditingId(null);
    } else {
      await api.post("/employees/", data);
    }

    reset();
    setShowForm(false);
    fetchEmployees();

  } catch (err) {

    // 🔥 Handle 400 specifically
    if (err.response?.status === 400) {

      const detail = err.response.data?.detail;

      // Case 1: String message (your duplicate case)
      if (typeof detail === "string") {
        setError(detail);
      }

      // Case 2: FastAPI validation list
      else if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Validation error");
      }

      // Fallback
      else {
        setError("Bad request");
      }

    } else {
      setError("Something went wrong. Please try again.");
    }
  }
};

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setValue('employee_id', employee.employee_id);
    setValue('full_name', employee.full_name);
    setValue('email', employee.email);
    setValue('department', employee.department);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  if (loading) {
    return (
      <EmptyState
        title="Loading Employees"
        message="Fetching employee records..."
        icon="users"
      />
    );
  }
  const filteredEmployees = employees.filter(emp =>
  emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
  emp.employee_id.toLowerCase().includes(search.toLowerCase()) ||
  emp.email.toLowerCase().includes(search.toLowerCase())
);

return (
  <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

      <div>
        <h2 className="text-4xl font-bold text-gray-800">
          Employees
        </h2>
        <p className="text-gray-500">
          Manage your workforce efficiently
        </p>
      </div>
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl flex justify-between items-center animate-fade-in">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="font-bold hover:text-red-900"
            >
              ✕
            </button>
          </div>
        )}
      <div className="flex gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none w-64"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setEditingId(null);
            reset();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow hover:scale-105 transition"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>
    </div>

    {/* Slide Form Panel */}
    {showForm && (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition">

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {editingId ? "Update Employee" : "Add New Employee"}
          </h3>

          <button
            onClick={() => setShowForm(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-4">

            <input
              {...register("employee_id")}
              placeholder="Employee ID"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              {...register("full_name")}
              placeholder="Full Name"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              {...register("department")}
              placeholder="Department"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              {editingId ? "Update" : "Save Employee"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Employee Table */}
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="max-h-[60vh] overflow-y-auto overflow-x-auto">


          <table className="w-full text-sm">
            <thead className="bg-gray-50 uppercase text-xs text-gray-600 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Department</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-400">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-blue-50 transition">

                    <td className="px-6 py-4">
                      <div className="font-semibold">{employee.full_name}</div>
                      <div className="text-xs text-gray-500">
                        ID: {employee.employee_id}
                      </div>
                    </td>

                    <td className="px-6 py-4">{employee.email}</td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        {employee.department}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right flex justify-end gap-4">
                      <button
                        onClick={() => {
                          handleEdit(employee);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("Delete this employee?")) {
                            handleDelete(employee.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>

    </div>
  </div>
);}

export default Employees;
