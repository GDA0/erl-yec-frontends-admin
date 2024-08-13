import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import axios from '../utils/axios-instance'
import { formatDate } from '../utils/formatDate'

export function Dashboard () {
  const [setUser] = useOutletContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    async function fetchData (isAutoRefresh = false) {
      try {
        if (!isAutoRefresh) {
          setLoading(true)
        }

        const response = await axios.get('dashboard')
        const { user, activeUsers, allUsers } = response.data

        if (!user) {
          setUser(null)
          localStorage.removeItem('token')
          setMsg('Your session is over!')
        } else {
          setUser(user)
          setActiveUsers(activeUsers)
          setAllUsers(allUsers)
        }

        setError('')
      } catch (error) {
        console.error(error)
        setError('An error occurred.')
      } finally {
        if (!isAutoRefresh) {
          setLoading(false)
        }
      }
    }

    fetchData()

    const intervalId = setInterval(() => fetchData(true), 1 * 60 * 1000) // Auto-refresh every 1 minutes (in milliseconds)

    return () => clearInterval(intervalId)
  }, [setUser])

  return (
    <>
      {error && (
        <div
          className='alert alert-danger mx-auto text-center'
          style={{ maxWidth: '360px' }}
        >
          <p className='mb-1'>{error}</p>
          <Link to='/'>Go to Homepage.</Link>
        </div>
      )}

      {loading && (
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      )}

      {msg && (
        <div
          className='alert alert-warning mx-auto text-center'
          style={{ maxWidth: '300px' }}
        >
          <p className='mb-1'>{msg}</p>
          <Link to='/check-in'>Check in</Link>
        </div>
      )}

      {!loading && allUsers.length > 0 && (
        <div className='d-flex h-100 border rounded'>
          <div
            className='sidebar bg-light bottom-0 top-0 overflow-y-auto overflow-x-hidden rounded-start p-3 d-flex flex-column'
            style={{ minWidth: '240px' }}
          >
            <div>
              <div className='mb-3'>
                <span className='h1 text-primary'>{allUsers.length}</span>
                <span className='ms-1 text-muted fw-bold'>Registered</span>
              </div>
              <div className='mb-3'>
                <span className='h3 text-success'>{activeUsers.length}</span>
                <span className='ms-1 text-muted fw-bold'>Active</span>
              </div>
              <div>
                <span className='h5 text-danger'>
                  {allUsers.length - activeUsers.length}
                </span>
                <span className='ms-1 text-muted fw-bold'>Inactive</span>
              </div>
            </div>
            <div className='mt-auto'>
              <button className='btn btn-primary w-100' type='submit'>
                Generate weekly report
              </button>
            </div>
          </div>

          <div className='flex-grow-1 p-3'>
            {activeUsers.length > 0
              ? (
                <div className='table-responsive'>
                  <table className='table table-hover caption-top'>
                    <caption>Active Users</caption>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Check-in time</th>
                        <th>Purpose</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {activeUsers.map((user, index) => (
                        <tr key={index}>
                          <td>{user.fullName}</td>
                          <td>
                            {user.checkInTime
                              ? formatDate(user.checkInTime)
                              : 'N/A'}
                          </td>
                          <td>{user.purpose}</td>
                          <td>
                            <a href='' className='text-danger'>
                              Deactivate
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )
              : (
                <p>No active users are available.</p>
                )}
          </div>
        </div>
      )}
    </>
  )
}
