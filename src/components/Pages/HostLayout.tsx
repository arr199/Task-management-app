import { createContext, useContext, useEffect, useState } from "react";
import { Header } from "../payout/Header";
import { LeftNavBar } from "../payout/LeftNavbar";
import { AddBoardForm } from "../modals/AddBoardForm";
import { AddTaskForm } from "../modals/AddTaskForm";
import { EditBoardForm } from "../modals/EditBoardForm";
import { AddColumnForm } from "../modals/AddColumnForm";
import { AuthContext } from "../auth/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "../../Utils/functions";
import { AnimatePresence } from "framer-motion";
import { DeleteBoardForm } from "../modals/DeleteBoardForm";
import { Board } from "../payout/Board";
import { EditTaskForm } from "../modals/EditTaskForm";
import { TaskForm } from "../modals/TaskForm";

export const GlobalContext = createContext<ContextProps>({
  boards: [],
  setBoards: () => [],
  setShowNewBoardForm: () => false,
  setShowNewColumnForm: () => false,
  darkMode: "dark",
  setDarkMode: () => null,
  showLeftNavbar: false,
  setShowLeftNavbar: () => false,
  openDeleteBoardPopUp: false,
  setOpenDeleteBoardPopUp: () => false,
  showEditTaskForm: false,
  setShowEditTaskForm: () => false,
  showTaskForm: false,
  setShowTaskForm: () => false,
});

export function HostLayout(): JSX.Element {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showNewTask, setShowNewTask] = useState<boolean>(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState<boolean>(false);
  const [showNewBoardForm, setShowNewBoardForm] = useState<boolean>(false);
  const [showEditBoardForm, setShowEditBoardForm] = useState<boolean>(false);
  const [showNewColumnForm, setShowNewColumnForm] = useState(false);
  const [darkMode, setDarkMode] = useState<string>(JSON.parse(localStorage.getItem("mode") as string) ?? "dark");
  const [showLeftNavbar, setShowLeftNavbar] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [openDeleteBoardPopUp, setOpenDeleteBoardPopUp] = useState(false);
  const { user } = useContext(AuthContext);
  const { db } = useFirebase();

  // GETTING THE USER DATA FROM FIREBASE
  useEffect(() => {
    if (user !== null && user !== undefined) {
      async function getBoards(): Promise<void> {
        const docRef = doc(db, "users", user as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBoards(docSnap.data().boards);
        }
      }
      getBoards().catch((err) => {
        console.log("ERROR FETCHING INITIAL BOARDS : ", err);
      });
    }
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{
          boards,
          setBoards,
          setShowNewBoardForm,
          setShowNewColumnForm,
          darkMode,
          setDarkMode,
          showLeftNavbar,
          setShowLeftNavbar,
          openDeleteBoardPopUp,
          setOpenDeleteBoardPopUp,
          showEditTaskForm,
          setShowEditTaskForm,
          showTaskForm,
          setShowTaskForm,
        }}
      >
        <section
          style={showNewTask ? { pointerEvents: "none", opacity: "0.5" } : {}}
          id="main-page"
          className={" w-screen h-screen flex  "}
        >
          <LeftNavBar></LeftNavBar>
          <main className="flex flex-col  overflow-hidden w-full">
            <Header
              setShowNewTask={setShowNewTask}
              boards={boards}
              setBoards={setBoards}
              setShowEditBoardForm={setShowEditBoardForm}
            ></Header>
            <Board></Board>
          </main>
        </section>
        {/* ABSOLUTE CONTAINERS */}
        <AnimatePresence mode="wait">
          {showNewTask && <AddTaskForm showNewTask={showNewTask} setShowNewTask={setShowNewTask}></AddTaskForm>}
          {showNewBoardForm && (
            <AddBoardForm
              setShowNewBoardForm={setShowNewBoardForm}
              boards={boards}
              setBoards={setBoards}
            ></AddBoardForm>
          )}
          {showEditBoardForm && (
            <EditBoardForm
              boards={boards}
              setBoards={setBoards}
              setShowEditBoardForm={setShowEditBoardForm}
            ></EditBoardForm>
          )}
          {showNewColumnForm && (
            <AddColumnForm
              boards={boards}
              setBoards={setBoards}
              setShowNewColumnForm={setShowNewColumnForm}
            ></AddColumnForm>
          )}
          {openDeleteBoardPopUp && <DeleteBoardForm></DeleteBoardForm>}
          {showEditTaskForm && <EditTaskForm></EditTaskForm>}
          {showTaskForm && <TaskForm showTaskForm={showTaskForm} setShowTaskForm={setShowTaskForm}></TaskForm>}
        </AnimatePresence>
      </GlobalContext.Provider>
    </>
  );
}
