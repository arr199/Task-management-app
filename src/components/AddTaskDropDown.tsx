import React, { useState } from 'react'
import { useGetBoards } from '../Utils/hooks'
import { useLocation, useSearchParams } from 'react-router-dom'
import ani from '../assets/motions'
import { AnimatePresence, motion } from 'framer-motion'

export function AddTaskDropDown ({ formData, setFormData }: CurrentStatusDropDownProps): JSX.Element {
  const { boards, darkMode } = useGetBoards()
  const location = useLocation()
  const [params] = useSearchParams()
  const boardIndex = +location.pathname.split('/')[1]
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(boards[boardIndex]?.columns[Number(params?.get('column'))]?.name)

  function handleSelect (e: React.MouseEvent <HTMLButtonElement>): void {
    console.log('ITS ME')
    const target = e.target as HTMLElement
    setSelected(target.textContent as string)
    setIsOpen(false)
    setFormData(old => ({ ...old, status: target.textContent as string }))
  }

  return (
    <>
      <motion.section className='relative'
      >
        <button onClick={() => { setIsOpen(!isOpen) }} type='button'
          className={`hover:border-[#635FC7]   w-full flex  border-[1px] border-[#535353] rounded-sm mt-2 px-3 py-2 text-[0.8125rem]  font-bold min-h-[30px]
          ${darkMode === 'light' ? '  bg-white border-[#bdbaba]' : ' text-white '}`} >
          {formData.status}
        </button>
        {/* DROPDOWN OPTIONS */}
        <AnimatePresence>
          {isOpen &&
            <motion.div className={`absolute flex flex-col gap-2 mt-2  p-2  px-3 py-2 text-[0.8125rem] rounded w-full items-start 
          ${darkMode === 'light' ? '  bg-white text-[#828FA3]' : ' bg-[#20212C] text-[#828FA3]'}`}
              {...ani.scaleAnimationCenterExitCenter()}>
              {boards?.[boardIndex].columns.map((column, index) =>
                <motion.button className={`${darkMode === 'light' ? 'hover:text-black ' : 'hover:text-white'}   ${selected === column.name ? darkMode === 'light' ? ' text-black ' : ' text-white  hover:text-white ' : ''}   `}
                  onClick={handleSelect} key={column.id} type='button'
                  {...ani.fadeAnimation(0 + index / 5)}
                >{column.name}</motion.button>)}
            </motion.div>}
        </AnimatePresence>
      </motion.section>
    </>
  )
}
