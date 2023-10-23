import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { HostLayout } from './components/Pages/HostLayout'
import { Board } from './components/Layout/Board'
import { AuthProvider } from './components/Auth/AuthProvider'
import { NonAuthUsers } from './components/Auth/NonAuthUsers'
import { Login } from './components/Pages/Login'
import { SignUp } from './components/Pages/SignUp'
import { AuthUsers } from './components/Auth/AuthUsers'
import { NotFoundPage } from './components/Pages/NotFoundPage'

export function Router (): JSX.Element {
  const router = createBrowserRouter(createRoutesFromElements(
        <>
                {/* AUTHENTICATED USERS */}
          <Route element={<AuthUsers></AuthUsers>}>
            <Route path='/' element={<HostLayout></HostLayout>} >
                <Route path='/:board' element={<Board></Board>} />
            </Route>
          </Route>

           {/* NON AUTHENTICATED USERS */}
           <Route element={<NonAuthUsers/>}>
              <Route path='login' element={<Login></Login>}></Route>
              <Route path='signup' element={<SignUp></SignUp>}></Route>
           </Route>
         {/* PAGE NOT FOUND */}
           <Route path='*' element={<NotFoundPage></NotFoundPage>}></Route>
        </>
  ))
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  )
}
