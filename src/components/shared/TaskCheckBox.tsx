import React from "react";
import { useGetBoards } from "../utils/hooks";

export function TaskCheckBox({ formData, setFormData, index }: TaskCheckBoxProps): JSX.Element {
  const { darkMode } = useGetBoards();
  function handleInputChange(e: React.ChangeEvent): void {
    const target = e.target as HTMLInputElement;
    const newFormData = structuredClone(formData);

    newFormData.subtasks[index].isCompleted = target.checked;
    setFormData(newFormData);
  }

  return (
    <label
      htmlFor={formData.subtasks[index]?.id}
      className={` cursor-pointer rounded-md flex items-center  gap-2  bg-[#20212C] px-2 py-3 
    ${darkMode === "light" ? " bg-[#F4F7FD] text-black hover:bg-[#c0beeb] " : " hover:bg-[#3b37b1] "}`}
    >
      <input
        id={formData.subtasks[index]?.id}
        checked={formData?.subtasks[index]?.isCompleted}
        onChange={(e) => {
          handleInputChange(e);
        }}
        className="accent-[#635FC7]  "
        type="checkbox"
      ></input>
      <span
        className={`text-[0.75rem] font-bold overflow-hidden  ${
          formData?.subtasks[index]?.isCompleted ? " line-through text-[#828FA3] " : "  font-bold "
        } `}
      >
        {formData?.subtasks[index]?.title}
      </span>
    </label>
  );
}
