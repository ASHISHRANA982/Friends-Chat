import React, { useEffect, useState } from 'react'
import "./style/userRegistration.css"
import { Link } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDispatch, useSelector } from 'react-redux'
import { createUser, clearMessage } from '../../api-calls/auth/registerSlice'
import RegisterImg from '../../assets/Register.png'
import { MdPerson2, MdEmail, MdPassword, MdPhone } from "react-icons/md"
import { IoArrowForward } from "react-icons/io5"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "sonner"

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name should be at least 2 characters long"),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(5, "Username should be at least 5 characters long"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password should be at least 8 characters long")
})

const UserRegistration = () => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const dispatcher = useDispatch()

  const { loading, success, error } = useSelector(
    (state) => state.createSlice
  )

  const [showPassword, setShowPassword] = useState(false)
  const [registerError, setRegisterError] = useState("")

  useEffect(() => {

    if (errors.name) {
      setRegisterError(errors.name.message)
      return
    }

    if (errors.phone) {
      setRegisterError(errors.phone.message)
      return
    }

    if (errors.email) {
      setRegisterError(errors.email.message)
      return
    }

    if (errors.username) {
      setRegisterError(errors.username.message)
      return
    }

    if (errors.password) {
      setRegisterError(errors.password.message)
      return
    }

    setRegisterError("")

  }, [errors])

  useEffect(() => {

    if (success) {

      toast.success(success.message)

      dispatcher(clearMessage())

    }

    if (error) {

      if (error.errors) {

        const message = Object.values(error.errors)[0]

        setRegisterError(message)

      } else {

        setRegisterError(
          error.message || "Registration failed"
        )

      }

      dispatcher(clearMessage())

    }

  }, [success, error, dispatcher])

  const handleInputChange = () => {
    setRegisterError("")
  }

  const onSubmit = (data) => {

    setRegisterError("")
    dispatcher(clearMessage())

    const userData = {
      user: {
        name: data.name,
        phoneNo: data.phone,
        email: data.email
      },

      userLogin: {
        username: data.username,
        password: data.password
      }
    }

    dispatcher(createUser(userData))
  }

  return (

    <div className='register-user-main'>

      <div className='register-user-card'>

        <div className="register-inner-card-1">

          <div>
            <h1 className='register-h1'>
              Connect. Chat.
            </h1>

            <h1 className='register-h2'>
              Stay. Together.
            </h1>
          </div>

          <div>
            <p>Create your account and start your</p>
            <p>journey with Friends Chat. Stay</p>
            <p>connected with your friends</p>
            <p>anytime, anywhere.</p>
          </div>

        </div>

        <div className="register-inner-card-2">

          <img
            src={RegisterImg}
            alt="Registration"
            loading='eager'
            fetchPriority='high'
          />

        </div>

      </div>

      <div className='register-user-right'>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='register-form'
        >

          <div className='register-user register-user-heading'>

            <h2>
              Create <span>Your Account</span>
            </h2>

            <p>
              Join Friends Chat and start messaging instantly
            </p>

          </div>

          {registerError && (
            <p className='register-form-error'>
              {registerError}
            </p>
          )}

          <div className='register-user register-user-details'>

            <div className='register-input-group'>

              <label htmlFor='name'>
                Full Name
              </label>

              <div className='register-input-box'>

                <span>
                  <MdPerson2 />
                </span>

                <input
                  placeholder='Enter Your Full Name'
                  type="text"
                  id="name"
                  {...register('name', {
                    onChange: handleInputChange
                  })}
                />

              </div>

            </div>

            <div className='register-input-group'>

              <label htmlFor='phone'>
                Mobile No
              </label>

              <div className='register-input-box'>

                <span>
                  <MdPhone />
                </span>

                <input
                  placeholder='Enter Your Phone No'
                  type="text"
                  id="phone"
                  {...register('phone', {
                    onChange: handleInputChange
                  })}
                />

              </div>

            </div>

            <div className='register-input-group'>

              <label htmlFor='email'>
                Email Address
              </label>

              <div className='register-input-box'>

                <span>
                  <MdEmail />
                </span>

                <input
                  placeholder='Enter Your Email Address'
                  type="email"
                  id="email"
                  {...register('email', {
                    onChange: handleInputChange
                  })}
                />

              </div>

            </div>

          </div>

          <div className='register-user register-user-login-details'>

            <div className='register-input-group'>

              <label htmlFor='username'>
                Username
              </label>

              <div className='register-input-box'>

                <span>
                  @
                </span>

                <input
                  placeholder='Enter Your Username'
                  type="text"
                  id='username'
                  {...register('username', {
                    onChange: handleInputChange
                  })}
                />

              </div>

            </div>

            <div className='register-input-group'>

              <label htmlFor='password'>
                Password
              </label>

              <div className='register-input-box'>

                <span>
                  <MdPassword />
                </span>

                <input
                  placeholder='Enter Your Password'
                  type={showPassword ? "text" : "password"}
                  id='password'
                  {...register('password', {
                    onChange: handleInputChange
                  })}
                />

                <span
                  className='password-eye'
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                >
                  {showPassword
                    ? <FaEye />
                    : <FaEyeSlash />
                  }
                </span>

              </div>

            </div>

          </div>

          <div className='register-user register-user-signup'>

            <button
              type="submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <IoArrowForward />
                </>
              )}

            </button>

            <span>
              Already Have An Account ?

              <span id='register-link'>
                <Link to="/login">
                  Sign in
                </Link>
              </span>

            </span>

          </div>

        </form>

      </div>

    </div>
  )
}

export default UserRegistration
