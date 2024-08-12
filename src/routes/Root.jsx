import { Outlet } from 'react-router-dom'

import { Header } from '../Header'
import { Footer } from '../Footer'

export function Root () {
  return (
    <>
      <Header />
      <main className='container my-5 py-3'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
