import Home from './components/home/Home'
import About from './components/home/About'
import Contact from './components/home/Contact'
import UserRegistration from './components/auth/UserRegistration'
import Navbar from './components/home/Navbar'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import UserLogin from './components/auth/UserLogin'
import { ToastContainer } from 'react-toastify'
import UserProfile from './components/user/UserProfile'
import { useSelector, useDispatch } from 'react-redux'
import UserRequest from './components/user/UserRequest'
import UserFriends from './components/user/UserFriends'
import ChatView from './components/chat/ChatView'
import { AccessDenie } from './components/common/AccessDenie'
import { Toaster, toast } from 'sonner'
import './App.css';
import { UpdateUserProfile } from './components/user/UpdateUserProfile'
import { useChat } from './components/chat/ChatContext'
import { useState, useEffect } from 'react'

import { userProfile} from './api-calls/user/profileSlice'


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.authSlice)

  if (!authChecked) {
    return <div className="loader-container"><div className="loader"></div></div>
  }

  return isAuthenticated ? children : <Navigate to="/accessDenied" replace />
}


function App() {

  const { isAuthenticated, authChecked } = useSelector((state) => state.authSlice);

  const loggedIn = isAuthenticated && authChecked;

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userProfile())
  }, [dispatch])

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

        <Route path="/" element={loggedIn ? <Navigate to="/profile" /> : <Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<UserRegistration />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/accessDenied' element={<AccessDenie />} />



        <Route path='/profile' element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path='/request' element={<ProtectedRoute><UserRequest /></ProtectedRoute>} />
        <Route path='/friend' element={<ProtectedRoute><UserFriends /></ProtectedRoute>} />
        <Route path='/chat' element={<ProtectedRoute><ChatView /></ProtectedRoute>} />
        <Route path='/updateProfile' element={<ProtectedRoute><UpdateUserProfile /></ProtectedRoute>} />


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
