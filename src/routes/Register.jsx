import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import axios from '../utils/axios-instance'

export function Register () {
  const [loading, setLoading] = useState(false)
  const [errs, setErrs] = useState([])
  const [msg, setMsg] = useState('')

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()
  const password = watch('password')

  async function onSubmit (data) {
    try {
      setLoading(true)
      const response = await axios.post('register', data)
      const { msg } = response.data

      setMsg(msg)
      setErrs([])

      setTimeout(() => {
        navigate('/check-in')
      }, 1500)
    } catch (error) {
      console.error(error)
      if (!error.response) {
        return setErrs([
          {
            msg: 'An error occurred during registration. Please try again later.'
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
      <h2 className='text-center'>Register</h2>

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
        <div className='mb-3 row row-cols-1 row-cols-md-3'>
          <div className='col'>
            <label htmlFor='firstName' className='form-label'>
              First name
            </label>
            <input
              type='text'
              className='form-control'
              id='firstName'
              autoFocus
              {...register('firstName', {
                required: 'First name is required',
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== '' || 'First name is required'
                }
              })}
            />
            {errors.firstName && (
              <span className='text-danger'>{errors.firstName.message}</span>
            )}
          </div>
          <div className='col'>
            <label htmlFor='middleName' className='form-label'>
              Middle name{' '}
              <small>
                <span className='form-text'>(Optional)</span>
              </small>
            </label>
            <input
              type='text'
              className='form-control'
              id='middleName'
              {...register('middleName')}
            />
          </div>
          <div className='col'>
            <label htmlFor='lastName' className='form-label'>
              Last name
            </label>
            <input
              type='text'
              className='form-control'
              id='lastName'
              {...register('lastName', {
                required: 'Last name is required',
                validate: {
                  notEmpty: (value) =>
                    value.trim() !== '' || 'Last name is required'
                }
              })}
            />
            {errors.lastName && (
              <span className='text-danger'>{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div className='mb-3'>
          <label htmlFor='username' className='form-label'>
            Username
          </label>
          <input
            type='text'
            className='form-control'
            id='username'
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
        <div className='mb-3 row row-cols-1 row-cols-md-2'>
          <div className='col'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              autoComplete='new-password'
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
          <div className='col'>
            <label htmlFor='confirmPassword' className='form-label'>
              Confirm password
            </label>
            <input
              type='password'
              className='form-control'
              id='confirmPassword'
              autoComplete='new-password'
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <span className='text-danger'>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className='text-center'>
        Already have an account? <Link to='/check-in'>Check in</Link>
      </p>
    </div>
  )
}
