/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Outlet, useNavigate } from 'react-router'
import { useContext, useEffect } from 'react'
import { AuthContext } from './AuthProvider'

export function NonAuthUsers (): any {
  const { user } = useContext(AuthContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (user) navigate('/')
  }, [user])
  if (user === null) return <Outlet></Outlet>
}
