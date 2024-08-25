/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { signOut } from "firebase/auth";
import { mainPointerEvents, removeOpacityClass, useFirebase } from "../../utils/functions";
import { useGetBoards } from "../../utils/hooks";
import { FaPlus } from "react-icons/fa";

export function Header({ boards, setShowNewTask, setShowEditBoardForm }: HeaderProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const { board } = useParams();
  const { darkMode, showLeftNavbar, setShowLeftNavbar, setOpenDeleteBoardPopUp } = useGetBoards();

  //  OPEN HEADER RIGHT BUTTON MENU
  function handleOpenMenu(): void {
    setOpen(!open);
  }
  //  SHOW ADD TASK FORM
  function handleShowAddTask(): void {
    setShowNewTask(true);
  }
  //  SHOW EDIT BOARD FORM
  function handleEditBoard(): void {
    setOpen(false);
    setShowEditBoardForm(true);
    mainPointerEvents("none");
  }
  // SHOW DELETE BOARD POP UP
  function handleDeleteBoardPopUp(): void {
    setOpenDeleteBoardPopUp(true);
    setOpen(false);
    mainPointerEvents("none");
  }

  // CLOSE THE EDIT-DELETE BOARD CONTAINER WHEN CLICK OUTSIDE OF IT
  useEffect(() => {
    const container = document.querySelector("#edit-delete-popup");
    const deleteContainer = document.querySelector("#delete-container");
    function handleClickOutside(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      // CLOSE THE MENU WHEN THE TARGET IS NOT INSIDE THE CONTAINER AND IS NOT THE 3DOTS BUTTON
      if (
        container !== null &&
        !container?.contains(target) &&
        target.id !== "3dots-menu" &&
        target.id !== "3dots-icon"
      ) {
        setOpen(false);
      } else if (deleteContainer !== null && !deleteContainer?.contains(target)) {
        setOpenDeleteBoardPopUp(false);
        mainPointerEvents("auto");
        removeOpacityClass("#delete-container");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // LOG OUT BUTTON
  function handleLogOut(): void {
    const { auth } = useFirebase();
    signOut(auth)
      .then()
      .catch((err) => {
        console.log("Error : ", err);
      });
  }

  // SHOW NAVBAR SMALL SCREEN
  function handleShowLeftNavbar(): void {
    setShowLeftNavbar((old) => !old);
  }

  return (
    <>
      <header
        className={` relative flex transition-all duration-300  w-full border-b   py-11 md:px-10
      ${darkMode === "light" ? "bg-white text-black  border-b-[#E4EBFA]" : " bg-[#2B2C37] border-b-[#4b4b4b] "}`}
      >
        <nav className="px-4 md:px-0   flex  w-full items-center gap-2 ">
          {/* LOGOS */}
          <div className="pl-1  sm:pl-[3vh]  md:min-w-[300px]  items-center ">
            {/* SMALL LOGO */}
            <img className="md:hidden min-w-20" src="/assets/logo-mobile.svg"></img>
            {/* BIG LOGO */}
            <img
              className="md:flex hidden "
              src={`${darkMode === "light" ? "/assets/logo-dark.svg" : "/assets/logo-light.svg"}`}
              alt="kanban logo"
            />
          </div>
          <div className="hidden md:flex absolute ml-[239px]  border-r-[#4b4b4b] border-r h-full"></div>
          {/* BOARD TITLE */}

          <h2 className="whitespace-nowrap pl-2  text-[18px] md:text-[24px] font-bold overflow-hidden text-ellipsis max-w-[40%]">
            {boards?.[Number(board)]?.name}
          </h2>
          {/* ARROW BUTTON SMALL SCREEN */}
          <img
            onClick={handleShowLeftNavbar}
            width="15"
            className="md:hidden"
            src={`${showLeftNavbar ? "assets/icon-chevron-up.svg" : "assets/icon-chevron-down.svg"} `}
          ></img>

          {/* ADD NEW TASK */}
          <button
            data-id="add-new-task"
            disabled={boards?.length <= 0 || !boards[Number(board)]}
            onClick={handleShowAddTask}
            className={`   bg-[#635FC7] whitespace-nowrap rounded-3xl ml-auto py-2 px-4 text-[0.9375rem]  hover:bg-[#A8A4FF] disabled:bg-[#A8A4FF] flex items-center gap-2
           ${darkMode === "light" ? "text-white" : ""}`}
          >
            <FaPlus></FaPlus> <span className="hidden sm:flex">Add New Task</span>
          </button>
          {/* SHOW EDIT AND DELETE MENU POPUP */}
          <button id="3dots-menu" disabled={boards?.length <= 0 || !boards[Number(board)]} onClick={handleOpenMenu}>
            <BiDotsVerticalRounded id="3dots-icon" className="w-8 h-8 text-[#828FA3]  " />{" "}
          </button>
          {/* LOG OUT */}
          <button data-id="logout-button" onClick={handleLogOut} className="hidden  sm:flex px-2 hover:text-[#7445b3]">
            <IoMdLogOut className="w-6 h-6"></IoMdLogOut>
          </button>
          {/* EDIT DELETE POP UP */}
          {open && (
            <div
              id="edit-delete-popup"
              className={`w-[180px] h-max absolute gap-4 inset-0 ml-auto mr-12 mt-24 flex flex-col bg-[#20212C] p-4 rounded-lg text-[0.8125rem] items-start  z-20 
          ${darkMode === "light" ? "bg-white" : ""}`}
            >
              <button
                id="edit-board"
                onClick={handleEditBoard}
                className={`text-[#828FA3] e hover:font-bold 
            ${darkMode === "light" ? " hover:text-black " : " hover:text-white "}`}
              >
                Edit Board
              </button>
              <button
                id="delete-board"
                onClick={handleDeleteBoardPopUp}
                className="text-red-600 hover:text-red-400 hover:font-bold"
              >
                Delete Board
              </button>
              <button
                id="delete-board"
                onClick={handleLogOut}
                className="sm:hidden text-red-600 hover:text-red-400 hover:font-bold"
              >
                Log out!
              </button>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
