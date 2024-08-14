import { Outlet } from 'react-router-dom'
import { useState } from 'react'

import { Header } from '../Header'
import { Footer } from '../Footer'

export function Root () {
  const [user, setUser] = useState(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  return (
    <div className='d-flex min-vh-100'>
      <Header user={user} setShowCheckoutModal={setShowCheckoutModal} />
      <main className='container my-5 py-3 flex-grow-1'>
        <Outlet context={[setUser, showCheckoutModal, setShowCheckoutModal]} />
      </main>
      <Footer />
    </div>
  )
}
