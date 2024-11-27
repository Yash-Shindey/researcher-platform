import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center py-4 text-gray-600">
        © 2024 ResearchDB. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
