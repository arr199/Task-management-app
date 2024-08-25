import { RxCross1 } from "react-icons/rx";
import React, { useContext, useEffect, useState } from "react";
import { EditTaskDropDown } from "../shared/EditTaskDropDown";
import { useGetBoards } from "../../utils/hooks";
import { useParams, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { mainPointerEvents, removeOpacityClass, showValidationErrors, useFirebase } from "../../utils/functions";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../auth/AuthProvider";
import { motion } from "framer-motion";
import ani from "../../utils/motions";

export function EditTaskForm(): JSX.Element {
  const [params] = useSearchParams();
  const { boards, setBoards, darkMode, setShowEditTaskForm, showEditTaskForm } = useGetBoards();
  const { board } = useParams();
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();
  const taskInd = params.get("task");
  const columnInd = params.get("column");
  const currentTask = boards[Number(board)]?.columns[Number(columnInd)].tasks[Number(taskInd)];
  const [formData, setFormData] = useState<Task>({
    id: currentTask?.id,
    title: currentTask?.title,
    status: currentTask?.status,
    description: currentTask?.description,
    subtasks: currentTask?.subtasks,
  });

  function handleSaveChanges(e: React.FormEvent): void {
    e.preventDefault();
    const newBoards = structuredClone(boards);
    const colum = Number(params.get("column"));
    const task = Number(params.get("task"));
    const columnIndex = newBoards[Number(board)].columns.findIndex((e) => e.name === formData.status);

    newBoards[Number(board)].columns[colum].tasks.splice(task, 1);
    // IF THE COLUMN IS THE SAME, THE TASK STAY IN THE SAME PLACE
    if (boards[Number(board)].columns[colum].name === formData.status) {
      newBoards[Number(board)].columns[columnIndex].tasks.splice(task, 0, formData);
      // IF THE COLUMN IS NOT THE SAME PUSH IT TO THE END OF THE NEW COLUMN
    } else newBoards[Number(board)].columns[columnIndex].tasks.push(formData);

    setBoards(newBoards);

    setDoc(doc(db, "users", user as string), { boards: newBoards }).catch((err) => {
      console.log("ERROR EDITING TASK : ", err);
    });
    setShowEditTaskForm(false);
    mainPointerEvents("auto");

    //  REMOVE OPACITY CLASS
    removeOpacityClass("#edit-task-form");
  }

  //   CONTROLLING THE SUBTASKS INPUTS
  function handleSubtaskChange(event: React.ChangeEvent, index: number): void {
    const target = event.target as HTMLInputElement;
    const newFormData = structuredClone(formData);
    newFormData.subtasks = newFormData.subtasks.map((e, i) => (i === index ? { ...e, title: target.value } : e));
    setFormData(newFormData);
  }
  //  ADD SUBTASK
  function handleAddSubtask(): void {
    const newFormData = structuredClone(formData);
    newFormData.subtasks.push({ title: "", id: nanoid(), isCompleted: false });
    setFormData(newFormData);
  }

  // REMOVE SUBTASK
  function handleRemoveSubtask(index: number): void {
    const newFormData = structuredClone(formData);
    newFormData.subtasks.splice(index, 1);
    setFormData(newFormData);
  }

  //  CLOSING THE FORM WHEN WE CLICK OUTSIDE OF IT
  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      const editForm = document.querySelector("#edit-task-form") as HTMLElement;
      const target = e.target as HTMLElement;

      if (editForm !== null && !editForm.contains(target)) {
        mainPointerEvents("auto");
        setShowEditTaskForm(false);
        removeOpacityClass("#edit-task-form");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEditTaskForm]);

  return (
    <motion.form
      draggable
      onDragStart={(e) => {
        e?.preventDefault();
      }}
      onSubmit={handleSaveChanges}
      id="edit-task-form"
      className={` task  gap-3 flex flex-col absolute inset-0 m-auto z-20  w-[90vw] sm:w-max sm:min-w-[450px]  h-max min-h-[320px] px-5 py-8 rounded  pointer-events-auto 
    ${darkMode === "light" ? " bg-white  " : " bg-[#2B2C37] text-white "}`}
      {...ani.scaleAnimationCenterExitCenter()}
    >
      {/* TITLE */}
      <h2 id="title" className="font-bold ">
        Edit Task
      </h2>
      <div className="relative flex flex-col gap-1 text-[0.75rem] font-bold">
        <label>Title</label>
        <input
          style={{ border: showValidationErrors(formData.title) !== "" ? "1px solid red" : "" }}
          value={formData.title}
          onChange={(e) => {
            setFormData((old) => ({ ...old, title: e.target.value }));
          }}
          className={` hover:border-[#635FC7]  text-[0.8125rem] bg-[#2B2C37] p-2 rounded border-[1px] border-[#5f5f5f] 
          ${darkMode === "light" ? " bg-white text-black border-[#bdbaba]" : "  "} `}
          placeholder="e.g Take a coffee break"
        ></input>
        <span className=" text-red-500 absolute top-8 right-5 text-[10px] font-light">
          {showValidationErrors(formData.title)}
        </span>
      </div>
      {/* DESCRIPTION */}
      <div className="relative  flex flex-col gap-1 text-[0.75rem] font-bold">
        <label>Description</label>
        <textarea
          style={{ border: showValidationErrors(formData.description) !== "" ? "1px solid red" : "" }}
          value={formData.description}
          onChange={(e) => {
            setFormData((old) => ({ ...old, description: e.target.value }));
          }}
          className={`hover:border-[#635FC7] whitespace-pre-wrap text-[0.8125rem] h-[100px] resize-none bg-[#2B2C37] p-2 rounded border-[1px] border-[#5f5f5f] break-words 
          ${darkMode === "light" ? " bg-white text-black border-[#bdbaba]" : "  "}`}
          placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
        ></textarea>
        <span className=" text-red-500 absolute bottom-4 right-5 text-[10px] font-light">
          {showValidationErrors(formData.description)}
        </span>
      </div>
      {/* SUBTASK */}
      {formData.subtasks.length > 0 ? (
        //  AT LEAST ONE SUBTASK
        <div className="flex flex-col gap-1 text-[0.75rem] font-bold w-full">
          <label>Subtasks</label>
          {formData.subtasks.map((subtask, index) => (
            <div className="relative flex items-center gap-2 w-full" key={subtask.id}>
              <input
                style={{ border: showValidationErrors(formData.subtasks[index].title) !== "" ? "1px solid red" : "" }}
                value={formData.subtasks[index].title}
                onChange={(e) => {
                  handleSubtaskChange(e, index);
                }}
                className={` hover:border-[#635FC7]  w-full text-[0.8125rem] bg-[#2B2C37] p-2 rounded border-[1px] border-[#5f5f5f] 
                ${darkMode === "light" ? " bg-white text-black border-[#bdbaba]" : "  "} `}
                placeholder="e.g Make a coffee"
              ></input>
              <RxCross1
                onClick={() => {
                  handleRemoveSubtask(index);
                }}
                className="w-4 h-4 text-[#808080] hover:text-red-600 hover:scale-105 cursor-pointer"
              ></RxCross1>
              <span className=" text-red-500 absolute  right-10 text-[10px] font-light">
                {showValidationErrors(subtask.title)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        //  EMPTY SUBTASKS
        <span className=" text-red-500 flex justify-center font-light">Add at least 1 subtask</span>
      )}
      {/* ADD NEW SUBTASK */}
      <button
        type="button"
        onClick={handleAddSubtask}
        className={`font-bold text-[13px] rounded-3xl p-2 
        ${
          darkMode === "light"
            ? " bg-[#635FC7]  text-white hover:bg-[#A8A4FF]   "
            : " bg-white text-[#635FC7] hover:bg-[#635FC7] hover:text-white "
        }`}
      >
        + Add New Subtask{" "}
      </button>
      {/* STATUS */}
      <div className="flex flex-col gap-1 text-[0.75rem] font-bold">
        <label>Status</label>
        <EditTaskDropDown formData={formData} setFormData={setFormData}></EditTaskDropDown>
      </div>
      {/* SAVE CHANGES */}
      <button
        disabled={
          formData.title.replace(/\s+/g, "") === "" ||
          formData.description.replace(/\s+/g, "") === "" ||
          formData?.subtasks?.some((e) => e.title.replace(/\s+/g, "") === "") ||
          formData.subtasks.length <= 0
        }
        className="disabled:bg-red-500 hover:bg-[#A8A4FF] font-bold bg-[#635FC7] text-white text-[13px] rounded-3xl p-2"
      >
        Save Changes
      </button>
    </motion.form>
  );
}
