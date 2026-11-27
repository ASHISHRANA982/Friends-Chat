import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addFriends, clearFriendsAddData } from '../../api-calls/user/friendsSlice';
import './style/addFriends.css';
import { toast } from "sonner";
import { toastStyles } from "../../components/common/toastStyles";
import {Link, useNavigate} from "react-router-dom"

export default function AddFriend() {

  const [friendName, setFriendName] = useState("");
  const [friendPhoneNo, setFriendPhoneNo] = useState("")

  const navigate=useNavigate();

  const dispatcher = useDispatch();
  const { loading, addMessage, addError } = useSelector((state) => state.friendsSlice)

  useEffect(() => {
    if (addMessage) {
      toast.success(addMessage.message, {
        style: toastStyles.success
      })
      setFriendName("");
      setFriendPhoneNo("");
      dispatcher(clearFriendsAddData())
    }

    if (addError) {
      if (addError.errors) {
        Object.values(addError.errors).forEach((message) => {
          toast.error(message, {
            style: toastStyles.error
          });
        })
      }
      else {
        toast.error(addError.message || "Failed To Add Friend",
          {
            style: toastStyles.error
          }
        )
      }
      dispatcher(clearFriendsAddData())
    }

  }, [addError, addMessage, dispatcher])

  function handleSubmit() {
    dispatcher(addFriends({
      name: friendName,
      phoneNo: friendPhoneNo
    }))
  }

  return (
    <div id='addFriendsMain'>

      <div className="addFriendsSub">

        <h3 className='addFriendsHeading'>Add New Friend</h3>

        <div className="addFriendsInputGroup">
          <input
            className='inputBox'
            type="text"
            placeholder="Enter friend name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />

          <input
            className='inputBox'
            autoComplete='off'
            type="text"
            placeholder="Enter friend phoneno"
            value={friendPhoneNo}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setFriendPhoneNo(value);
            }}
          />
        </div>

        <div className="addFriendsButton">
          <button onClick={()=>navigate("/root")} className="cancelButton">
            Cancle
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !friendName.trim() || friendPhoneNo.length !== 10} className="addButton">
            {loading ? "Adding.." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
