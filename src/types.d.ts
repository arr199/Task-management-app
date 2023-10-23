interface Users {
  boards: Board[]
}

interface Board {
  name: string
  columns: Column[]
  id: string
}

interface Column {
  name: string
  tasks: Task[]
  id: string
  color: string
}

interface Task {
  title: string
  description: string
  status: string
  subtasks: Subtask[]
  id: string
}

interface Subtask {
  title: string
  isCompleted: boolean
  id: string
}

interface TaskProps {
  task: Task
  taskIndex: number | string
  columnIndex: number | string

}

interface ContextProps {
  boards: Board[] | []
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

interface HeaderProps {
  boards: Board[]
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>
  setShowNewTask: React.Dispatch<React.SetStateAction<boolean>>
  setShowEditBoardForm: React.Dispatch<React.SetStateAction<boolean>>

}

interface AddTaskFormProps {
  showNewTask: boolean
  setShowNewTask: React.Dispatch<React.SetStateAction<boolean>>
}

interface AddTaskForm {
  title: string
  description: string
  subtasks: Subtask[]
  status: string
  id: string

}
interface CurrentStatusDropDownProps {
  formData: AddTaskForm
  setFormData: React.Dispatch<React.SetStateAction<AddTaskForm>>

}

interface TaskDropDown {
  formData: Task
  setFormData: React.Dispatch<React.SetStateAction<Task>>

}
interface TaskCheckBoxProps {
  formData: Task
  setFormData: React.Dispatch<React.SetStateAction<Task>>
  index: number

}

interface AddBoardFormProps {
  setShowNewBoardForm: React.Dispatch<React.SetStateAction<boolean>>
  boards: Board[]
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>

}
interface TaskCheckBoxProps {
  formData: Task
  setFormData: React.Dispatch<React.SetStateAction<Task>>
  index: number

}
interface EditBoardFormProps {
  boards: Board[]
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>
  setShowEditBoardForm: React.Dispatch<React.SetStateAction<boolean>>

}

interface AuthContextType {
  user: string | null | undefined
  setUser: React.Dispatch<React.SetStateAction<string | null | undefined>>
}
interface AuthProviderProps {
  children: React.ReactNode

}

interface DraggedElement {
  column: null | number
  task: null | number
  targetColumn: null | number
  targetTask: null | number
}

interface AddColumnFormProps {
  boards: Board[]
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>
  setShowNewColumnForm: React.Dispatch<React.SetStateAction<boolean>>
}

interface TaskFormProps {
  showTaskForm: boolean
  setShowTaskForm: React.Dispatch<React.SetStateAction<boolean>>

}
