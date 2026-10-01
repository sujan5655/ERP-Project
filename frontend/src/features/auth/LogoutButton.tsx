import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { logout } from "../authSlice";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 2. Clear authentication state from Redux
    dispatch(logout());

    // 3. Go to login page
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
