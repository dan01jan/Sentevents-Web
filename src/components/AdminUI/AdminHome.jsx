import React from 'react';
import { Link, Outlet } from 'react-router-dom'; // Import Link and Outlet

const AdminHome = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="px-6 py-4 bg-blue-600 text-white text-lg font-bold">
          Admin Panel
        </div>
        <nav className="px-6 py-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/adminhome/cloud" // Correctly link to /adminhome/cloud
                className="block px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/adminhome/eventslist"
                className="block px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                to="/adminhome/questioncreate"
                className="block px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700"
              >
                Questionnaire
              </Link>
            </li><li>
              <Link
                to="/adminhome/admin"
                className="block px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700"
              >
                Graph
              </Link>
            </li>
            <li>
              <Link
                to="/adminhome/attendance"
                className="block px-4 py-2 rounded-md hover:bg-blue-100 text-gray-700"
              >
                Attendance
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
