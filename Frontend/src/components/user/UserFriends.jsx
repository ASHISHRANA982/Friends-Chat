import React, { Suspense, useEffect, useState } from 'react'
import './style/userFriends.css'
import { FaSearch } from "react-icons/fa";
import { lazy } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { IoCloseOutline, IoInformationCircleOutline } from "react-icons/io5";
import ChatView from '../chat/ChatView';
import { useChat } from '../chat/ChatContext';

const MainContent = lazy(() => import("./MainContent"))
const UserRequest = lazy(() => import('./UserRequest'));
const AddFriend = lazy(() => import('./AddFriend'));

const UserFriends = ({ setShowProfile, setShowInfo }) => {

  const [activeTab, setActiveTab] = useState("");
  const [showPopUp, setShowPopUp] = useState(false);
  const [open, setOpen] = useState(false);
  // const [selectedContact, setSelectedContact] = useState(null)
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [searchData,setSearchData]=useState("");

  const {selectedContact,setSelectedContact}=useChat();
  

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setFriendsLoading(false);
    },2000);
    return ()=>clearTimeout(timer)
  },[friendsLoading])


  return (
    <div className='friends-main-div'>

      {
        !selectedContact && (
          <nav className='nav-class'>

            <div
              className='mobile-profile-icon'
              onClick={() => setShowProfile(true)}
            >
              <FiUser size={24} />
            </div>

            <div className='mobile-icon-div'>
              <div className='sub-menu-icon' onClick={() => setOpen(!open)}>
                <BsThreeDotsVertical size={22} />
              </div>

              <div className='sub-menu-icon' onClick={() => setShowInfo(true)}>
                <IoInformationCircleOutline size={24} />
              </div>
            </div>

            <div className={`nav-btn ${open ? "sub-active" : ""}`}>
              <div
                className="close-nav"
                onClick={() => setOpen(false)}
              >
                <IoCloseOutline size={28} />
              </div>

              {
                friendsLoading && (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                )
              }
              <button onClick={() => 
                {
                  setActiveTab('request');
                  setFriendsLoading(true);
                }
              } className='request-btn'>Pending Requests</button>

              <button onClick={() =>
                {
                  setActiveTab('invitation');
                  setFriendsLoading(true);
                }
              } className='request-btn'>Friend Invitations</button>



              <button onClick={() => setShowPopUp(true)} className='add-btn'>Add Friend</button>

            </div>

            <div className='search-div'>
              <input 
              value={searchData}
              onChange={(e)=>setSearchData(e.target.value)}
              type="search" 
              placeholder='Search Name Here..' />
              <button>
                <FaSearch size={15} />
              </button>

            </div>

          </nav>
        )
      }

      <div>
        {
          activeTab && 
          <Suspense fallback={
            <p></p>
          }>
          <UserRequest requestType={activeTab} setActiveTab={setActiveTab} />
          </Suspense>
        }
      </div>

      <div>
        {showPopUp && (
          <AddFriend
            setShowPopUp={() => setShowPopUp(false)}
          />
        )}
      </div>

      {
        !activeTab && !selectedContact && (
          <div className="content-area">
            <Suspense fallback={<p></p>}>
            <MainContent
            searchData={searchData}/>
            </Suspense>
          </div>
        )
      }

      {
        !activeTab && selectedContact && (
          <div className="content-area chat-content-area">
            <Suspense fallback={<p></p>}>
            <ChatView 
              key={selectedContact?.id}
               />
              </Suspense>
          </div>
        )
      }

    </div>
  )
}
export default UserFriends;




