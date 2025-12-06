import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t px-4 py-2 text-xs text-gray-500 text-center">
      Virtual Bus Services &copy; {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;