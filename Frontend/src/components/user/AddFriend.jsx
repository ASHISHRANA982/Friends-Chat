import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addFriends, clearFriendsAddData } from '../../api-calls/user/friendsSlice';
import './style/userFriends.css';
import { toast } from "sonner";
import { toastStyles } from "../../components/common/toastStyles";

export default function AddFriend({ setShowPopUp }) {

  const [friendName, setFriendName] = useState("");
  const [friendPhoneNo, setFriendPhoneNo] = useState("")

  const dispatcher = useDispatch();
  const { loading, addMessage, addError } = useSelector((state) => state.friendsSlice)

  useEffect(() => {
    if (addMessage) {
      toast.success(addMessage.message,{
        style:toastStyles.success
      })
      setFriendName("");
      setFriendPhoneNo("");
      setShowPopUp(false);
      dispatcher(clearFriendsAddData())
    }

    if (addError) {
      if(addError.errors){
        Object.values(addError.errors).forEach((message)=>{
          toast.error(message,{
            style:toastStyles.error
          });
        })
      }
      else{
        toast.error(addError.message || "Failed To Add Friend",
          {
            style:toastStyles.error
          }
        )
      }
      dispatcher(clearFriendsAddData())
    }

  }, [addError, addMessage, dispatcher, setShowPopUp])

  function handleSubmit() {
    dispatcher(addFriends({
      name: friendName,
      phoneNo: friendPhoneNo
    }))
  }

  return (
    <div>
      <div
        className="popup-overlay"
        onClick={() => setShowPopUp(false)}
      ></div>

      <div className="popup">
        <h3>Add New Friend</h3>

        <input
          type="text"
          placeholder="Enter Friend Name"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Friend PhoneNo"
          value={friendPhoneNo}
          maxLength={10}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFriendPhoneNo(value);
          }}
        />

        <div className="popup-inner">
          <button
            className="close-btn"
            onClick={() => setShowPopUp(false)}
          >
            Close
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !friendName.trim() || friendPhoneNo.length !== 10} className="add-btn">
            {loading ? "Adding.." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
