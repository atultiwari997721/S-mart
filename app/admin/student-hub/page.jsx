'use client';
import { useState } from 'react';
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

export default function AdminStudentHub() {
  const { getToken } = useAuth();
  
  const [resourceInfo, setResourceInfo] = useState({
    title: "",
    semester: "",
    branch: "",
    category: "",
    fileUrl: ""
  });

  const handleChange = (e) => {
    setResourceInfo({
      ...resourceInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const formData = new FormData();
      
      Object.keys(resourceInfo).forEach(key => {
        formData.append(key, resourceInfo[key]);
      });

      const { data } = await axios.post("/api/admin/student-hub", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(data.message);
      setResourceInfo({
        title: "",
        semester: "",
        branch: "",
        category: "",
        fileUrl: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">Add Student Hub <span className="text-slate-800 font-medium">Resources</span></h1>
      
      <form onSubmit={(e) => toast.promise(handleSubmit(e), { loading: "Adding resource..." })} 
            className="max-w-2xl mt-8">
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={resourceInfo.title}
            onChange={handleChange}
            placeholder="Resource Title"
            className="w-full p-2 border border-slate-200 rounded"
            required
          />
          
          <select
            name="semester"
            value={resourceInfo.semester}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded"
            required
          >
            <option value="">Select Semester</option>
            {['Semester-1', 'Semester-2', 'Semester-3', 'Semester-4', 
              'Semester-5', 'Semester-6', 'Semester-7', 'Semester-8'].map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>

          <select
            name="branch"
            value={resourceInfo.branch}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded"
            required
          >
            <option value="">Select Branch</option>
            {['CSE', 'AIML', 'Civil', 'Chemical', 'Electrical', 'Electronics', 
              'ECE', 'IT', 'DS', 'FireTech'].map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select
            name="category"
            value={resourceInfo.category}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded"
            required
          >
            <option value="">Select Category</option>
            {['MST1', 'MST2', 'EST', 'Notes', 'Assignments', 'PYQS'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="url"
            name="fileUrl"
            value={resourceInfo.fileUrl}
            onChange={handleChange}
            placeholder="Google Drive File URL"
            className="w-full p-2 border border-slate-200 rounded"
            required
          />
        </div>

        <button 
          type="submit"
          className="mt-6 px-6 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
        >
          Add Resource
        </button>
      </form>
    </div>
  );
}