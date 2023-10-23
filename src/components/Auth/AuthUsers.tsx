/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { useContext, useEffect } from 'react'

export function AuthUsers (): JSX.Element | undefined {
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (user === null) {
      navigate('/login')
    }
  }, [user])

  if (user) return <Outlet></Outlet>
}
