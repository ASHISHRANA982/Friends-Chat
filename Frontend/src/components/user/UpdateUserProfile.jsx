// import React from 'react'
// import './style/updateProfile.css'
// import { IoArrowBack } from "react-icons/io5";
// import { MdEmail, MdPerson, MdEdit } from "react-icons/md";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FaLock } from "react-icons/fa";
// import { useState } from 'react';
// import { toast } from 'sonner';
// import { uploadImageToCloudinary } from '../../api-calls/cloudinary/uploadImageToCloudinary';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateProfile, clearProfileUpdate, deleteCloudinaryImage } from '../../api-calls/user/profileSlice';
// import { toastStyles } from "../../components/common/toastStyles";
// import defaultProfileImage from '../../assets/defaultProfileImage.png'

// export const UpdateUserProfile = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();



//   const profile = location.state;
  

//   const originalProfile = {
//     name: profile?.name || "",
//     email: profile?.email || "",
//     profileTag: profile?.profileTag || "",
//     imageUrl: profile?.imageUrl || defaultProfileImage
//   };

//   const [profileData, setProfileData] = useState(originalProfile);
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);



//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setProfileData((prev) => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setProfileImageFile(file);
//     const imageUrl = URL.createObjectURL(file);

//     setProfileData((prev) => ({
//       ...prev,
//       imageUrl: imageUrl
//     }))

//   }
//   const handleCancel = () => {
//     setProfileData(originalProfile);
//     setProfileImageFile(null);
//   }


//   const handleApiCall = async () => {

//     let uploadedPublicId = null;
//     setLoading(true);

//     try {

//       let finalImageUrl = profileData.imageUrl;

//       if (profileImageFile) {

//         const cloudinaryResult =
//           await uploadImageToCloudinary(profileImageFile);

//         finalImageUrl = cloudinaryResult.imageUrl;
//         uploadedPublicId = cloudinaryResult.publicId;
//       }

//       const request = {
//         name: profileData.name,
//         email: profileData.email,
//         profileTag: profileData.profileTag,
//         imageUrl: finalImageUrl
//       };

//       const response =
//         await dispatch(updateProfile(request)).unwrap();
//       toast.success(response.message, {
//         style: toastStyles.success
//       });

//       navigate("/profile");

//     } catch (error) {

//       if (error?.errors) {

//         Object.values(error.errors).forEach((message) => {
//           toast.error(message, {
//             style: toastStyles.error
//           });
//         });

//       } else {

//         toast.error(
//           error?.message || "Profile update failed",
//           {
//             style: toastStyles.error
//           }
//         );
//       }
//       if (uploadedPublicId) {

//         try {

//           await dispatch(
//             deleteCloudinaryImage(uploadedPublicId)
//           ).unwrap();


//         } catch (deleteError) {


//         }
//       }

//     } finally {

//       setLoading(false);
//     }
//   };


//   return (

//     <div className='update-profile-main'>

//       <div className='update-sub-update'>

//         <header className='update-header-card'>

//           <button
//             className='update-back-btn'
//             onClick={() => navigate("/profile")}
//           >
//             <span><IoArrowBack /></span>
//             Back
//           </button>

//           <div className='update-header-sub-card'>
//             <h2>Update Your Profile</h2>
//             <p>Make changes to your profile information</p>
//           </div>

//         </header>


//         <main className='update-main-card'>

//           <div className='update-input-card'>

//             <label htmlFor="name">
//               Full Name
//             </label>

//             <div className='update-input-box'>
//               <span><MdPerson size={22} /></span>

//               <input
//                 name='name'
//                 type="text"
//                 placeholder='Name'
//                 id='name'
//                 value={profileData.name}
//                 onChange={handleChange}
//               />
//             </div>

//           </div>


//           <div className='update-input-card'>

//             <label htmlFor="email">
//               Email Address
//             </label>

//             <div className='update-input-box'>
//               <span><MdEmail size={22} /></span>

//               <input
//                 name='email'
//                 type="email"
//                 placeholder='Email'
//                 id='email'
//                 value={profileData.email}
//                 onChange={handleChange}
//               />
//             </div>

