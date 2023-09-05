import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useSelector((state) => state.user);

  console.log(loading);

  if (loading && !user && !error) return <div>Loading...</div>;
  if (error && !loading) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
