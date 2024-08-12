/* eslint-disable react/no-unescaped-entities */
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import axios from '../utils/axios-instance'
import { redirectTo } from '../utils/redirect-to'

export function CheckIn () {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    token && navigate('/dashboard')
  }, [navigate])

  const [loading, setLoading] = useState(false)
  const [errs, setErrs] = useState([])
  const [msg, setMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  async function onSubmit (data) {
    try {
      setLoading(true)
      const response = await axios.post('check-in', data)
      const { msg, token } = response.data

      setMsg(msg)
      localStorage.setItem('token', token)
      setErrs([])

      setTimeout(() => {
        redirectTo('/dashboard')
      }, 1500)
    } catch (error) {
      console.error(error)
      if (!error.response) {
        return setErrs([
          {
            msg: 'An error occurred during check-in. Please try again later.'
          }
        ])
      }
      setErrs(error.response.data.errors)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='mx-auto mt-3 p-3 rounded shadow-sm'
      style={{ maxWidth: '720px' }}
    >
      <h2 className='text-center'>Check In</h2>

      {errs.length > 0 && (
        <div className='alert alert-danger'>
          <ul className='mb-0'>
            {errs.map((err) => (
              <li key={err.msg}>{err.msg}</li>
            ))}
          </ul>
        </div>
      )}

      {msg && (
        <div className='alert alert-success' role='alert'>
          {msg}
        </div>
      )}

      <form className='my-3' onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3 row row-cols-1 row-cols-md-2'>
          <div className='col'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              autoComplete='username'
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be between 3 and 20 characters long'
                },
                maxLength: {
                  value: 20,
                  message: 'Username must be between 3 and 20 characters long'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_.]+$/,
                  message:
                    'Username can only contain letters, numbers, underscores, or periods'
                },
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== '' || 'Username is required'
                }
              })}
            />
            {errors.username && (
              <span className='text-danger'>{errors.username.message}</span>
            )}
          </div>
          <div className='col'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              autoComplete='current-password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be between 8 and 64 characters long'
                },
                maxLength: {
                  value: 64,
                  message: 'Password must be between 8 and 64 characters long'
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/,
                  message:
                    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
            />
            {errors.password && (
              <span className='text-danger'>{errors.password.message}</span>
            )}
          </div>
        </div>
        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? 'Checking in...' : 'Check in'}
        </button>
      </form>
      <p className='text-center'>
        Don't have an account? <Link to='/register'>Register</Link>
      </p>
    </div>
  )
}