//           </div>


//           <div className='update-input-card'>

//             <label htmlFor="tag">
//               Profile Tag
//             </label>

//             <div className='update-input-box'>
//               <span><MdEdit size={22} /></span>

//               <input
//                 name='profileTag'
//                 type="text"
//                 placeholder='Profile Tag'
//                 id='tag'
//                 value={profileData.profileTag}
//                 onChange={handleChange}
//               />
//             </div>

//           </div>


//           <div className='update-input-card'>

//             <label>
//               Profile Picture
//             </label>

//             <div className='update-input-box update-image-update'>

//               <div className='update-profile-img-card'>
//                 <img
//                   src={profileData.imageUrl}
//                   alt="not found"
//                   onError={(e) => {
//                     e.currentTarget.onerror = null;
//                     e.currentTarget.src = defaultProfileImage;
//                   }}
//                 />
//               </div>

//               <label
//                 htmlFor="file-upload"
//                 className="update-upload-btn"
//               >
//                 Upload
//               </label>

//               <input
//                 id="file-upload"
//                 type="file"
//                 accept="image/*"
//                 hidden
//                 onChange={handleImageChange}
//               />

//             </div>

//           </div>

//         </main>


//         <footer className='update-button-card'>

//           <button
//             className='update-card-btn-1'
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>

//           <button
//             className='update-card-btn-2'
//             onClick={handleApiCall}
//             disabled={loading}
//           >

//             {
//               loading ? (
//                 <>
//                   <span className='update-spinner'></span>
//                   Saving..
//                 </>
//               ) : (
//                 "Save changes"
//               )
//             }

//           </button>

//         </footer>


//         <p className='update-last-p-line'>
//           <FaLock />
//           Your information is private and secure
//         </p>

//       </div>
//     </div>

//   )
// }



import React, { useEffect, useState } from 'react';
import './style/updateProfile.css';

import { IoArrowBack } from "react-icons/io5";
import { MdEmail, MdPerson, MdEdit } from "react-icons/md";
import { FaLock } from "react-icons/fa";

import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { uploadImageToCloudinary } from '../../api-calls/cloudinary/uploadImageToCloudinary';

import { useDispatch, useSelector } from 'react-redux';

import {
  updateProfile,
  deleteCloudinaryImage,
  userProfile
} from '../../api-calls/user/profileSlice';

import { toastStyles } from "../../components/common/toastStyles";
import defaultProfileImage from '../../assets/defaultProfileImage.png';


