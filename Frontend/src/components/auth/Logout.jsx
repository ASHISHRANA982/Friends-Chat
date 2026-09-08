import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../api-calls/auth/authSlice";
import "./style/logout.css"
import { userLogout, clearLogoutMessage,clearProfileMessage} from "../../api-calls/user/profileSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {FaSignOutAlt  } from "react-icons/fa";
import { toast } from "sonner";
import { resetStore } from "../../api-calls/store";
import { toastStyles } from "../../components/common/toastStyles";

const Logout = ({className,setIsLoggingOut}) => {

  const dispatcher = useDispatch();
  const navigate=useNavigate()
  const { logoutMessage, error } = useSelector((state) => state.profileSlice);

  useEffect(() => {

    if (logoutMessage) {
      toast.success(logoutMessage.message,
        {
          style:toastStyles.success,
        }
      );
      dispatcher(resetStore());
    }
    if (error) {
      toast.error(error.message,
        {
          style:toastStyles.error,
        }
      );
      dispatcher( clearLogoutMessage());
    }

  }, [logoutMessage, error,dispatcher])

 async function handleLogout() {
  setIsLoggingOut(true);
  try {
    await dispatcher(userLogout()).unwrap();
    dispatcher(logout());
    navigate("/login");
  } catch (error) {
    setIsLoggingOut(false);
    toast.error(error);
  }
}

  return (
    <>
      <button className={`logout-btn ${className}`} onClick={handleLogout}><FaSignOutAlt/> Logout</button>
    </>
  );
}

export default Logout;