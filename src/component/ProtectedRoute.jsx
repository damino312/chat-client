import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoadingPage from "../page/LoadingPage";
import LoginPage from "../page/LoginPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useSelector((state) => state.user);

  if (!loading && user && !error) return children;

  if (error && !loading && !user) {
    return <LoginPage />;
  }
  return <LoadingPage />;
};

export default ProtectedRoute;