export const UpdateUserProfile = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { success } = useSelector((state) => state.profileSlice);

  const profile = success?.data || location.state || {};

  const originalProfile = {
    name: profile?.name || "",
    email: profile?.email || "",
    profileTag: profile?.profileTag || "",
    imageUrl: profile?.profileImage || profile?.imageUrl || defaultProfileImage
  };

  const [profileData, setProfileData] = useState(originalProfile);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    dispatch(userProfile());

  }, [dispatch]);


  useEffect(() => {

    if (success?.data) {

      setProfileData({
        name: success.data.name || "",
        email: success.data.email || "",
        profileTag: success.data.profileTag || "",
        imageUrl: success.data.profileImage || defaultProfileImage
      });

      setProfileImageFile(null);

    }

  }, [success]);


  useEffect(() => {

    if (!profileImageFile) {
      setPreviewUrl("");
      return;
    }

    const imageUrl = URL.createObjectURL(profileImageFile);

    setPreviewUrl(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };

  }, [profileImageFile]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {

      toast.error("Only JPG and PNG images are allowed", {
        style: toastStyles.error
      });

      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {

      toast.error("Image size must be less than 2 MB", {
        style: toastStyles.error
      });

      e.target.value = "";
      return;
    }

    setProfileImageFile(file);

    e.target.value = "";

  };


  const handleRemoveImage = () => {

    setProfileImageFile(null);

    setProfileData((prev) => ({
      ...prev,
      imageUrl: profile.profileImage
    }));

  };


  const handleCancel = () => {

    setProfileData(originalProfile);
    setProfileImageFile(null);

  };


  const handleApiCall = async (e) => {

    e.preventDefault();

    if (!profileData.name.trim() || !profileData.email.trim()) {

      toast.error("Name and email are required", {
        style: toastStyles.error
      });

      return;
    }

    let uploadedPublicId = null;

    setLoading(true);

    try {

      let finalImageUrl = profileData.imageUrl;

      if (profileImageFile) {

        const cloudinaryResult =
          await uploadImageToCloudinary(profileImageFile);

        finalImageUrl = cloudinaryResult.imageUrl;

        uploadedPublicId = cloudinaryResult.publicId;

      }


      const request = {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        profileTag: profileData.profileTag.trim(),
        imageUrl: finalImageUrl
      };


      const response = await dispatch(
        updateProfile(request)
      ).unwrap();


      toast.success(
        response.message || "Profile updated successfully",
        {
          style: toastStyles.success
        }
      );

      await dispatch(userProfile());

      navigate("/profile");


    } catch (error) {

      if (error?.errors) {

        Object.values(error.errors).forEach((message) => {

          toast.error(message, {
            style: toastStyles.error
          });

        });

      } else {

        toast.error(
          error?.message || "Profile update failed",
          {
            style: toastStyles.error
          }
        );

      }


      if (uploadedPublicId) {

        try {

          await dispatch(
            deleteCloudinaryImage(uploadedPublicId)
          ).unwrap();

        } catch (deleteError) {

          console.error(
            "Failed to delete uploaded image:",
            deleteError
          );

        }

      }

    } finally {

      setLoading(false);

    }

  };

  console.log(profile)

  return (

    <main className="update-profile-main">

      <section className="update-sub-update">

        <header className="update-header-card">

          <button
            type="button"
            className="update-back-btn"
            onClick={() => navigate("/profile")}
          >

            <IoArrowBack size={16} />

            Back to profile

          </button>


          <div className="update-header-sub-card">

            <h2>Update profile</h2>

            <p>Make changes to your profile information</p>

          </div>

        </header>


        <form onSubmit={handleApiCall}>

          <div className="update-image-section">

            <div className="update-profile-img-card">

              <img
                src={previewUrl || profileData.imageUrl}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultProfileImage;
                }}
              />

            </div>


            <div className="update-image-details">

              <h4>Profile picture</h4>

              <p>JPG or PNG, up to 2 MB</p>

            </div>


            <div className="update-image-actions">

              <label
                htmlFor="file-upload"
                className="update-upload-btn"
              >
                Change photo
              </label>

              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleImageChange}
              />


              <button
                type="button"
                className="update-remove-btn"
                onClick={handleRemoveImage}
              >
                Remove
              </button>

            </div>

          </div>


          <div className="update-main-card">

            <div className="update-input-card">

              <label htmlFor="name">
                Full name
              </label>

              <div className="update-input-box">

                <MdPerson size={18} />

                <input
                  name="name"
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="update-input-card">

              <label htmlFor="email">
                Email address
              </label>

              <div className="update-input-box">

                <MdEmail size={18} />

                <input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            <div className="update-input-card update-tag-card">

              <div className="update-tag-header">

                <label htmlFor="tag">
                  Profile tag
                </label>

                <span>
                  {profileData.profileTag.length}/100
                </span>

              </div>


              <div className="update-input-box update-textarea-box">

                <MdEdit size={18} />

                <textarea
                  name="profileTag"
                  id="tag"
                  placeholder="Write something about yourself..."
                  value={profileData.profileTag}
                  onChange={handleChange}
                  maxLength={100}
                  rows={3}
                />

              </div>

            </div>

          </div>


          <footer className="update-button-card">

            <button
              type="button"
              className="update-card-btn-1"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="update-card-btn-2"
              disabled={loading}
            >

              {
                loading ? (

                  <>
                    <span className="update-spinner"></span>
                    Saving...
                  </>

                ) : (

                  "Save changes"

                )
              }

            </button>

          </footer>

        </form>


        <p className="update-last-p-line">

          <FaLock size={12} />

          Your information is private and secure

        </p>

      </section>

    </main>

  );

};
