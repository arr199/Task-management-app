import React, { useState } from "react";
import { useGetBoards } from "../Utils/hooks";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ani from "../assets/motions";

export function EditTaskDropDown({
  formData,
  setFormData,
}: TaskDropDown): JSX.Element {
  const { boards, darkMode } = useGetBoards();
  const [isOpen, setIsOpen] = useState(false);
  const { board } = useParams();

  function handleSelect(e: React.MouseEvent<HTMLButtonElement>): void {
    const target = e.target as HTMLElement;
    setIsOpen(false);
    const newFormData = structuredClone(formData);
    newFormData.status = target.textContent as string;
    setFormData(newFormData);
  }

  return (
    <>
      <section
        className={` cursor-pointer  font-bold relative ${
          darkMode === "light" ? " text-black  " : " text-white "
        }`}
      >
        <input
          value={formData.status}
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={`text-start hover:border-[#635FC7] w-full flex cursor-pointer  border-[1px] border-[#535353] rounded mt-2 px-3 py-2 text-[0.8125rem]  font-bold min-h-[30px] 
          ${darkMode === "light" ? " border-[#bdbaba] " : ""} `}
        ></input>
        {/* DROPDOWN OPTIONS */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={` absolute flex flex-col gap-2 mt-2 bg-[#20212C] p-2  px-3 py-2 text-[0.8125rem] rounded w-full items-start 
          ${darkMode === "light" ? "bg-[#fffefe] " : " hover:text-white  "}`}
              {...ani.scaleAnimationCenterExitCenter()}
            >
              {boards?.[Number(board)]?.columns.map((column, index) => (
                <motion.button
                  type="button"
                  className={` ${
                    darkMode === "light"
                      ? "hover:text-black "
                      : "hover:text-white"
                  }  text-[#828FA3] 
              ${
                formData.status === column.name
                  ? darkMode === "light"
                    ? " text-black "
                    : " text-white "
                  : ""
              }   `}
                  onClick={handleSelect}
                  key={column.id}
                  {...ani.fadeAnimation(0.2 + index / 7)}
                >
                  {column.name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
