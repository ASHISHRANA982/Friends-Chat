import React, { useEffect, useState } from 'react'
import './style/login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearMessage } from '../../api-calls/auth/registerSlice'
import { loginSuccess } from '../../api-calls/auth/authSlice'
import { MdPerson2, MdPassword } from "react-icons/md"
import { toast } from "sonner"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toastStyles } from '../../components/common/toastStyles'

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username should be at least 3 characters long"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password should be at least 8 characters long")
})

const UserLogin = () => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")

  const dispatcher = useDispatch()
  const navigate = useNavigate()

  const { loading, success, error } = useSelector(
    (state) => state.createSlice
  )

  useEffect(() => {

    if (errors.username) {
      setLoginError(errors.username.message)
      return
    }

    if (errors.password) {
      setLoginError(errors.password.message)
      return
    }

    setLoginError("")

  }, [errors])

  useEffect(() => {

    if (success) {

      toast.success(success.message, {
        style: toastStyles.success
      })

      dispatcher(loginSuccess(success.data))
      dispatcher(clearMessage())

      navigate("/profile")
    }

    if (error) {

      if (error.errors) {

        const message = Object.values(error.errors)[0]
        setLoginError(message)

      } else {

        setLoginError(error.message || "Login failed")

      }

      dispatcher(clearMessage())
    }

  }, [success, error, dispatcher, navigate])

  const handleUsernameChange = () => {
    setLoginError("")
  }

  const handlePasswordChange = () => {
    setLoginError("")
  }

  const onSubmit = (data) => {

    setLoginError("")
    dispatcher(clearMessage())

    dispatcher(loginUser(data))
  }

  return (
    <div className='main-login'>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='sub-login'
      >

        <div className='heading-login'>

          <h1>Welcome Back</h1>

          <p>Sign in to continue chatting</p>

          <p>with your friends</p>

        </div>


        <div className='input-login'>

           {loginError && (
          <p className='login-form-error'>
            {loginError}
          </p>
        )}

          <div className="input-group">

            <label>Username</label>

            <div className="input-box">

              <MdPerson2 size={24} />

              <input
                className='input-1'
                type="text"
                placeholder='username'
                id='username'
                {...register('username', {
                  onChange: handleUsernameChange
                })}
              />

            </div>

          </div>

          <div className="input-group">

            <label>Password</label>

            <div className="input-box">

              <MdPassword size={24} />

              <input
                className='input-1'
                type={showPassword ? "text" : "password"}
                placeholder='password'
                id='password'
                {...register('password', {
                  onChange: handlePasswordChange
                })}
              />

              <span
                className='password-eye'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>

            </div>

          </div>

        </div>

        <div className='check-box'>

          <p>
            <Link to="/">
              Forgot Password?
            </Link>
          </p>

        </div>

        <div className='submit-login'>

          <button
            type='submit'
            disabled={loading}
          >

            {loading ? (
              <span className='spinner'></span>
            ) : (
              "Login"
            )}

          </button>

          <p>
            Don't have an account?
            <span>
              <Link to='/register'>
                Register
              </Link>
            </span>
          </p>

        </div>

      </form>

    </div>
  )
}

export default UserLogin
