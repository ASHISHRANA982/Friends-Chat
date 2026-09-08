import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import "./style/userProfile.css"
import { useDispatch, useSelector } from 'react-redux';
import { clearProfileMessage, userProfile, updateProfileImage, deleteCloudinaryImage, getQuickInfo, clearQuickInfo } from '../../api-calls/user/profileSlice';
import { FaCamera } from "react-icons/fa";
import Logout from '../auth/Logout';
import { MdPerson2 } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../../api-calls/cloudinary/uploadImageToCloudinary';
import { logout } from "../../api-calls/auth/authSlice";
import { toastStyles } from '../../components/common/toastStyles';
import defaultProfileImage from '../../assets/defaultProfileImage.png'


const UserFriends = lazy(() => import("./UserFriends"))

const UserProfile = () => {

  const dispatcher = useDispatch();
  const navigate = useNavigate();

  const { loading, success, profileError, accountChecked, accountValidate } = useSelector((state) => state.profileSlice)
  const { imageUpdateSuccessMsg, imageUpdateErrorMsg } = useSelector((state) => state.profileSlice);

  const [profileImage, setProfileImage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [updateImageLoading, setUpdateImageLoading] = useState(false);

  const profileRequested = useRef(false);


  useEffect(() => {
    if (!profileRequested.current) {
      profileRequested.current = true;
      dispatcher(userProfile());
    }
    // if(success){
    //   toast.success(success.message,
    //     {
    //       style:toastStyles.success,
    //     }
    //   );
    // }
  }, [success, dispatcher]);

  useEffect(() => {
    if (imageUpdateSuccessMsg) {
      toast.success(imageUpdateSuccessMsg.message, {
        style: toastStyles.success
      })
    }
    if (imageUpdateErrorMsg) {
      toast.error(imageUpdateErrorMsg.message || "Profile image update failed",
        {
          style: toastStyles.error
        }
      )
    }

  }, [imageUpdateErrorMsg, imageUpdateSuccessMsg])

  useEffect(() => {
    if (!profileError) return;

    const message =
      profileError?.message || "Failed to load user profile";

    toast.error(message, {
      style: toastStyles.error
    });

    if (profileError?.status === 401) {

      dispatcher(clearProfileMessage());

      navigate("/contact", {
        replace: true
      });

      setTimeout(() => {
        dispatcher(logout())
      }, 1000)

      return;
    }

    dispatcher(clearProfileMessage());

  }, [profileError, dispatcher, navigate]);


  const handleImageChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    let uploadedImage = null;

    try {

      setUpdateImageLoading(true);
      const previewUrl = URL.createObjectURL(file);

      setProfileImage(previewUrl);

      uploadedImage = await uploadImageToCloudinary(file);


      await dispatcher(
        updateProfileImage(uploadedImage.imageUrl)
      ).unwrap();

    } catch (error) {

      if (uploadedImage?.publicId) {

        try {

          await dispatcher(
            deleteCloudinaryImage(
              uploadedImage.publicId
            )
          ).unwrap();


        } catch (deleteError) {

        }
      }

      setProfileImage(null);

      toast.error(
        "Profile image update failed. Please try again", {
        style: toastStyles.error
      }
      );
    }
    finally {
      setUpdateImageLoading(false);
    }
  };

  const updateProfile = {
    name: success?.data?.name,
    email: success?.data?.email,
    imageUrl: success?.data?.profileImage,
    profileTag: success?.data?.profileTag
  }


  return (
    <div>
      {
        (loading || isLoggingOut || updateImageLoading) && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )
      }

      <div className='main-profile'>


        <div className={`sub-profile-1 ${showProfile ? "mobile-open" : ""}`}>

          <div
            className="close-profile"
            onClick={() => setShowProfile(false)}
          >
            <IoCloseOutline size={28} />
          </div>

          <div className="profile-image-container">

            <img
              src={
                profileImage ||
                success?.data?.profileImage ||
                defaultProfileImage
              }
              alt="profile"
              className="profile-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultProfileImage;
              }}
            />

            <label className="edit-icon">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

          </div>

          <div className='profile-outer-text'>
            <p className='profile-outer-text1'>{success?.data?.name}</p>
            <p className='profile-outer-text2'>{success?.data?.profileTag} </p>
            {/* <p className='profile-outer-text2'>{success?.data?.email}</p> */}
          </div>


          <div className='profile-text-container'>
            <button className='profile-button' onClick={() => setShowDetails(!showDetails)}>
              <MdPerson2 /> {showDetails ? "Hide Profile" : "Profile"}
            </button>

            {showDetails && (
              <div className='profile-text'>
                <p className='profile-text-span'>Email: {success?.data?.email}</p>
                <p className='profile-text-span'>Name: {success?.data?.name}</p>
                <p className='profile-text-span'>PhoneNo: {success?.data?.phoneNo}</p>
              </div>
            )}


            <button className="profile-update-btn" onClick={() => navigate("/updateProfile", { state: updateProfile })}><FiEdit />Update Profile</button>

            <Logout className="profile-logout-btn" setIsLoggingOut={setIsLoggingOut} />

          </div>


        </div>


        <div className='sub-profile-2'>

          <Suspense fallback={
            <p>loading</p>
          }>

            {
              (accountChecked && accountValidate &&
                <UserFriends setShowProfile={setShowProfile} setShowInfo={setShowInfo} />
              )
            }

          </Suspense>

        </div>


        <SubProfile3 />

        {
          (accountChecked && accountValidate && <SubProfile4 />)
        }

        <div className={`mobile-info-panel ${showInfo ? "mobile-info-open" : ""}`}>

          <button
            className="mobile-info-close"
            onClick={() => setShowInfo(false)}
          >
            ✕
          </button>

          <SubProfile3 />

          {
            (accountChecked && accountValidate && <SubProfile4 />)
          }

        </div>

      </div>

    </div>
  )
}

