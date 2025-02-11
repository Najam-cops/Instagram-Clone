import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" />;
  // }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
