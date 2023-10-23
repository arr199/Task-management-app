import { setDoc, doc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { removeOpacityClass, mainPointerEvents, useFirebase } from '../../Utils/functions'
import { EditTaskDropDown } from '../EditTaskDropDown'
import { TaskCheckBox } from '../TaskCheckBox'
import { useGetBoards } from '../../Utils/hooks'
import { useParams, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../Auth/AuthProvider'
import ani from '../../assets/motions'

// A FORM CALLED WHEN CLICK ON A TASK
export function TaskForm ({ showTaskForm, setShowTaskForm }: TaskFormProps): JSX.Element {
  const [openTaskFormOptions, setOpenTaskFormOptions] = useState(false)
  const { setBoards, boards, setShowEditTaskForm, darkMode } = useGetBoards()
  const { user } = useContext(AuthContext)
  const { board } = useParams()
  const [params] = useSearchParams()
  const { db } = useFirebase()
  const [formData, setFormData] = useState<Task>({ id: '', title: '', status: '', description: '', subtasks: [] })

  // HIDE THE TASK FORM WHEN WE CLICK OUTSIDE OF IT
  useEffect(() => {
    function handleClickOutSide (e: MouseEvent): void {
      const target = e.target as HTMLElement
      const taskContainer = document.querySelector('#task-form')
      const dotsMenu = document.querySelector('#edit-delete-task-menu')

      if (taskContainer !== null && !((taskContainer?.contains(target)) ?? false)) {
        setShowTaskForm(false)
        //  REMOVE OPACITY CLASS
        removeOpacityClass('#task-form')
        mainPointerEvents('auto')
      } else if (openTaskFormOptions && dotsMenu !== null && !dotsMenu?.contains(target) && target.id !== '3dots-open-icon' && target.id !== '3dots-open-menu') {
        setOpenTaskFormOptions(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutSide)
    return () => { window.removeEventListener('mousedown', handleClickOutSide) }
  }, [showTaskForm, openTaskFormOptions])

  // GET THE CURRENT TASK
  useEffect(() => {
    const taskInd = params.get('task')
    const columnInd = params.get('column')

    const currentTask = boards[Number(board)]?.columns[Number(columnInd)]?.tasks[Number(taskInd)]
    setFormData({ id: currentTask?.id, title: currentTask?.title, status: currentTask?.status, description: currentTask?.description, subtasks: currentTask?.subtasks })
  }, [showTaskForm])

  // EDIT TASK
  function handleEditTask (): void {
    setShowEditTaskForm(true)
    setShowTaskForm(false)
    setOpenTaskFormOptions(false)
    //  REMOVE OPACITY CLASS
    removeOpacityClass('#task-form')
  }

  // DELETE TASK
  function handleDeleteTask (): void {
    const newBoards = structuredClone(boards)
    const colum = Number(params.get('column'))
    const task = Number(params.get('task'))
    newBoards[Number(board)].columns[colum].tasks.splice(task, 1)
    setBoards(newBoards)
    setDoc(doc(db, 'users', user as string), { boards: newBoards }).catch(err => { console.log('ERROR REMOVING TASK :', err) })
    mainPointerEvents('auto')
    setShowTaskForm(false)
    removeOpacityClass('#task-form')
  }
  // SAVE THE CHANGE IN THE CURRENT TASK
  function handleSaveClick (): void {
    setShowTaskForm(false)
    const colum = Number(params.get('column'))
    const task = Number(params.get('task'))
    const newBoard = structuredClone(boards)
    // REMOVING THE TASK ON THE CURRENT COLUMN
    newBoard[Number(board)].columns[colum].tasks = newBoard[Number(board)].columns[colum].tasks.filter(task => task.id !== formData.id)
    // GETTING THE INDEX OF THE NEW COLUMN
    const newColumIndex = boards[Number(board)].columns.findIndex(e => e.name === formData.status)
    // IF THE COLUMN IS THE SAME, THE TASK STAY IN THE SAME PLACE
    if (boards[Number(board)].columns[colum].name === formData.status) {
      newBoard[Number(board)].columns[newColumIndex].tasks.splice(task, 0, formData)
    // IF THE COLUMN IS NOT THE SAME PUSH IT TO THE END OF THE NEW COLUMN
    } else newBoard[Number(board)].columns[newColumIndex].tasks.push(formData)

    // ADDING THE TASK TO THE NEW COLUMN

    setBoards(newBoard)
    setDoc(doc(db, 'users', user as string), { boards: newBoard }).catch(err => { console.log('ERROR EDITING TASK :', err) })
    //  REMOVE OPACITY CLASS
    removeOpacityClass('#task-form')
    mainPointerEvents('auto')
  }

  return (
    <>

   <motion.div draggable onDragStart={(e) => { e.preventDefault() }} id='task-form' className={`task z-20 rounded-lg w-[90vw] sm:max-w-[400px] sm:min-w-[320px]  break-words  flex flex-col absolute inset-0 m-auto sm:w-[500px] h-max min-h-[400px] bg-[#2B2C37] p-8 pointer-events-auto 
        ${darkMode === 'light' ? ' bg-white text-black ' : ' text-white '}`}
          {...ani.scaleAnimationCenterExitCenter()}>
          <div className='flex justify-between  break-words'>
              <h2 className=' font-bold text-[1.125rem] overflow-hidden break-words whites  '>{formData.title}</h2>
              {/* OPTIONS BUTTON */}
              <button id='3dots-open-button' onClick={() => { setOpenTaskFormOptions(old => !old) }} ><BiDotsVerticalRounded id='3dots-open-icon' className='w-8 h-8 text-[#828FA3]' /> </button>
          </div>
          <p className=' py-5 text-[0.8125rem] text-[#828FA3]'>{formData?.description}</p>
          <span className='text-[0.8125rem] text-white font-bold'>Subtasks ({[...formData.subtasks].filter(e => e.isCompleted).length} of {formData.subtasks.length})</span>
          <div className=' flex flex-col gap-2 py-4'>
              {/* SUBTASKS */}
              {formData?.subtasks?.map((_, index) =>
                  <TaskCheckBox key={index} formData={formData} setFormData={setFormData} index={index} ></TaskCheckBox>
              )}
          </div>
          {/* DROPDOWN MENU */}
          <span className='font-semibold text-[12px]'>Current Status</span>
          <EditTaskDropDown formData={formData} setFormData={setFormData}></EditTaskDropDown>
          <button onClick={handleSaveClick} className='self-end justify-self-end mt-4 px-4 py-2 rounded bg-[#635FC7] text-white font-bold
             text-[14px] hover:bg-[#A8A4FF]'>
              Save
          </button>
          {/* OPTIONS MENU  EDIT/DELETE TASK */}
          {openTaskFormOptions && <div id='edit-delete-task-menu' className={` w-[180px] h-[80px] absolute gap-4 inset-0 ml-auto  mt-[75px] mr-[-40px] flex flex-col bg-[#20212C] p-4 rounded-lg text-[0.8125rem] items-start
           ${darkMode === 'light' ? 'bg-white' : ''}`}>
              <button onClick={handleEditTask} className={`text-[#828FA3]  hover:font-bold 
             ${darkMode === 'light' ? ' hover:text-black ' : ' hover:text-white '}`}>Edit Task</button>
              <button onClick={handleDeleteTask} className={'text-red-600 hover:text-red-400 hover:font-bold '} >Delete Task</button>
          </div>}
      </motion.div>

      </>
  )
}
