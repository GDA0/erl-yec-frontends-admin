import { Outlet } from 'react-router-dom'
import { useState } from 'react'

import { Header } from '../Header'
import { Footer } from '../Footer'

export function Root () {
  const [user, setUser] = useState(null)

  return (
    <div className='d-flex min-vh-100'>
      <Header user={user} />
      <main className='container my-5 py-3 flex-grow-1'>
        <Outlet context={[setUser]} />
      </main>
      <Footer />
    </div>
  )
}
