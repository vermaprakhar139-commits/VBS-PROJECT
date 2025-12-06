import React from "react";

interface ProtectedRouteProps {
  children: React.ReactElement;
  adminOnly?: boolean;
}

// Temporary simple version: always show children, no auth check
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return children;
};

export default ProtectedRoute;