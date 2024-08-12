import { useRouteError, Link } from 'react-router-dom'

export function ErrorPage () {
  const error = useRouteError()
  console.error(error)

  return (
    <div className='d-flex flex-column vh-100 align-items-center justify-content-center'>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to={-1}>Back</Link>
    </div>
  )
}
