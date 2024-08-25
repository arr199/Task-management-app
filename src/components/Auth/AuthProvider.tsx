import { createContext, useEffect, useState } from 'react'
import { useFirebase } from '../../utils/functions'
import { onAuthStateChanged } from 'firebase/auth'

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null
})

export function AuthProvider ({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<string | null | undefined>()

  useEffect(() => {
    const { auth } = useFirebase()
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUser(user?.uid)
      } else {
        setUser(null)
      }
    })
  }, [])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}
