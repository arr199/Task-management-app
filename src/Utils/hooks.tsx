import type React from 'react'
import { useContext } from 'react'
import { GlobalContext } from '../components/Pages/HostLayout'

interface ContextHook {
  boards: Board[]
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>
  setShowNewBoardForm: React.Dispatch<React.SetStateAction<boolean>>
  setShowNewColumnForm: React.Dispatch<React.SetStateAction<boolean>>
  darkMode: string
  setDarkMode: React.Dispatch<React.SetStateAction<string>>
  showLeftNavbar: boolean
  setShowLeftNavbar: React.Dispatch<React.SetStateAction<boolean>>
  openDeleteBoardPopUp: boolean
  setOpenDeleteBoardPopUp: React.Dispatch<React.SetStateAction<boolean>>
  showEditTaskForm: boolean
  setShowEditTaskForm: React.Dispatch<React.SetStateAction<boolean>>
  showTaskForm: boolean
  setShowTaskForm: React.Dispatch<React.SetStateAction<boolean>>
}

export function useGetBoards (): ContextHook {
  const {
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
    setShowTaskForm
  } = useContext(GlobalContext)

  return {
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
    setShowTaskForm
  }
}
