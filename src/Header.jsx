import { Link } from 'react-router-dom'

export function Header () {
  return (
    <header>
      <nav className='navbar fixed-top bg-white border-bottom border-1'>
        <div className='container'>
          <Link className='navbar-brand'>ERL YEC</Link>
        </div>
      </nav>
    </header>
  )
}
