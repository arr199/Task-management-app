import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { useGetBoards } from '../Utils/hooks'
import { mainPointerEvents } from '../Utils/functions'

export function Task ({ task, taskIndex, columnIndex }: TaskProps): JSX.Element {
  const setParams = useSearchParams()[1]
  const { darkMode, setShowTaskForm } = useGetBoards()

  // SHOW THE TASK FORM WHEN WE CLICK ON A TASK
  function handleClickTask (): void {
    setParams({ column: columnIndex as string, task: taskIndex as string })
    setShowTaskForm(true)
    mainPointerEvents('none')
  }

  return (
    <>
      {/* TASK CONTAINER */}
      <motion.div onClick={handleClickTask} key={task.title} className={`  p-4 bg-[#2B2C37]  rounded-md px-10 flex flex-col  cursor-pointer  max-w-[300px]
       ${darkMode === 'light' ? ' bg-white text-black task-shadow-light hover:bg-[#f6f3fd]  ' : ' task-shadow-dark text-white hover:bg-slate-700 '}`}
        whileHover={{ scale: [1, 1.2, 1.07], transition: { damping: 333 } }}>
        <article className='break-words flex flex-col gap-2 '>
          <h3 className=' font-bold  '>{task.title} </h3>
          <p className='text-[12px] font-semibold text-[#828FA3]'>{[...task.subtasks].filter(e => e.isCompleted).length}   of   {task.subtasks.length} substask</p>
        </ article>
      </motion.div>
    </>

  )
}
