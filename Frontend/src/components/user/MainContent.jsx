import React, { useEffect, useState } from 'react'
import './style/mainContent.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAcceptedFriends, clearAcceptedFriends } from '../../api-calls/user/friendsSlice';
import { toast } from "sonner";
import { toastStyles } from "../../components/common/toastStyles";
import defaultProfileImage from '../../assets/defaultProfileImage.png'

const MainContent = ({ setSelectedContact, searchData }) => {

  const dispatcher = useDispatch();
  const { acceptedFriend, acceptedFriendStatus, acceptedFriendError } = useSelector((state) => state.friendsSlice);



  useEffect(() => {

    if (acceptedFriendStatus === 'idle') {
      dispatcher(getAcceptedFriends())
    }

  }, [acceptedFriendStatus, dispatcher])

  useEffect(() => {
    if (acceptedFriendError) {
      toast.error(acceptedFriendError.message || "Friends Loading Failed", {
        style: toastStyles.error
      });
      dispatcher(clearAcceptedFriends());
    }

  }, [acceptedFriendError, dispatcher])

  // useEffect(() => {
  //   if (acceptedFriend) {
  //     toast.success(acceptedFriend.message);
  //   }
  // }, [acceptedFriend, dispatcher])

  const filteredFriends = acceptedFriend?.data?.filter((data) =>
    data.contactName
      ?.toLowerCase()
      .includes(searchData?.toLowerCase() || "")
  );

  return (
    <>
      {
        Array.isArray(filteredFriends) &&
        filteredFriends.map((data) => (

          <div className='contact-main-div' key={data.id}
            onClick={() => setSelectedContact(data)
            }
          >

            <div className='contact-sub-div'>
              <img className='contact-image' src={data.profileImage || defaultProfileImage}
                alt="Profile"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultProfileImage;
                }}
              />

              <div className='contact-upper-details'>
                <p className='p1'>{data.contactName}</p>
                <p className='p2'>{data.phoneNo}</p>
              </div>
            </div>

          </div>

        )
        )
      }
    </>
  )
}

export default MainContent