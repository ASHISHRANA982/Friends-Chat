import React, { useEffect, useState, useRef } from 'react';
import "./style/userProfile.css"
import { useDispatch, useSelector } from 'react-redux';
import { clearProfileMessage, userProfile, getQuickInfo, clearQuickInfo } from '../../api-calls/user/profileSlice';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../api-calls/auth/authSlice";
import { toastStyles } from '../../components/common/toastStyles';
import { IoArrowBack } from "react-icons/io5";
import nameToHexColor from './../colorGenerate';
import { getInitials } from './../colorGenerate';
import { handleLogout } from '../auth/logoutHandler';


const UserProfile = () => {

  const dispatcher = useDispatch();
  const navigate = useNavigate();

  const profileRequested = useRef(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    loading,
    success,
    profileError
  } = useSelector((state) => state.profileSlice);

  const{quickInfo}=useSelector((state)=>state.profileSlice);

  const user = success?.data;
  const Info=quickInfo?.data;

  useEffect(() => {

    if (!profileRequested.current) {
      profileRequested.current = true;
      dispatcher(userProfile());
      dispatcher(getQuickInfo())
    }

  }, [dispatcher]);


  useEffect(() => {

    if (!profileError) return;

    const message =
      profileError?.message || "Failed to load user profile";

    toast.error(message, {
      style: toastStyles.error
    });

    dispatcher(clearProfileMessage());
    dispatcher(clearQuickInfo())

    if (profileError?.status === 401) {

      dispatcher(logout());

      navigate("/contact", {
        replace: true
      });

    }

  }, [profileError, dispatcher, navigate]);


  const profileImage = user?.profileImage;
  const profileName = user?.name || "";

  return (

    <main id="mainProfile">

      {loading ? (

        <div className="profileLoading">
          <div className="profileSpinner"></div>
          <p>Loading profile...</p>
        </div>

      ) : user ? (

        <section className="profileBody">

          <div className="profileBodyBackBtn">
            <button onClick={() => navigate('/root')}>
              <IoArrowBack size={20} />
            </button>
          </div>

          <div className="profileBody1">

            {profileImage ? (

              <img
                className="profileBody1Img"
                src={profileImage}
                alt="Profile"
              />

            ) : (

              <span
                style={{
                  height: '120px',
                  width: '120px',
                  minWidth: '120px',
                  borderRadius: '50%',
                  backgroundColor: nameToHexColor(profileName),
                  fontSize: '30px',
                  color: 'white',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '3px solid #1BA982'
                }}
              >
                {getInitials(profileName)}
              </span>

            )}

            <div className="profileBody1Text">

              <p className="profileUsername">
                {profileName}
              </p>

              <p className="profileUsertag">
                {user.profileTag || "Add your profile status"}
              </p>

            </div>

          </div>


          <div className="profileBody2">

            <div className="profileBody2Friends profileBody2Box">
              <p className="numberOfActive">{Info?.friends || 0}</p>
              <p className="headerText">Friends</p>
            </div>

            <div className="profileBody2Request profileBody2Box">
              <p className="numberOfActive">{Info?.requests || 0}</p>
              <p className="headerText">Requests</p>
            </div>

            <div className="profileBody2Online profileBody2Box">
              <p className="numberOfActive">10</p>
              <p className="headerText">Online</p>
            </div>

          </div>


          <div className="profileBody3">

            <button
              onClick={() => navigate("/updateProfile")}
              className="profileBody3UpdateBtn"
            >
              Update profile
            </button>

            <button
              disabled={isLoggingOut}
              onClick={() =>
                handleLogout(
                  dispatcher,
                  navigate,
                  setIsLoggingOut
                )
              }
              className="profileBody3LogoutBtn"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>

          </div>

        </section>

      ) : (

        <div className="profileLoading">
          <p>Profile information unavailable.</p>
          <button onClick={() => navigate('/root')}>
            Go Back
          </button>
        </div>

      )}

    </main>

  );

};

export default UserProfile;