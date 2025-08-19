import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
//   to check if the logout function has been called
  const logoutCalled = useRef(false); 

  useEffect(() => {
    if (logoutCalled.current) return; 
    logoutCalled.current = true;

    const performLogout = async () => {
      try {
        await logout();
        toast.success("Logout successful!");
        navigate("/");
      } catch (error) {
        toast.error("Error logging out");
      }
    };

    performLogout();
  }, [logout, navigate]);

  return null;
};

export default DashboardPage;
