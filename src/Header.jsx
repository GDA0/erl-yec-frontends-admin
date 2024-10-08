import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export function Header ({ user, setShowCheckoutModal }) {
  return (
    <header>
      <nav className='navbar fixed-top bg-white border-bottom border-1'>
        <div className='container'>
          <Link className='navbar-brand'>ERL YEC</Link>
          {user && (
            <>
              <div className='ms-auto'>Welcome, {user.firstName}</div>
              <span className='mx-2'>|</span>
              <a
                className='text-danger button-link'
                onClick={() => setShowCheckoutModal(true)}
              >
                Check out
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

Header.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired
  }).isRequired,
  setShowCheckoutModal: PropTypes.func.isRequired
}
