import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  updateRequestStatus, friendPendingProfile, friendInvitationProfile,
  clearPendingRequests, clearInvitations, clearUpdateInvitation, addFriends, clearFriendsAddData
} from '../../api-calls/user/friendsSlice';
import { toast } from "sonner";
import './style/userFriends.css'
import { IoArrowBack } from "react-icons/io5";
import { toastStyles } from '../../components/common/toastStyles';

export default function UserRequest({ requestType, setActiveTab }) {

  const dispatcher = useDispatch();
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);


  const {
    pendingRequests,
    pendingRequestsError,
    invitations,
    invitationError,
    updateInvitation,
    updateInvitationError,
    updateInvitationLoading

  } = useSelector((state) => state.friendsSlice);


  useEffect(() => {

    if (requestType === 'request' && pendingRequests == null) {
      dispatcher(friendPendingProfile())
    }
    if (requestType === 'invitation' && invitations == null) {
      dispatcher(friendInvitationProfile())
    }

  }, [requestType, dispatcher])

  useEffect(() => {
    if (invitationError) {
      toast.error(invitationError.message || "Failed Load Invitation", {
        style: toastStyles.error
      })
      dispatcher(clearInvitations())
    }
  }, [invitationError, dispatcher])

  useEffect(() => {

    if (pendingRequestsError) {
      toast.error(pendingRequestsError.message || "Failed To Load Pending Request", {
        style: toastStyles.error
      })
      dispatcher(clearPendingRequests())
    }
  }, [pendingRequestsError, dispatcher])

  useEffect(() => {

    if (updateInvitationError) {
      if (updateInvitationError.errors) {
        Object.values(updateInvitationError.errors).forEach((message) => {
          toast.error(message, {
            style: toastStyles.error
          })
        })
      }
      else {
        toast.error(updateInvitationError.message || "Invitation Accept Failed Try Again",
          {
            style: toastStyles.error
          }
        )
      }
      dispatcher(clearUpdateInvitation())
    }
  }, [updateInvitation, updateInvitationError, dispatcher])

  const updateInvitationStatus = async (status, name, phoneNo) => {
    setIsClicked(true);
    setLoading(true);
    try {
      await dispatcher(
        updateRequestStatus({
          phoneNo,
          name,
          status
        })
      ).unwrap();

      dispatcher(clearInvitations());

    } catch (error) {
      console.error("Failed to update invitation status:", error);
    } finally {
      setIsClicked(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pendingRequests?.data?.some((item) => item.status === "ACCEPTED")) {
      dispatcher(clearPendingRequests());
    }
  }, [pendingRequests, dispatcher]);


  // useEffect(() => {
  //   if (pendingRequests) {
  //     toast.success(pendingRequests.message);
  //   }
  // }, [pendingRequests, dispatcher]);

  // useEffect(() => {
  //   if (invitations) {
  //     toast.success(invitations.message);
  //   }
  // }, [invitations, dispatcher]);

  useEffect(() => {
    if (updateInvitation) {
      toast.success(updateInvitation.message,
        {
          style: toastStyles.success
        }
      );
      dispatcher(clearUpdateInvitation());
      dispatcher(clearInvitations());
    }
  }, [updateInvitation, dispatcher]);

  return (
    <>

      {
        loading &&
        (
          <div className="loader-container-f">
            <div className="loader-f"></div>
          </div>
        )
      }

      {
        requestType === 'request' && (
          <div className='user-request-div'>

            <div className='user-request-title'>
              <button onClick={() => setActiveTab("")} className="back-btn">
                <IoArrowBack size={22} />
              </button>
              <p className='p1'>Friend Requests ({pendingRequests && pendingRequests?.data?.length || 0})</p>
              {/* <p className='p2'>View All</p> */}
            </div>

            {
              pendingRequests && pendingRequests?.data?.map((data) => (
                <div className='user-request-content' key={data.id}>

                  <div className='sub-content-1'>
                    <img src={data.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Not Found" />
                    <p>{data.friendNickName}</p>
                  </div>

                  <div className='sub-content-2'>

                    <p>{data.status}</p>
                  </div>

                </div>
              ))
            }

          </div>
        )
      }

      {
        requestType === 'invitation' && (
          <div>
            <div className='user-request-div'>

              <div className='user-request-title'>

                <button onClick={() => setActiveTab("")} className="back-btn">
                  <IoArrowBack size={22} />
                </button>
                <p className='p1'>Invitation ({invitations && invitations?.data?.length || 0})</p>
                {/* <p className='p2'>View All</p> */}


              </div>

              {

                invitations && invitations?.data?.map((data) => (
                  <div className='user-request-content' key={data.id}>

                    <div className='sub-content-1'>
                      <img src={data.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Not Found" />
                      <p>{data.name}</p>
                    </div>

                    <div className='sub-content-2'>

                      <button disabled={isClicked}
                        onClick={() => updateInvitationStatus("REJECTED", data.name, data.phoneNo)} className='btn-1'>Decline</button>

                      <button disabled={isClicked}
                        onClick={() => updateInvitationStatus("ACCEPTED", data.name, data.phoneNo)} className='btn-2'>Accept</button>

                      {
                        data.status === 'PENDING' ? "" : <p>{data.status}</p>
                      }
                    </div>

                  </div>
                ))
              }

            </div>
          </div>
        )
      }

    </>
  );

}