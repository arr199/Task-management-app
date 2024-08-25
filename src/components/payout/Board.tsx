import { GoDotFill } from "react-icons/go";
import { Task } from "../Task";
import { useGetBoards } from "../../Utils/hooks";
import { useParams } from "react-router-dom";
import React, { useContext, useState } from "react";
import { nanoid } from "nanoid";
import { setDoc, doc } from "firebase/firestore";
import { mainPointerEvents, useFirebase } from "../../Utils/functions";
import { AuthContext } from "../auth/AuthProvider";

export function Board(): JSX.Element {
  const { boards, setBoards, setShowNewColumnForm, setShowNewBoardForm, showLeftNavbar, darkMode } = useGetBoards();
  const { board } = useParams();
  const [draggedElement, setDraggedElement] = useState<DraggedElement>({
    column: null,
    task: null,
    targetColumn: null,
    targetTask: null,
  });
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();

  //   SHOW NEW COLUMN FORM
  function handleAddNewColumn(): void {
    setShowNewColumnForm(true);
    mainPointerEvents("none");
  }
  // ON DRAG START SAVE THE INDEX OF THE DRAGGED ELEMENT
  function handleDragStart(e: React.DragEvent, columnIndex: number, taskIndex: number): void {
    setDraggedElement((old) => ({ ...old, column: columnIndex, task: taskIndex }));
    e.currentTarget.classList.add("draggedElement");
  }

  function handleDragOver(e: React.DragEvent, columnIndex: number, taskIndex: number): void {
    const target = e.currentTarget as HTMLElement;
    //  IF IT IS DRAGGING OVER ITSELF DONT SAVE THE TASK AND COLUMN INDEX
    if (
      target.dataset.id ===
      boards[Number(board)].columns[draggedElement.column as number].tasks[draggedElement.task as number].id
    ) {
      return;
    }
    target.classList.add("dragginOver");
    e.preventDefault();
    setDraggedElement((old) => ({ ...old, targetColumn: columnIndex, targetTask: taskIndex }));
  }
  //   DROP TASK
  function handleDropTask(e: React.DragEvent): void {
    e.preventDefault();

    const newBoard = structuredClone(boards);
    const { column, task, targetColumn, targetTask } = draggedElement;

    //  CHECK IF THE DRAGGED ELEMENT IS A TASK
    if (typeof column !== "number" || typeof task !== "number") {
      // THIS IS NOT A TASK DO NOTHING
      return;
    }
    // IF THE COLUMN IS EMPTY
    if (targetTask === null && typeof targetColumn === "number") {
      // IF ITS THE SAME COLUMN AND TASK DO NOTHING
      if (column === targetColumn) return;
      // IF THE COLUMNS ARE DIFFERENT PUSH THE TASK
      const newTask = newBoard[Number(board)].columns[column].tasks.splice(task, 1);
      newBoard[Number(board)].columns[targetColumn].tasks.push({
        ...newTask[0],
        id: nanoid(),
        status: newBoard[Number(board)].columns[targetColumn].name,
      });
      setDraggedElement({ column: null, task: null, targetColumn: null, targetTask: null });
      setBoards(newBoard);
      setDoc(doc(db, "users", user as string), { boards: newBoard }).catch((err) => {
        console.log("ERORR DRAGGING TASK  : ", err);
      });
      return;
    }

    const newTask = newBoard[Number(board)].columns[column].tasks.splice(task, 1);

    // ADD THE TASK TO THE NEW COLUMN
    newBoard[Number(board)].columns[targetColumn as number].tasks.splice(targetTask as number, 0, {
      ...newTask[0],
      id: nanoid(),
      status: newBoard[Number(board)].columns[targetColumn as number].name,
    });
    // REMOVE THE TASK IN THE PREVIOUS COLUMN
    setDraggedElement({ column: null, task: null, targetColumn: null, targetTask: null });
    setBoards(newBoard);
    setDoc(doc(db, "users", user as string), { boards: newBoard }).catch((err) => {
      console.log("ERORR DRAGGING TASK  : ", err);
    });
  }

  function handleDragOverColumn(e: React.DragEvent, columnIndex: number): void {
    e.preventDefault();
    setDraggedElement((old) => ({ ...old, targetColumn: columnIndex }));
  }

  function handleDragExit(e: React.DragEvent): void {
    e.preventDefault();
    e.currentTarget.classList.remove("dragginOver");
    setDraggedElement((old) => ({ ...old, targetTask: null }));
  }
  function handleOnDrop(e: React.DragEvent): void {
    e.currentTarget.classList.remove("dragginOver");
  }

  return (
    <>
      {/* BOARD SECTION */}
      <section
        id="board"
        className={` transition-colors duration-300 flex text-[#828FA3] gap-6 overflow-auto w-full h-full ${
          showLeftNavbar ? " md:pl-[340px] " : " md:pl-16  "
        } 
          ${darkMode === "light" ? "bg-[#F4F7FD]" : ""} `}
      >
        {/* columns */}
        {boards?.[Number(board)]?.columns?.map((column, columnIndex) => (
          <div
            data-id={column.id}
            onDragOver={(e) => {
              handleDragOverColumn(e, columnIndex);
            }}
            onDrop={handleDropTask}
            key={column.id}
            className="board-columns min-w-[300px]  flex items-center gap-4  flex-col p-4 "
          >
            <h3 className="tracking-[2.4px] mb-4 font-semibold text-[12px] flex items-center gap-2 overflow-x-hidden   text-ellipsis max-w-[200px] ">
              <GoDotFill style={{ width: "20px", height: "20px", color: column.color }} /> {column.name} (
              {column.tasks.length}){" "}
            </h3>
            {/* TASKS */}
            {column?.tasks.map((task, taskIndex) => (
              <div
                data-id={task.id}
                key={task.id}
                className=" dragged-element w-full"
                onDragOver={(e) => {
                  handleDragOver(e, columnIndex, taskIndex);
                }}
                onDragStart={(e) => {
                  handleDragStart(e, columnIndex, taskIndex);
                }}
                onDragExit={handleDragExit}
                onDragLeave={handleDragExit}
                onDrop={handleOnDrop}
                draggable
              >
                <Task taskIndex={taskIndex} columnIndex={columnIndex} task={task}></Task>
              </div>
            ))}
          </div>
        ))}
        {/* ADD COLUMN */}
        {boards.length > 0 && (
          <div
            className={` transition-colors duration-300  h-[80%] my-auto rounded-lg flex flex-col items-center justify-center ml-auto   px-4   
              ${darkMode === "light" ? "  bg-gradient-to-r from-[#E9EFFA] to-[#E9EFFA80]  " : "  black-gradient "}`}
          >
            <div className="grid place-items-center min-w-[100px]">
              <button onClick={handleAddNewColumn} className="hover:text-[#635FC7]  ml-auto z-20">
                + New Column
              </button>
            </div>
          </div>
        )}
        {/* EMPTY BOARD */}
        {boards?.length <= 0 && (
          <div className="m-auto flex flex-col items-center gap-4">
            <h3> Create your first board to get started.</h3>
            <button
              onClick={() => {
                setShowNewBoardForm(true);
              }}
              className={` font-bold py-4 px-6 rounded-l-full rounded-r-full
                  ${
                    darkMode === "light"
                      ? " bg-[#635FC7] text-white  hover:bg-[#A8A4FF] "
                      : " bg-[#635FC7] text-white hover:bg-white hover:text-[#635FC7] "
                  }`}
            >
              {" "}
              Create Board
            </button>
          </div>
        )}
      </section>
    </>
  );
}
