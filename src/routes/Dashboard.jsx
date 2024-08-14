import { useEffect, useState } from 'react'
import { useOutletContext, useNavigate, Link } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import { startOfWeek, endOfWeek, format } from 'date-fns'

import axios from '../utils/axios-instance'
import { formatDate } from '../utils/formatDate'

export function Dashboard () {
  const [setUser, showCheckoutModal, setShowCheckoutModal] = useOutletContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userMsg, setUserMsg] = useState('')
  const [generating, setGenerating] = useState(false)

  const navigate = useNavigate()

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
          setUserMsg('Your session was over.')
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

  async function handleDeactivate (userId) {
    try {
      await axios.post('deactivate-user', { userId })
      setActiveUsers((prev) => prev.filter((user) => user._id !== userId))
      setShowDeactivateModal(false)
      setMsg('User deactivated successfully.')
    } catch (error) {
      console.error(error)
      setError('Failed to deactivate user.')
    }
  }

  async function handleDeactivateAllActiveUsers () {
    try {
      await axios.post('deactivate-all-active-users')
      setUser(null)
      localStorage.removeItem('token')
      navigate('/')
    } catch (error) {
      console.error(error)
      setError('Failed to deactivate users or check-out.')
    } finally {
      setLoading(false)
      setShowCheckoutModal(false)
    }
  }

  async function handleGenerateWeeklyReport () {
    try {
      setGenerating(true)
      const response = await axios.get('generate-weekly-report', {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url

      const today = new Date()
      const startOfThisWeek = format(
        startOfWeek(today, { weekStartsOn: 1 }),
        'do MMMM'
      )
      const endOfThisWeek = format(
        endOfWeek(today, { weekStartsOn: 1 }),
        'do MMMM'
      )
      const filename = `Weekly Report - ${startOfThisWeek} to ${endOfThisWeek}.xlsx`
      link.setAttribute('download', `${filename}`)

      // Append the link to the body
      document.body.appendChild(link)
      link.click()

      // Cleanup
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      setError('An error occurred.')
    } finally {
      setGenerating(false)
    }
  }

  function DeactivateModal () {
    if (!selectedUser) return null

    return (
      <Modal
        show={showDeactivateModal}
        onHide={() => setShowDeactivateModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deactivation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to deactivate {selectedUser.fullName}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowDeactivateModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => handleDeactivate(selectedUser._id)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  function CheckOutModal () {
    return (
      <Modal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Check-out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>There are currently {activeUsers.length} active users.</p>
          <p>
            Checking out will deactivate all active users. Do you wish to
            proceed?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowCheckoutModal(false)}
          >
            Cancel
          </Button>
          <Button variant='danger' onClick={handleDeactivateAllActiveUsers}>
            Confirm and Check-out
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <>
      {error && (
        <div
          className='alert alert-danger alert-dismissible fade show mx-auto text-center'
          style={{ maxWidth: '360px' }}
        >
          <span className='mb-1'>{error}</span>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
          />
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
          className='alert alert-warning alert-dismissible fade show mx-auto text-center'
          style={{ maxWidth: '300px' }}
        >
          <span className='mb-1'>{msg}</span>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
          />
        </div>
      )}

      {userMsg && (
        <div
          className='alert alert-warning mx-auto text-center'
          style={{ maxWidth: '300px' }}
        >
          <p className='mb-1'>{userMsg}</p>
          <Link to='/check-in'>Check in</Link>
        </div>
      )}

      {showDeactivateModal && <DeactivateModal />}
      {showCheckoutModal && <CheckOutModal />}

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
              <button
                className='btn btn-primary w-100'
                type='submit'
                onClick={handleGenerateWeeklyReport}
                disabled={generating}
              >
                {generating
                  ? 'Generating weekly report...'
                  : 'Generate weekly report'}
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
                            <a
                              className='text-danger button-link'
                              onClick={() => {
                  setSelectedUser(user)
                  setShowDeactivateModal(true)
                }}
                            >
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
                <p>No active users available.</p>
                )}
          </div>
        </div>
      )}
    </>
  )
}
