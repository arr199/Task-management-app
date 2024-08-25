import { doc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { useFirebase, mainPointerEvents, removeOpacityClass } from "../../Utils/functions";
import { useGetBoards } from "../../Utils/hooks";
import ani from "../../assets/motions";

export function DeleteBoardForm(): JSX.Element {
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();
  const { board } = useParams();
  const navigate = useNavigate();
  const { setBoards, setOpenDeleteBoardPopUp, boards, darkMode } = useGetBoards();

  // DELETE BOARD
  function handleDeleteBoard(): void {
    if (boards.length <= 0) return;
    const boardIndex = Number(board ?? 0);

    const newBoard = [...boards].filter((_, index) => index !== boardIndex);
    setBoards(newBoard);
    setDoc(doc(db, "users", user as string), { boards: newBoard }).catch((err) => {
      console.log("ERROR DELETING BOARD :", err);
    });
    setOpenDeleteBoardPopUp(false);
    mainPointerEvents("auto");
    //  NAVIGATE TO THE PREVIOUS BOARD WHEN THIS ONE GETS DELETED
    if (boards[Number(board) - 1] !== undefined) {
      const index = Number(board);
      navigate(`${index - 1}`);
    }
    //  REMOVE OPACITY CLASS
    removeOpacityClass("#delete-container");
  }
  //  CANCEL BUTTON
  function handleCancelButton(): void {
    setOpenDeleteBoardPopUp(false);
    mainPointerEvents("auto");
    //  REMOVE OPACITY CLASS
    removeOpacityClass("#delete-container");
  }

  return (
    <motion.div
      id="delete-container"
      className={`task flex flex-col absolute inset-0 px-6 py-8 m-auto w-[90vw] sm:max-w-[400px] sm:min-w-[18.75rem] 
        bg-[#2B2C37] h-max gap-6 z-20 rounded pointer-events-auto 
        ${darkMode === "light" ? " bg-white " : "  "}`}
      {...ani.scaleAnimationCenterExitCenter()}
    >
      <h2 className="text-[#EA5555] text-[1.125rem] font-bold">Delete this board?</h2>
      <p className="text-[#828FA3] text-[0.8125rem] overflow-hidden text-ellipsis">
        Are you sure you want to delete the
        <strong className={`${darkMode === "light" ? " text-black " : "text-white"}   `}>
          &apos; {boards?.[Number(board)]?.name} &apos;
        </strong>{" "}
        board? This action will remove all columns and tasks and cannot be reversed.
      </p>
      <div className=" flex justify-center gap-3 ">
        {/* DELETE  */}
        <button
          onClick={handleDeleteBoard}
          className="hover:bg-[#FF9898] px-8 sm:px-14 py-2  text-[0.8125rem] text-white bg-red-500  rounded-3xl font-semibold"
        >
          Delete
        </button>
        {/* CANCEL */}
        <button
          onClick={handleCancelButton}
          className={` hover:text-white px-8 sm:px-16 py-2  text-[0.8125rem]   rounded-3xl font-semibold 
            ${
              darkMode === "light"
                ? " text-white bg-[#635FC7] hover:bg-[#A8A4FF] "
                : " text-[#635FC7] hover:bg-[#635FC7] bg-white "
            }`}
        >
          {" "}
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
