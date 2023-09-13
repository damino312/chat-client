import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useSelector((state) => state.user);

  if (!loading && user && !error) return children;

  // if (loading === true && data === false && error === false)
  //   return <div>Loading...</div>;
  if (error && !loading && !user) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
