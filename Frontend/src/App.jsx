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
import UserFriends from './components/user/UserFriends'
import ChatView from './components/chat/ChatView'
import { AccessDenie } from './components/common/AccessDenie'
import { Toaster } from 'sonner'
import './App.css';
import { UpdateUserProfile } from './components/user/UpdateUserProfile'
import { useEffect } from 'react'

import { userProfile} from './api-calls/user/profileSlice'
import {  initializeCsrf } from './services/csrfService'


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((state) => state.authSlice)

  if (!authChecked) {
    return <div className="loader-container"><div className="loader"></div></div>
  }

  return isAuthenticated ? children : <Navigate to="/accessDenied" replace />
}

function App() {

  const { isAuthenticated, authChecked } = useSelector(
    (state) => state.authSlice
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userProfile())
  }, [dispatch]);

useEffect(()=>{
initializeCsrf();
})


  if (!authChecked) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const loggedIn = isAuthenticated;

  return (
    <>
      {!loggedIn && <Navbar />}

      <Routes>

        <Route path="/" element={loggedIn ? <Navigate to="/root" replace /> : <Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/register" element={<UserRegistration />} />

        <Route path="/login" element={<UserLogin />} />

        <Route path="/accessDenied" element={<AccessDenie />} />

        <Route path="/root" element={<ProtectedRoute><Root /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        <Route path="/friend" element={<ProtectedRoute><UserFriends /></ProtectedRoute>} />

        <Route path="/chat" element={<ProtectedRoute><ChatView /></ProtectedRoute>} />

        <Route path="/updateProfile" element={<ProtectedRoute><UpdateUserProfile /></ProtectedRoute>} />

        <Route path="/addFriends" element={<ProtectedRoute><AddFriend /></ProtectedRoute>} />

        <Route path="/request" element={<ProtectedRoute><Request /></ProtectedRoute>} />

        <Route path="/invitation" element={<ProtectedRoute><Invitation /></ProtectedRoute>} />

      </Routes>

      <ToastContainer />

      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            success: "toast-success",
            error: "toast-error",
          },
        }}
      />
    </>
  );
}

export default App
