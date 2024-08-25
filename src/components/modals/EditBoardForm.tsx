import { nanoid } from "nanoid";
import React, { useContext, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import {
  getColor,
  mainPointerEvents,
  removeOpacityClass,
  showValidationErrors,
  useFirebase,
} from "../../Utils/functions";
import { AuthContext } from "../auth/AuthProvider";
import { doc, setDoc } from "firebase/firestore";
import { useGetBoards } from "../../Utils/hooks";
import { motion } from "framer-motion";
import ani from "../../assets/motions";

export function EditBoardForm({ boards, setBoards, setShowEditBoardForm }: EditBoardFormProps): JSX.Element {
  const { board } = useParams();
  const InitialColumns = structuredClone(boards)[Number(board)].columns.map((e) => ({
    name: e.name,
    tasks: e.tasks,
    id: e.id,
    color: e.color,
  }));
  const [formData, setFormData] = useState({ name: boards[Number(board)].name, columns: InitialColumns });
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();
  const { darkMode } = useGetBoards();

  // CONTROLLING THE COLUMNS INPUTS
  function handleColumnChange(e: React.ChangeEvent, index: number): void {
    const newFormData = structuredClone(formData);
    newFormData.columns[index].name = (e.target as HTMLInputElement).value;
    setFormData(newFormData);
  }
  //  ADD NEW COLUMN
  function handleAddColumn(): void {
    const newFormData = structuredClone(formData);
    newFormData.columns.push({ name: "", tasks: [], id: nanoid(), color: getColor("") });
    setFormData(newFormData);
  }

  // SAVE CHANGES
  function handleSaveChanges(e: React.FormEvent): void {
    e.preventDefault();
    const newBoards = structuredClone(boards);
    newBoards[Number(board)].name = formData.name;
    newBoards[Number(board)].columns = formData.columns;
    setBoards(newBoards);
    setDoc(doc(db, "users", user as string), { boards: newBoards }).catch((err) => {
      console.log("ERORR EDITING BOARD : ", err);
    });
    setShowEditBoardForm(false);
    mainPointerEvents("auto");
    // REMOVE THE OPACITY CLASS
    removeOpacityClass("#edit-board-form");
  }

  // REMOVE COLUMN
  function handleRemoveColumn(id: string): void {
    const newFormData = structuredClone(formData);
    newFormData.columns = newFormData.columns.filter((e) => e.id !== id);
    setFormData(newFormData);
  }

  //   CLOSING THE FORM WHEN WE CLICK OUTSIDE OF IT
  useEffect(() => {
    const editBoardForm = document.querySelector("#edit-board-form") as HTMLElement;
    function handleClickOutside(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (editBoardForm !== null && !editBoardForm.contains(target)) {
        mainPointerEvents("auto");
        setShowEditBoardForm(false);
        removeOpacityClass("#edit-board-form");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.form
      id="edit-board-form"
      onSubmit={handleSaveChanges}
      className={`task   gap-5 flex text-black flex-col absolute inset-0 m-auto w-[90vw] sm:w-max sm:min-w-[450px] h-max min-h-[320px]  px-5 py-8 rounded 
    ${darkMode === "light" ? " bg-white " : " bg-[#2B2C37] text-white "}`}
      {...ani.scaleAnimationCenterExitCenter()}
    >
      <h2 className="font-bold ">Edit Board</h2>
      {/* BOARD NAME */}
      <div className="relative flex flex-col gap-1 text-[0.75rem] font-bold">
        <label>Board Name</label>
        <input
          style={{ border: showValidationErrors(formData.name) !== "" ? "1px solid red" : "" }}
          value={formData.name}
          onChange={(e) => {
            setFormData((old) => ({ ...old, name: e.target.value }));
          }}
          className={`hover:border-[#635FC7] text-[0.8125rem] bg-[#2B2C37] p-2 rounded border-[1px] border-[#5f5f5f] 
          ${darkMode === "light" ? " bg-white text-black border-[#bdbaba]" : " bg-[#2B2C37] text-white "}`}
          placeholder="e.g Take a coffee break"
        ></input>
        <span className="text-red-500 absolute right-4 top-8 text-[10px] font-light">
          {showValidationErrors(formData.name)}
        </span>
      </div>
      {/* COLUMNS */}
      {formData.columns.length > 0 ? (
        <div className="flex flex-col gap-1 text-[0.75rem] font-bold w-full">
          <label>Columns</label>
          {formData.columns.map((column, index) => (
            <div className="flex items-center gap-2 w-full" key={column.id}>
              <input
                style={{ border: showValidationErrors(formData.columns[index].name) !== "" ? "1px solid red" : "" }}
                value={formData.columns[index].name}
                onChange={(e) => {
                  handleColumnChange(e, index);
                }}
                className={`hover:border-[#635FC7] text-[0.8125rem] w-full bg-[#2B2C37] p-2 rounded border-[1px] border-[#5f5f5f] 
                ${darkMode === "light" ? " bg-white text-black border-[#bdbaba]" : " bg-[#2B2C37] text-white "}`}
                placeholder="e.g Doing"
              ></input>
              <RxCross1
                onClick={() => {
                  handleRemoveColumn(column.id);
                }}
                className="w-4 h-4 text-[#808080] hover:text-red-600 hover:scale-105 cursor-pointer"
              ></RxCross1>
              <span className="text-red-500 absolute right-14 text-[10px] font-light">
                {showValidationErrors(column.name)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className=" text-red-500 flex justify-center font-light">Add at least 1 column</span>
      )}
      {/* ADD NEW COLUMN */}
      <button
        onClick={handleAddColumn}
        className={`font-bold   text-[13px] rounded-3xl p-2
        ${
          darkMode === "light"
            ? " bg-[#635FC7]  text-white hover:bg-[#A8A4FF] "
            : " bg-white text-[#635FC7] hover:bg-[#635FC7] hover:text-white "
        }`}
        type="button"
      >
        + Add New Column{" "}
      </button>
      {/* SAVE CHANGES */}
      <button
        disabled={
          formData.name.replace(/\s+/g, "") === "" ||
          formData.columns.some((e) => e.name.replace(/\s+/g, "") === "") ||
          formData.columns.length <= 0
        }
        className="disabled:bg-red-500 hover:bg-[#A8A4FF] font-bold bg-[#635FC7] text-white text-[13px] rounded-3xl p-2"
      >
        Save Changes
      </button>
    </motion.form>
  );
}
