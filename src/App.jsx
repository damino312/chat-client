import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import LoginPage from "./page/LoginPage";
import RegistrationPage from "./page/RegistrationPage";
import ChatPage from "./page/ChatPage";

import { fetchUser } from "./feature/user/userSlice";
import { LINK } from "./config/config";
import axios from "axios";
import ProtectedRoute from "./component/ProtectedRoute";
import { AnimatePresence } from "framer-motion";

axios.defaults.baseURL = LINK;
axios.defaults.withCredentials = true;

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route index path="/" element={<LoginPage />}></Route>
        <Route path="/registration" element={<RegistrationPage />}></Route>
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
