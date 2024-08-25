import React, { type ChangeEvent, useEffect, useState, useContext } from "react";
import { RxCross1 } from "react-icons/rx";
import { AddTaskDropDown } from "../shared/AddTaskDropDown";
import { useGetBoards } from "../../utils/hooks";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { removeOpacityClass, showValidationErrors, useFirebase } from "../../utils/functions";
import { AuthContext } from "../auth/AuthProvider";
import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import animations from "../../utils/motions";

export function AddTaskForm({ showNewTask, setShowNewTask }: AddTaskFormProps): JSX.Element {
  const { boards, setBoards, darkMode } = useGetBoards();
  const { board } = useParams();
  const defaultStatusValue = boards[Number(board)]?.columns[0]?.name;
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();
  const [formData, setFormData] = useState<AddTaskForm>({
    id: "",
    title: "",
    description: "",
    status: defaultStatusValue,
    subtasks: [{ title: "", id: nanoid(), isCompleted: false }],
  });

  //  CLOSE THE POP-UP WHEN USER CLICK OUTSIDE OF IT
  useEffect(() => {
    const newTaskForm = document.querySelector("#add-task");
    function handleClickOutside(e: MouseEvent): void {
      if (newTaskForm !== null && showNewTask && !(newTaskForm?.contains(e.target as HTMLElement) ?? false)) {
        setShowNewTask(false);
        removeOpacityClass("#add-task");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNewTask]);

  // REMOVE SUBTASK
  function handleRemoveSubtask(index: number): void {
    const newFormData = structuredClone(formData);
    newFormData.subtasks.splice(index, 1);
    setFormData(newFormData);
  }

  // ADD NEW SUBTASK
  function handleAddNewSubtask(): void {
    const newFormData = structuredClone(formData);
    newFormData.subtasks.push({ title: "", id: nanoid(), isCompleted: false });
    setFormData(newFormData);
  }
  // CREATE TASK
  function handleCreateTask(e: React.FormEvent): void {
    e.preventDefault();
    const columnIndex = boards[Number(board)].columns.findIndex((e) => e.name === formData.status);
    const newBoards = structuredClone(boards);
    newBoards[Number(board)].columns[columnIndex].tasks.push({ ...(formData as Task), id: nanoid() });
    setBoards(newBoards);
    setDoc(doc(db, "users", user as string), { boards: newBoards }).catch((err) => {
      console.log("ERROR ADDING NEW TASK : ", err);
    });
    setShowNewTask(false);
    removeOpacityClass("#add-task");
  }

  // CONTROLLING SUBTASKS INPUTS
  function handleSubtaskChange(e: ChangeEvent, index: number): void {
    const target = e.target as HTMLInputElement;
    const newFormData = JSON.parse(JSON.stringify(formData));
    newFormData.subtasks[index].title = target.value;
    setFormData(newFormData);
  }

  // VALIDATE FIELDS
  function validateFields() {
    return (
      formData.title.replace(/\s+/g, "") === "" ||
      formData.description.replace(/\s+/g, "") === "" ||
      formData.subtasks.some((e) => e.title.replace(/\s+/g, "") === "") ||
      formData.subtasks.length <= 0
    );
  }

  return (
    <motion.form
      onSubmit={handleCreateTask}
      id="add-task"
      className={`task gap-3 flex flex-col absolute inset-0 m-auto w-[90vw]  sm:w-max  sm:min-w-[450px] h-max min-h-[320px] px-5 py-8 rounded 
    ${darkMode === "light" ? " bg-[#ffffff] text-black " : "bg-[#2B2C37] text-white "}`}
      {...animations.scaleAnimationCenterExitCenter()}
    >
      <h2 className="font-bold ">Add new task</h2>
      <div className="relative flex flex-col gap-1 text-[0.75rem] font-bold">
        {/* TITLE */}
        <label>Title</label>
        <input
          data-id="add-task-title"
          style={{ border: showValidationErrors(formData.title) !== "" ? "1px solid red" : "" }}
          value={formData.title}
          onChange={(e) => {
            setFormData((old) => ({ ...old, title: e.target.value }));
          }}
          className={`hover:border-[#635FC7] text-[0.8125rem] p-2 rounded border-[1px] border-[#5f5f5f]  bg-[#2B2C37]
          ${darkMode === "light" ? " bg-white border-[#bdbaba] " : ""}`}
          placeholder="e.g Take a coffee break"
        ></input>
        <span className=" text-red-500 absolute right-6 top-8 text-[10px] font-light">
          {showValidationErrors(formData.title)}
        </span>
      </div>
      {/* DESCRIPTION */}
      <div className="flex flex-col gap-1 text-[0.75rem] font-bold relative">
        <label>Description</label>
        <textarea
          data-id="add-task-description"
          style={{ border: showValidationErrors(formData.description) !== "" ? "1px solid red" : "" }}
          value={formData.description}
          onChange={(e) => {
            setFormData((old) => ({ ...old, description: e.target.value }));
          }}
          className={`hover:border-[#635FC7]  whitespace-pre-wrap text-[0.8125rem] bg-[#2B2C37] h-[100px] resize-none  p-2 rounded border-[1px] border-[#5f5f5f] break-words 
          ${darkMode === "light" ? " bg-white border-[#bdbaba] " : ""}`}
          placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
        ></textarea>
        <span className=" text-red-500 absolute bottom-4 right-6 text-[10px] font-light">
          {showValidationErrors(formData.description)}
        </span>
      </div>
      {/* SUBTASK */}
      {formData.subtasks.length > 0 ? (
        <div className="flex flex-col gap-1 text-[0.75rem] font-bold w-full">
          <label>Subtasks</label>
          {formData.subtasks.map((subtask, index) => (
            <div className="flex items-center gap-2 w-full relative" key={subtask.id}>
              <input
                data-id="add-task-subtask"
                style={{ border: showValidationErrors(formData.subtasks[index].title) !== "" ? "1px solid red" : "" }}
                value={formData.subtasks[index].title}
                onChange={(e) => {
                  handleSubtaskChange(e, index);
                }}
                className={`hover:border-[#635FC7] text-[0.8125rem] w-full bg-[#2B2C37] p-2 rounded border-[1px] border-[#5f5f5f]
                ${darkMode === "light" ? " bg-white text-black border-[#bdbaba]" : "  "}`}
                placeholder="e.g Make a coffee"
              ></input>
              <RxCross1
                onClick={() => {
                  handleRemoveSubtask(index);
                }}
                className="w-4 h-4 text-[#808080] hover:text-red-600 hover:scale-105 cursor-pointer"
              ></RxCross1>
              <span className=" text-red-500 absolute bottom-3 right-10 text-[10px] font-light">
                {showValidationErrors(subtask.title)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className=" text-red-500 flex justify-center font-light">Add at least 1 subtask</span>
      )}
      {/* ADD NEW SUBTASK */}
      <button
        type="button"
        onClick={handleAddNewSubtask}
        className={` hover:text-white font-bold   text-[13px] rounded-3xl p-2 active:scale-95
        ${
          darkMode === "light"
            ? " bg-[#635FC7]  text-white hover:bg-[#A8A4FF] "
            : " bg-white text-[#635FC7] hover:bg-[#635FC7] "
        }`}
      >
        + Add New Subtask{" "}
      </button>
      {/* STATUS */}
      <div className="flex flex-col gap-1 text-[0.75rem] font-bold">
        <label>Status</label>
        <AddTaskDropDown formData={formData} setFormData={setFormData}></AddTaskDropDown>
      </div>
      {/* CREATE TASK */}
      <button
        disabled={validateFields()}
        className="disabled:bg-red-500 hover:bg-[#A8A4FF] font-bold bg-[#635FC7] text-white text-[13px] rounded-3xl p-2"
      >
        Create Task
      </button>
    </motion.form>
  );
}
