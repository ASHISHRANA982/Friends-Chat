import React from 'react'
import "../user/style/request.css"
import { useDispatch, useSelector } from 'react-redux'
import {
  friendPendingProfile, clearPendingRequests
} from '../../api-calls/user/friendsSlice';
import { useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import nameToHexColor from '../colorGenerate';
import { getInitials } from '../colorGenerate';
import { toast } from 'sonner';
import {toastStyles} from '../common/toastStyles'

const Request = () => {

  const dispatcher = useDispatch();
  const navigate = useNavigate();


  const {loading, pendingRequests, pendingRequestsError } = useSelector((state) => state.friendsSlice)

  useEffect(() => {
    dispatcher(friendPendingProfile());
  }, [dispatcher])

  useEffect(() => {
    if (pendingRequestsError) {
      toast.error(pendingRequestsError.message || "Failed to load pending request", {
        style: toastStyles.error
      })
      dispatcher(clearPendingRequests())
    }
  }, [pendingRequestsError, dispatcher])

  useEffect(() => {
    if (pendingRequests?.data?.some((item) => item.status === "ACCEPTED")) {
      dispatcher(clearPendingRequests());
    }
  }, [pendingRequests, dispatcher]);


  return (
    <main id='requestMainSection'>
      {
        loading ? (
          <div className="requestLoading">
            <div className="requestSpinner"></div>
            <p>Loading requests...</p>
          </div>
        ):
(
      <section className="requestMainBody">

        <div className="requestBodySec1">

          <div className='requestHeaderLeft'>
            <button
              className="requestBackButton"
              onClick={() => navigate("/root")}
              aria-label="Go back"
            >
              <FiArrowLeft />
            </button>
            <h2 className='requestHeaderLeftH2'>Pending Requests</h2>
          </div>

          <p>Request you sent</p>
        </div>

        <div className="requestBodySec2">

          {
             pendingRequests?.data?.length > 0 ?(
            pendingRequests?.data?.map((data) => (

              <div className='requestBodySec2Main' key={data.id}>

                <div className='requestBodySec2Sub1'>

                  {

                    data.profileImage ?
                      <img src={data.profileImage} /> :
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
                  }

                  <div>
                    <p className='requestName'>{data.friendNickName}</p>
                    <p className='requestMsg'>Request sent - waiting for reply</p>
                  </div>

                </div>

                <div className='requestBodySec2Sub2'>

                  <p>{data.status}</p>
                </div>

              </div>
            ))):(<p className='emptyRequest' >Empty Request</p>)
          }

        </div>

      </section>
)}

    </main>
  )
}

export default Request;