import { nanoid } from "nanoid";
import React, { useContext, useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

import { API } from "../../utils/API";
import {
  getColor,
  mainPointerEvents,
  removeOpacityClass,
  showValidationErrors,
  useFirebase,
} from "../../utils/functions";
import { AuthContext } from "../auth/AuthProvider";
import { doc, setDoc } from "firebase/firestore";
import { useGetBoards } from "../../utils/hooks";
import { motion } from "framer-motion";
import ani from "../../utils/motions";

export function AddBoardForm({ boards, setBoards, setShowNewBoardForm }: AddBoardFormProps): JSX.Element {
  const [formData, setFormData] = useState<Board>({ name: "", columns: API.INITIAL_BOARD_COLUMNS, id: "" });
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();
  const { darkMode } = useGetBoards();

  //  CREATE THE NEW BOARD
  function handleCreateBoard(e: React.FormEvent): void {
    e.preventDefault();
    const newBoards = structuredClone(boards);
    newBoards.push({ ...formData, id: nanoid() });
    setBoards(newBoards);
    setShowNewBoardForm(false);

    setDoc(doc(db, "users", user as string), { boards: newBoards }).catch((err) => {
      console.log("ERROR ADDING BOARDS:", err);
    });
    mainPointerEvents("auto");
    navigate(`/${boards.length}`);
    removeOpacityClass("#add-board-form");
  }

  // ADDING A COLUMN
  function handleAddColumn(): void {
    const newFormData = { ...formData };
    newFormData.columns.push({ name: "", tasks: [], id: nanoid(), color: getColor("") });
    setFormData(newFormData);
  }
  //  REMOVE A COLUMN
  function handleDeleteColumn(index: number): void {
    const newFormData = structuredClone(formData);
    newFormData.columns.splice(index, 1);
    setFormData(newFormData);
  }
  //  CONTROLLING THE NAME INPUT
  function handleInputChange(e: React.ChangeEvent, index: number): void {
    const newFormData = structuredClone(formData);
    newFormData.columns[index].name = (e.target as HTMLInputElement).value;
    setFormData(newFormData);
  }

  //  CLOSE THE FORM WHEN CLICK OUTSIDE OF IT
  useEffect(() => {
    const boardForm = document.querySelector("#add-board-form");
    function handleClickOutside(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      if (boardForm !== null && !boardForm?.contains(target)) {
        setShowNewBoardForm(false);
        // SETTING MAIN POINTERS EVENTS TO AUTO
        mainPointerEvents("auto");
        removeOpacityClass("#add-board-form");
      }
    }

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const smallScreenMediaQueries = "w-[90vw] sm:min-w-[450px] sm:w-max min-h-[320px] ";

  return (
    <motion.form
      id="add-board-form"
      onSubmit={handleCreateBoard}
      className={`task  pointer-events-auto gap-3 flex flex-col absolute inset-0 m-auto   h-max  px-5 py-8 rounded  z-20
    ${darkMode === "light" ? " text-black  bg-white" : "bg-[#2B2C37] text-white "} ${smallScreenMediaQueries} `}
      {...ani.scaleAnimationCenterExitCenter()}
    >
      <h2 className="font-bold">Add New Board</h2>
      {/* BOARD NAME */}
      <div className="flex flex-col gap-1 text-[0.75rem] font-bold py-4 relative">
        <label>Board Name</label>
        <input
          data-id="new-board-name-input"
          style={{ border: showValidationErrors(formData.name) !== "" ? "1px solid red" : "" }}
          value={formData.name}
          onChange={(e) => {
            setFormData((old) => ({ ...old, name: e.target.value }));
          }}
          className={`hover:border-[#635FC7] text-[0.8125rem] bg-[#2B2C37] p-2 rounded border-[1px] 
          ${
            darkMode === "light"
              ? " bg-white text-black border-[#bdbaba]"
              : " border-[#5f5f5f] bg-[#2B2C37] text-white "
          }`}
          placeholder="e.g. Web Design"
        ></input>
        <span className=" text-red-500 absolute  top-12 right-5 text-[10px] font-light">
          {showValidationErrors(formData.name)}
        </span>
      </div>
      {formData.columns.length > 0 ? (
        <div className="flex flex-col gap-1 text-[0.75rem] font-bold">
          {/* COLUMNS */}
          <label>Board Columns</label>
          {formData.columns.map((column, index) => (
            <div className="flex items-center gap-2 w-full relative" key={column.id}>
              <input
                value={formData.columns[index].name}
                onChange={(e) => {
                  handleInputChange(e, index);
                }}
                className={`hover:border-[#635FC7] text-[0.8125rem] w-full bg-[#2B2C37] p-2 rounded border-[1px] 
                
                ${
                  darkMode === "light"
                    ? " bg-white text-black border-[#bdbaba] "
                    : " bg-[#2B2C37] text-white border-[#5f5f5f]  "
                }`}
                placeholder="e.g Done"
              ></input>
              <button
                onClick={() => {
                  handleDeleteColumn(index);
                }}
              >
                {" "}
                <RxCross1 className="w-4 h-4 text-[#808080] hover:text-red-600 hover:scale-105 cursor-pointer"></RxCross1>
              </button>
              <span className=" text-red-500 absolute right-10 text-[10px] font-light">
                {showValidationErrors(column.name)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className=" text-red-500 flex justify-center font-light">Add at least 1 column</span>
      )}
      <div className="flex flex-col gap-1 text-[0.75rem] font-bold w-full"></div>
      {/* ADD NEW COLUMN */}
      <button
        onClick={handleAddColumn}
        className={` font-bold  text-[13px] rounded-3xl p-2 my-2
      ${
        darkMode === "light"
          ? " bg-[#635FC7]  text-white hover:bg-[#A8A4FF] "
          : " bg-white text-[#635FC7] hover:bg-[#635FC7] hover:text-white "
      } `}
        type="button"
      >
        + Add New Column
      </button>
      {/* CREATE NEW BOARD */}
      <button
        data-id="create-board-form-button"
        disabled={
          formData.name.replace(/\s+/g, "") === "" ||
          formData.columns.some((e) => e.name.replace(/\s+/g, "") === "") ||
          formData.columns.length <= 0
        }
        onClick={handleCreateBoard}
        className="disabled:bg-red-500 hover:bg-[#A8A4FF] font-bold bg-[#635FC7] text-white text-[13px] rounded-3xl p-2"
      >
        Create New Board
      </button>
    </motion.form>
  );
}
