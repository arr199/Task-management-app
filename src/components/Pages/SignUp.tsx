import { NavLink } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import { useFirebase } from "../../Utils/functions";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function SignUp(): JSX.Element {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const { auth } = useFirebase();
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(() => {})
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  }

  return (
    <main className=" grid place-items-center h-screen bg-gradient-to-r from-[#1b1a1a] to-[#212127] ">
      <form
        onChange={() => {
          setError("");
        }}
        onSubmit={handleSubmit}
        className=" flex flex-col gap-4 p-6 min-w-[320px] mb-20    "
        action=""
      >
        <img src="/assets/logo-light.svg" alt="kanban logo" />
        <div className="relative py-6 flex justify-center items-center w-full">
          <span className="absolute text-red-500  text-[12px] text-center">
            {error.replaceAll("Firebase:", "")}{" "}
          </span>
        </div>
        {/* EMAIL */}
        <div className="flex gap-2 relative  w-full ">
          <MdEmail className="absolute top-3 left-4 w-5 h-4 text-slate"></MdEmail>
          <input
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
            className=" shadow-[0px_0px_10px_2px_#5a52c7]
                    w-full py-10 border-2  border-[#666565]  text-[14px] bg-transparent px-8 text-center text-white
                    rounded-r-full rounded-l-full hover:border-[#5a52c7] focus:bg-[#302d2d] hover:bg-[#302d2d]   focus:border-[#5a52c7]  outline-none"
            placeholder="Email"
            type="email"
          ></input>
        </div>
        {/* PASSWORD */}
        <div className="flex gap-2 relative    w-full">
          <RiLockPasswordFill className="absolute top-3 left-4 w-5 h-4 text-slate"></RiLockPasswordFill>
          <input
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            className="shadow-[0px_0px_10px_2px_#5a52c7] focus:bg-[#302d2d] hover:bg-[#302d2d]
                    w-full py-2 border-2  border-[#666565]  text-[14px] bg-transparent px-8 text-center text-white
                    rounded-r-full rounded-l-full hover:border-[#5a52c7] focus:border-[#5a52c7]  outline-none"
            placeholder="Password"
            type="password"
          ></input>
        </div>
        {/* CREATE ACCOUNT */}
        <button
          disabled={
            formData.email.replace(/\s+/g, "") === "" ||
            formData.password.replace(/\s+/g, "") === ""
          }
          className="disabled:bg-[#8e8cd8] mt-2 active:scale-95   shadow-[0px_0px_6px_2px_#5a52c7] bg-[#635FC7] font-bold hover:bg-[#908eca]   w-full self-center gap-4 py-2  text-[14px] px-8 text-center text-white
                    rounded-r-full rounded-l-full duration-300 transition-colors "
        >
          Create Account
        </button>
        {/* GO BACK TO LOGIN */}
        <span className="text-[14px] text-center flex flex-col gap-2">
          Already have an account ?{" "}
          <NavLink to="/login" className="text-[#635FC7]">
            Sign in!
          </NavLink>{" "}
        </span>
      </form>
    </main>
  );
}
