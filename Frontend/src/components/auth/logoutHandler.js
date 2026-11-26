
import { logout } from "../../api-calls/auth/authSlice";
import { userLogout } from "../../api-calls/user/profileSlice";
import { resetStore } from "../../api-calls/store";
import { replace } from "react-router-dom";

export const handleLogout = async (
  dispatcher,
  navigate,
  setIsLoggingOut
) => {

  setIsLoggingOut(true);

  try {
    await dispatcher(userLogout()).unwrap();

    dispatcher(resetStore());
    dispatcher(logout());

    navigate("/login",{replace:true});

  } catch (error) {
    setIsLoggingOut(false);
  }
};
