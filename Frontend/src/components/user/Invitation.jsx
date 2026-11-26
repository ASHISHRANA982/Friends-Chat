import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateRequestStatus,
  friendInvitationProfile,
  clearInvitations,
  clearUpdateInvitation
} from '../../api-calls/user/friendsSlice';

import { toast } from 'sonner';
import './style/invitation.css';
import { IoArrowBack } from 'react-icons/io5';
import { toastStyles } from '../common/toastStyles';
import { useNavigate } from 'react-router-dom';
import nameToHexColor, { getInitials } from './../colorGenerate';

export default function UserRequest() {

  const dispatcher = useDispatch();
  const navigate = useNavigate();

  const {
    loading,
    invitations,
    invitationError,
    updateInvitation,
    updateInvitationError,
    updateInvitationLoading
  } = useSelector((state) => state.friendsSlice);


  useEffect(() => {

    dispatcher(friendInvitationProfile());

  }, [dispatcher]);

  useEffect(() => {

    if (invitationError) {

      toast.error(
        invitationError.message || "Failed Load Invitation",
        {
          style: toastStyles.error
        }
      );

      dispatcher(clearInvitations());
    }

  }, [invitationError, dispatcher]);

  useEffect(() => {

    if (updateInvitationError) {

      if (updateInvitationError.errors) {

        Object.values(updateInvitationError.errors).forEach((message) => {

          toast.error(message, {
            style: toastStyles.error
          });

        });

      } else {

        toast.error(
          updateInvitationError.message || "Invitation Update Failed. Try Again",
          {
            style: toastStyles.error
          }
        );

      }

      dispatcher(clearUpdateInvitation());

    }

  }, [updateInvitationError, dispatcher]);


  useEffect(() => {

    if (updateInvitation) {

      toast.success(
        updateInvitation.message || "Invitation Updated Successfully",
        {
          style: toastStyles.success
        }
      );

      dispatcher(clearUpdateInvitation());
      dispatcher(friendInvitationProfile());

    }

  }, [updateInvitation, dispatcher]);


  const updateInvitationStatus = async (status, name, phoneNo) => {

    try {

      await dispatcher(
        updateRequestStatus({
          phoneNo,
          name,
          status
        })
      ).unwrap();

    } catch (error) {

      console.error("Failed to update invitation status:", error);

    }

  };


  return (

    <main id="mainInvitation">

      {
        loading ? (

          <div className="invitationLoading">

            <div className="invitationSpinner"></div>

            <p>Loading invitations...</p>

          </div>

        ) : (

          <section className="mainInvitationSection">

            <header className="invitationHeader">

              <div className="invitationHeader1">

                <button onClick={() => navigate('/root')}>

                  <IoArrowBack size={22} />

                </button>

                <h2>Friends Invitation</h2>

              </div>

              <p className="invitationHeader2">
                Requests you received
              </p>

            </header>


            {
              invitations?.data?.length > 0 ? (

                invitations.data.map((data) => (

                  <div className="invitationBody" key={data.id}>

                    <div className="invitationBody1">

                      {
                        data.profileImage ? (

                          <img
                            src={data.profileImage}
                            alt={data.name}
                          />

                        ) : (

                          <span
                            style={{
                              height: '50px',
                              width: '50px',
                              minWidth: '50px',
                              borderRadius: '50%',
                              backgroundColor: nameToHexColor(data.friendNickName),
                              fontSize: '20px',
                              color: 'white',
                              display: 'inline-flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >

                            {getInitials(data.friendNickName)}

                          </span>

                        )
                      }


                      <div>

                        <p>{data.name}</p>

                        <p className="invitationBody1p2">
                          mutual friends
                        </p>

                      </div>

                    </div>


                    <div className="invitationBody2">

                      <button
                        disabled={updateInvitationLoading}
                        onClick={() =>
                          updateInvitationStatus(
                            "ACCEPTED",
                            data.name,
                            data.phoneNo
                          )
                        }
                        className="invitationBody2Btn1"
                      >
                        Accept
                      </button>


                      <button
                        disabled={updateInvitationLoading}
                        onClick={() =>
                          updateInvitationStatus(
                            "REJECTED",
                            data.name,
                            data.phoneNo
                          )
                        }
                        className="invitationBody2Btn2"
                      >
                        Decline
                      </button>


                      {
                        data.status !== 'PENDING' && (

                          <p>{data.status}</p>

                        )
                      }

                    </div>

                  </div>

                ))

              ) : (

                <p className="emptyInvitation">
                  Empty Invitation
                </p>

              )
            }

          </section>

        )
      }

    </main>

  );

}