export default UserProfile;


export function SubProfile3() {
  return (
    <div className='sub-profile-3'>
      <p className="sub-3-p">What's Improved?</p>

      <div className="sub-3-div">

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>1</span>
            <h4>Added Friend Request Cards</h4>
          </div>
          <p>
            Now it shows the list of friend requests with avatars,
            mutual friends and action buttons.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>2</span>
            <h4>Consistent Colors</h4>
          </div>
          <p>
            All buttons and elements follow the same color theme
            for a professional look.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>3</span>
            <h4>Better Profile Section</h4>
          </div>
          <p>
            Added border, glow and camera icon to the profile image.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>4</span>
            <h4>Rounded Corners</h4>
          </div>
          <p>
            Applied border-radius to buttons, cards and search bar
            for a modern look.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>5</span>
            <h4>Better Search Bar</h4>
          </div>
          <p>
            Increased width and height for better usability.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>6</span>
            <h4>Navbar Improved</h4>
          </div>
          <p>
            Added background, shadow and active indicator to navbar.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>7</span>
            <h4>Spacing & Alignment</h4>
          </div>
          <p>
            Added proper spacing, padding and alignment for a clean UI.
          </p>
        </div>

        <div className="sub-content-card">
          <div className="sub-content-title">
            <span>8</span>
            <h4>Quick Info Box</h4>
          </div>
          <p>
            Added quick stats for friends, requests and online users.
          </p>
        </div>

      </div>

    </div>
  );
}

export function SubProfile4() {
  const dispatch = useDispatch();
  const { quickInfo, error } = useSelector((state) => state.profileSlice)

  useEffect(() => {
    if (quickInfo == null) {
      dispatch(getQuickInfo());
    }
  }, [dispatch])


  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load quick info");
      dispatch(clearQuickInfo());
    }
  }, [dispatch, error]);



  return (
    <div className='sub-profile-4 '>
      <p className='profile-info-1'>Quick Info</p>

      <p className='profile-info-2'>Friends <span>{quickInfo?.data?.friends || 0}</span></p>
      <p className='profile-info-3'>Requests <span>{quickInfo?.data?.requests || 0}</span></p>

      <p className='profile-info-4'>Online <span>4</span></p>
    </div>
  );
}