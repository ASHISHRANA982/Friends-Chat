import React, { useState, useEffect, useRef } from 'react'
import './style/chatView.css'
import { IoArrowBack, IoSend } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { connectWebSocket, sendMessage, disconnect } from '../../services/WebSocketConfig/connectWebSocket';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, clearConversation, addMessage } from '../../api-calls/chart/messageSlice';
import { toast } from "sonner";
import { MdBlock, MdDeleteForever, MdDeleteOutline } from "react-icons/md";
import { updateAccountBlockConnected, clearBlockAndConnected } from '../../api-calls/user/friendsSlice';
import { toastStyles } from "../../components/common/toastStyles";
import defaultProfileImage from '../../assets/defaultProfileImage.png'
import { useChat } from './ChatContext';

export default function ChatView() {


  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const { success } = useSelector((state) => state.profileSlice)
  const { loading, conversations, error } = useSelector((state) => state.messageSlice);
  const { blockAndConnectedLoading, blockAndconnectedStatus, blockAndconnectedStatusError } = useSelector((state) => state.friendsSlice);

  const {selectedContact,setSelectedContact}=useChat();

  const messages = conversations || [];


  const [showPopUp, setShowPopUp] = useState(false);


  useEffect(() => {
    dispatch(clearConversation())

    if (!selectedContact || !success?.data?.id)
      return;

    dispatch(getConversations({
      friendId: selectedContact.Fid
    }))
  }, [selectedContact?.Fid, success, dispatch])


  useEffect(() => {
    if (error) {
      if (error.errors) {
        Object.values(error.errors).forEach((message) => {
          toast.error(message, {
            style: toastStyles.error
          })
        })
      }
      toast.error(error.message || "Failed To Load Conversations",
        {
          style: toastStyles.error
        }
      )
      dispatch(clearConversation());
    }
  }, [error, dispatch])

  useEffect(() => {
    connectWebSocket((message) => {
      dispatch(addMessage(message))
    });

    return () => {
      disconnect();
    };


  }, []);

  const handleSend = () => {

    if (!selectedContact || !text.trim()) return;

    if (selectedContact.status === "BLOCKED") {
      toast.error("You cannot send messages to a blocked user",
        {
          style: toastStyles.error
        }
      );
      return;
    }

    sendMessage(
      selectedContact.Fid,
      text
    );

    setText("");

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChange = (e) => {
    setText(e.target.value);

    e.target.style.height = "auto";

    e.target.style.height = e.target.scrollHeight + "px";
  };

  const footerRef = useRef(null);

  const handleFocus = () => {
    setTimeout(() => {
      footerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  };

  const handleStatus = async (status, friend_id) => {

    try {

      await dispatch(
        updateAccountBlockConnected({
          friendId: friend_id,
          status: status
        })
      ).unwrap();

      setSelectedContact(prev => ({
        ...prev,
        status: status
      }));
      if (status === "BLOCKED") {
        dispatch(clearConversation());
      }
      setShowPopUp(false);
      toast.success(
        status === "BLOCKED"
          ? "User blocked successfully"
          : "User unblocked successfully",
        {
          style: toastStyles.success
        }
      );

    } catch (error) {
      toast.error("Failed to update status",
        {
          style: toastStyles.error
        }
      );
    }
  };


  useEffect(() => {
    if (blockAndconnectedStatusError) {

      if (blockAndconnectedStatusError.errors) {
        Object.values(blockAndconnectedStatusError.errors).forEach((message) => {
          toast.error(message,
            {
              style: toastStyles.error
            }
          );
        })
      }
      else {
        toast.error(blockAndconnectedStatusError.message || "Failed To Update Status",
          {
            style: toastStyles.error
          }
        );
      }

      dispatch(clearBlockAndConnected())
    }
  }, [blockAndconnectedStatusError, dispatch])


  return (

    <>

      {
        blockAndConnectedLoading || loading &&
        (
          <div className="loader-container-c">
            <div className="loader-c"></div>
          </div>
        )
      }

      <div className="chat-container">

        <header className='chat-header'>

          <div className='header-sub'>

            <button className='back-btn' onClick={() => setSelectedContact(null)}><IoArrowBack size={22} /></button>

            {
              selectedContact &&
              (
                <div className='chat-sub-div' key={selectedContact.id}>
                  <img className='chat-image' src={selectedContact.profileImage || defaultProfileImage}
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultProfileImage;
                    }}
                  />

                  <div className='chat-upper-details'>
                    <p className='p1'>{selectedContact.contactName}</p>
                    <p className='p2'>{selectedContact.profileTag || selectedContact.phoneNo}</p>
                  </div>

                </div>
              )}
          </div>

          <div className='chat-icon' onClick={() => setShowPopUp(prev => !prev)}>
            <BsThreeDotsVertical size={22} />
            {
              showPopUp && (
                <div className='show-chat-popup'>

                  <button className='btn-1'><span><MdDeleteForever size={21} /></span> Delete</button>

                  <button className='btn-2' onClick={() => {
                    const newStatus = selectedContact.status === "CONNECTED"
                      ? "BLOCKED" : "CONNECTED"
                    handleStatus(newStatus, selectedContact.Fid)
                  }}>
                    <span className='block-icon'><MdBlock size={21} /></span>
                    {selectedContact.status === "CONNECTED" ? "Block" : "Unblock"}</button>

                  <button className='btn-3'><span><MdDeleteOutline size={21} /></span> Delete All
                  </button>

                </div>
              )
            }
          </div>


        </header>


        <main className="chat-body" ref={chatBodyRef}>

          {messages.map((msg, index) => {

            const currentDate = new Date(msg.localDateTime).toLocaleDateString();

            const previousDate =
              index > 0
                ? new Date(messages[index - 1].localDateTime).toLocaleDateString()
                : null;

            const isNewDate = currentDate !== previousDate;

            const isMe = msg.senderId === success?.data?.id;

            return (
              <React.Fragment key={msg.id || index}>

                {isNewDate && (
                  <div className="chat-date">
                    {new Date(msg.localDateTime).toLocaleDateString([], {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}

                <div
                  className={`message-wrapper ${isMe ? "sent" : "received"
                    }`}
                >
                  <div className="message-bubble">

                    <div>

                      <p className="message-content">
                        {msg.content}
                      </p>

                      <span className="message-time">
                        {new Date(msg.localDateTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                    </div>

                  </div>
                </div>

              </React.Fragment>
            );
          })}

        </main>


        <footer ref={footerRef} className="chat-footer">

          <div className="chat-input-div">

            <textarea
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className="chat-input"
              value={text}
              onChange={handleChange}
              placeholder={
                selectedContact?.status === "BLOCKED"
                  ? "Blocked Account" : "Type a message..."
              }
              rows={1}
              disabled={selectedContact?.status === "BLOCKED"}
            />

            <span className={`send-icon ${selectedContact?.status === "BLOCKED"
              ? "disabled"
              : ""
              }`}
              onClick={handleSend}>
              <IoSend size={24} />
            </span>

          </div>

        </footer>

      </div>
    </>

  )
}
