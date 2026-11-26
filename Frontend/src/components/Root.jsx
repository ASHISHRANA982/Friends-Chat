import React, { useState, useEffect } from 'react'
import './root.css';
import { FiUser, FiClock, FiMail, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import nameToHexColor from './colorGenerate';
import { useDispatch, useSelector } from 'react-redux'
import { getAcceptedFriends, clearAcceptedFriends } from '../api-calls/user/friendsSlice';
import { toast } from "sonner";
import { toastStyles } from "../components/common/toastStyles";
import { getInitials } from './colorGenerate';
import ChatView from './chat/ChatView';
import DefaultChatView from './common/DefaultChatView';

const Root = () => {

  const dispatcher = useDispatch();

  const { acceptedFriend, acceptedFriendStatus, acceptedFriendError } = useSelector((state) => state.friendsSlice);
  const { pendingRequests } = useSelector((state) => state.friendsSlice)
  let { invitations } = useSelector((state) => state.friendsSlice);
  const { success } = useSelector((state) => state.profileSlice);

  const [findSearchData, setFindSearchData] = useState("");
  const [selectedContact, setSelectedContact] = useState();
  const [showContact, setShowContact] = useState(true);

  let profileBgColor = nameToHexColor(success?.data?.name)


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


  const filteredFriends = acceptedFriend?.data?.filter((data) =>
    data.contactName
      ?.toLowerCase()
      .includes(findSearchData?.toLowerCase() || "")
  );

  let friends = acceptedFriend?.data.length;
  let sent = pendingRequests?.data.length;
  let received=invitations?.data.length;


  return (
    <main id='rootMain'>


      <section className={`mainSection1 ${!showContact ? 'mobileHidden' : ''}`}>

        <div className="section1Menu">


          <Link to="/root" className='icons' > <FiUser size={24} /></Link>

          <Link to="/request" className='icons'> <FiClock size={24} /></Link>

          <Link to="/invitation" className='icons'><FiMail size={24} /></Link>

          <Link to="/addFriends" className='icons'> <FiUserPlus size={24} /></Link>


        </div>

        <div className="section1profile">

          <Link to="/profile" className='section1ProfileSpan'
            style={{ backgroundColor: profileBgColor }}>{getInitials(success?.data?.name)}</Link>

        </div>

      </section>

      <section className={`mainSection2 ${!showContact ? 'mobileHidden' : ''}`}>

        <div className="mainSection2ContactList1">
          <h3>Friends</h3>

          <div className="contactListSearchBox">
            <input onChange={(e) => setFindSearchData(e.target.value)} type="text" placeholder='Search contacts..' />
          </div>

          <div className="contactListHeader">
            <p className='contactListHeaderFriend'>Friends {friends || 0}</p>
            <p className='headerP'>Sent {sent || 0}</p>
            <p className='headerP'>Received {received || 0}</p>
          </div>

        </div>

        <div className="mainSection2ContactList2">
          <p className='contactListLine'></p>

          {
            Array.isArray(filteredFriends) &&
            filteredFriends.map((data) => (

              <div className='contactListMainSection' key={data.id}
                onClick={() => { setSelectedContact(data); setShowContact(false); }
                }
              >

                <div className='contactListSubSection'>

                  {

                    data.profileImage ?
                      <img src={data.profileImage} className='contactListProfileImage' /> :
                      <span
                        style={{
                          height: '55px',
                          width: '55px',
                          minWidth: '50px',
                          borderRadius: '50%',
                          backgroundColor: nameToHexColor(data.name),
                          fontSize: '20px',
                          color: 'white',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {getInitials(data.name)}
                      </span>
                  }

                  <div className='contactListText'>
                    <p className='p1'>{data.contactName}</p>
                    <p className='p2'>{data.phoneNo}</p>
                  </div>

                </div>

              </div>

            )
            )
          }


        </div>

      </section>

      <section className="mainSection3">

        {
          selectedContact ? (
            <ChatView selectedContact={selectedContact} setSelectedContact={setSelectedContact} setShowContact={setShowContact} />
          ) : (
            <DefaultChatView name={success?.data?.name} />)
        }

      </section>


    </main>
  )
}

export default Root;






