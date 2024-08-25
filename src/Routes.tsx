import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { HostLayout } from "./components/pages/HostLayout";
import { Board } from "./components/payout/Board";
import { AuthProvider } from "./components/auth/AuthProvider";
import { NonAuthUsers } from "./components/auth/NonAuthUsers";
import { Login } from "./components/pages/Login";
import { SignUp } from "./components/pages/SignUp";
import { AuthUsers } from "./components/auth/AuthUsers";
import { NotFoundPage } from "./components/pages/NotFoundPage";

export function Router(): JSX.Element {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* AUTHENTICATED USERS */}
        <Route element={<AuthUsers></AuthUsers>}>
          <Route path="/" element={<HostLayout></HostLayout>}>
            <Route path="/:board" element={<Board></Board>} />
          </Route>
        </Route>

        {/* NON AUTHENTICATED USERS */}
        <Route element={<NonAuthUsers />}>
          <Route path="login" element={<Login></Login>}></Route>
          <Route path="signup" element={<SignUp></SignUp>}></Route>
        </Route>
        {/* PAGE NOT FOUND */}
        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </>
    )
  );
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
}
