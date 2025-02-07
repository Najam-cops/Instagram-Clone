import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
