import { nanoid } from "nanoid";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getColor,
  mainPointerEvents,
  removeOpacityClass,
  showValidationErrors,
  useFirebase,
} from "../../Utils/functions";
import { AuthContext } from "../auth/AuthProvider";
import { setDoc, doc } from "firebase/firestore";
import { useGetBoards } from "../../Utils/hooks";
import { motion } from "framer-motion";
import ani from "../../assets/motions";

export function AddColumnForm({ boards, setBoards, setShowNewColumnForm }: AddColumnFormProps): JSX.Element {
  const [formData, setFormData] = useState<Column>({ name: "", id: "", tasks: [], color: "" });
  const { board } = useParams();
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();
  const { darkMode } = useGetBoards();

  //   ADDS THE NEW COLUMN
  function handleAddColumn(): void {
    const newBoards = structuredClone(boards);
    newBoards[Number(board)].columns.push({ ...formData, id: nanoid(), color: getColor("") });
    setBoards(newBoards);
    setDoc(doc(db, "users", user as string), { boards: newBoards }).catch((err) => {
      console.log("ERROR ADDING COLUMN", err);
    });
    setShowNewColumnForm(false);
    mainPointerEvents("auto");
    removeOpacityClass("#new-column-form");
  }
  //  CLOSE THE POP-UP WHEN USER  CLICK OUTSIDE OF IT
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      const newColumnForm = document.querySelector("#new-column-form");
      const target = e.target as HTMLElement;
      if (newColumnForm !== null && !newColumnForm?.contains(target)) {
        setShowNewColumnForm(false);
        mainPointerEvents("auto");
        removeOpacityClass("#new-column-form");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.section
      id="new-column-form"
      className={`absolute rounded-lg task flex flex-col p-6  gap-4 w-[90vw]  sm:w-[350px] h-[220px] inset-0 m-auto pointer-events-auto 
      ${darkMode === "light" ? " bg-white " : "bg-[#2B2C37]"} `}
      {...ani.scaleAnimationCenterExitCenter()}
    >
      <h1
        className={` font-bold   
          ${darkMode === "light" ? " text-black " : "text-white"}`}
      >
        New Column
      </h1>
      <div className="relative">
        <input
          style={{ border: showValidationErrors(formData.name) !== "" ? "1px solid red" : "" }}
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          className={`text-[0.8125rem] w-full bg-[#2B2C37] p-3 rounded border-[1px]  border-[#bdbaba] 
                  ${darkMode === "light" ? " bg-white text-black" : "text-white"}`}
          placeholder="e.g   Pending"
        ></input>
        <span className="text-red-500 absolute right-2 top-4 text-[10px] font-light">
          {showValidationErrors(formData.name)}
        </span>
      </div>
      <button
        disabled={formData.name.replace(/\s+/g, "") === ""}
        onClick={handleAddColumn}
        className="disabled:bg-red-500 mt-5 hover:bg-[#A8A4FF] font-bold bg-[#635FC7] text-white text-[13px] rounded-3xl p-3"
      >
        Add Column
      </button>
    </motion.section>
  );
}
