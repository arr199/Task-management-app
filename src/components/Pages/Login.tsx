import { NavLink, useNavigate } from 'react-router-dom'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordFill } from 'react-icons/ri'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useFirebase } from '../../utils/functions'

export function Login (): JSX.Element {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { auth } = useFirebase()
  const provider = new GoogleAuthProvider()

  function handleSubmit (e: React.FormEvent): void {
    e.preventDefault()
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        console.log('Error :', err)
        setError(err.message)
      })
  }

  function handleGoogleLogin (): void {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        console.log('Error :', err)
        setError(err.message)
      })
  }

  return (
    <main className="grid place-items-center h-screen bg-gradient-to-r from-[#1b1a1a] to-[#212127] ">
      <form
        onChange={() => {
          setError('')
        }}
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 p-6 min-w-[320px] mb-20    "
      >
        <img src="/assets/logo-light.svg" alt="kanban logo" />
        <div className="relative py-6 w-full flex justify-center items-center">
          <span className="absolute  text-red-500 py-4 text-[12px] text-center">
            {error.length > 0 && error.replaceAll('Firebase:', '')}{' '}
          </span>
        </div>
        {/* EMAIL */}
        <div className="flex gap-2 relative    w-full ">
          <MdEmail className="absolute top-3 left-4 w-5 h-4 text-slate"></MdEmail>
          <input
            data-id="email-input"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
            }}
            className=" shadow-[0px_0px_10px_2px_#5a52c7]
                    w-full py-2 border-2   border-[#666565]  text-[14px] bg-transparent px-8 text-center text-white
                    rounded-r-full rounded-l-full hover:border-[#5a52c7] focus:bg-[#302d2d] hover:bg-[#302d2d]   focus:border-[#5a52c7]  outline-none"
            placeholder="Email"
            type="email"
          ></input>
        </div>
        {/* PASSWORD */}
        <div className="flex gap-2 relative    w-full">
          <RiLockPasswordFill className="absolute top-3 left-4 w-5 h-4 text-slate"></RiLockPasswordFill>
          <input
            data-id="password-input"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value })
            }}
            className="shadow-[0px_0px_10px_2px_#5a52c7] focus:bg-[#302d2d] hover:bg-[#302d2d]
                    w-full py-2 border-2  border-[#666565]  text-[14px] bg-transparent px-8 text-center text-white
                    rounded-r-full rounded-l-full hover:border-[#5a52c7] focus:border-[#5a52c7]  outline-none"
            placeholder="Password"
            type="password"
          ></input>
        </div>
        {/* LOGIN */}

        <button
          data-id="login-button"
          disabled={formData.email.replace(/\s+/g, '') === '' || formData.password.replace(/\s+/g, '') === ''}
          className="mt-2 disabled:bg-[#8e8cd8]  active:scale-95   shadow-[0px_0px_6px_2px_#5a52c7] bg-[#635FC7] font-bold hover:bg-[#908eca]   w-full self-center gap-4 py-2  text-[14px] px-8 text-center text-white
                    rounded-r-full rounded-l-full duration-300 transition-colors "
        >
          Login
        </button>
        {/* GOOGLE */}
        <span className="text-center text-[14px] text-[#666565] font-bold">or continue with </span>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="active:scale-95   shadow-[0px_0px_3px_2px_#5a52c7] flex items-center gap-4 justify-center w-full py-2    text-[14px] bg-transparent px-8 text-center text-white
                    rounded-r-full duration-300 transition-colors rounded-l-full  hover:bg-[#2b2828]    font-bold"
        >
          <FcGoogle></FcGoogle>Google
        </button>
        <span className="text-[14px] text-center flex flex-col gap-2">
          Don&apos;t have an account?{' '}
          <NavLink to="/signup" className="text-[#635FC7]">
            Create one!
          </NavLink>{' '}
        </span>
      </form>
    </main>
  )
}
