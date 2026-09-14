import Home from './components/home/Home'
import About from './components/home/About'
import Contact from './components/home/Contact'
import UserRegistration from './components/auth/UserRegistration'
import Navbar from './components/home/Navbar'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import UserLogin from './components/auth/UserLogin'
import { ToastContainer } from 'react-toastify'
import UserProfile from './components/user/UserProfile'
import { useSelector } from 'react-redux'
import UserRequest from './components/user/UserRequest'
import UserFriends from './components/user/UserFriends'
import ChatView from './components/chat/ChatView'
import { AccessDenie } from './components/common/AccessDenie'
import { Toaster, toast } from 'sonner'
import './App.css';
import { UpdateUserProfile } from './components/user/UpdateUserProfile'
import { useChat } from './components/chat/ChatContext'
import { useState,useEffect } from 'react'


function App() {

  const { token } = useSelector((state) => state.authSlice);
  const { selectedContact } = useChat();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <>

      {
        !(isMobile && selectedContact) && <Navbar />
      }

      <Routes>

        <Route path="/" element={token ? <Navigate to="/profile" /> : <Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<UserRegistration />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/accessDenied' element={<AccessDenie />} />



        <Route path='/profile' element={token ? <UserProfile /> : <Navigate to='/accessDenied' replace />} />
        <Route path='/request' element={token ? <UserRequest /> : <Navigate to='/accessDenied' replace />} />
        <Route path='/friend' element={token ? <UserFriends /> : <Navigate to='/accessDenied' replace />} />
        <Route path='/chat' element={token ? <ChatView /> : <Navigate to='/accessDenied' replace />} />
        <Route path='/updateProfile' element={token ? <UpdateUserProfile /> : <Navigate to='/accessDenied' replace />} />







      </Routes>

      <ToastContainer />
      <Toaster position='top-center'
        toastOptions={{
          classNames: {
            success: "toast-success",
            error: "toast-error",
          },
        }}
      />

    </>
  )
}

export default App
