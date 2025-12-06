import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="w-full border-b px-4 py-2 flex items-center justify-between">
      <Link to="/" className="font-bold text-indigo-600">
        🚌 VBS
      </Link>
      <nav className="flex gap-3 text-sm">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/auth/login" className="hover:underline">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;