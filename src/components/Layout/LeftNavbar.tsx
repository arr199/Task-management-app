import { TbLayoutBoardSplit } from 'react-icons/tb'
import { NavLink, useParams } from 'react-router-dom'
import { useGetBoards } from '../../Utils/hooks'
import { MdLightMode } from 'react-icons/md'
import { BsFillMoonStarsFill, BsEyeSlash, BsEye } from 'react-icons/bs'
import { ImCross } from 'react-icons/im'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ani from '../../assets/motions'
import { mainPointerEvents } from '../../Utils/functions'

export function LeftNavBar (): JSX.Element {
  const { boards, darkMode, setDarkMode, setShowNewBoardForm, showLeftNavbar, setShowLeftNavbar } = useGetBoards()
  const { board } = useParams()
  const [hover, setHover] = useState(false)

  function handleCreateNewBoard (): void {
    const navbar = document.querySelector('#left-navbar') as HTMLElement
    const styles = window.getComputedStyle(navbar)

    // CLOSE THE LEFT NAVBAR IN SMALL SCREEN
    if (styles.getPropertyValue('inset') === '0px') {
      setShowLeftNavbar(false)
    }
    setShowNewBoardForm(true)
    // REMOVING POINTERS EVENT EVERYWHERE BUT THE FORM
    mainPointerEvents('none')
  }
  function changeDarkMode (): void {
    if (darkMode === 'light') setDarkMode('dark')
    else if (darkMode === 'dark') setDarkMode('light')
  }

  function handleCloseLeftNavbar (): void {
    setShowLeftNavbar(false)
  }
  return (
    <>
      {/* LEFT NAVBAR */}
      <AnimatePresence>
        {showLeftNavbar &&
          <motion.nav id='left-navbar' {...ani.slideLeftToRightAnimation()} className={`z-10  min-h-[320px] rounded-lg border-r-0   absolute flex  
          transition-colors duration-300  inset-0 md:inset-auto m-auto h-max w-[280px]    md:h-screen  md:py-10  md:border-r-[1px] text-[#828FA3]  flex-col
           ${darkMode === 'light' ? ' bg-white border-r-[#E4EBFA] ' : ' bg-[#2B2C37] border-r-[#4b4b4b] '}`} >
            <button onClick={handleCloseLeftNavbar} className='md:hidden absolute right-5 top-5 hover:text-red-600 focus:text-red-600'><ImCross></ImCross></button>
            <div className={'w-[300px]  pr-10  py-1 text-[#828FA3] flex flex-col  '}>
              {/* LOGO */}
              <div className="hidden md:flex  pl-10  min-w-[300px] items-center">
                <img src={darkMode === 'light' ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'} alt='kanban logo' />
              </div>
              {/* BOARDS */}
              <h3 className='pl-10 tracking-[2.4px] mt-14 text-[12px] font-bold'>ALL BOARDS ({boards?.length})</h3>
              <ul className='boards-list  flex flex-col  mt-6 text-[14px]  md:w-[300px] max-h-[200px] md:max-h-[500px] overflow-y-scroll md:overflow-auto  '>
                {boards?.map((e, index) =>
                  <div key={e.id} className='flex items-center relative  '>
                    {/* ICON */}
                    <TbLayoutBoardSplit className="absolute left-10 " />
                    {/* BOARD NAME */}
                    <NavLink to={`${index}`}
                      style={Number(board) === index ? { background: '#635FC7', color: 'white', fontWeight: 'bold' } : { background: '' }}
                      className={` pl-16 font-bold whitespace-nowrap  overflow-x-hidden  text-ellipsis   board-link w-[90%] cursor-pointer flex items-center gap-2  hover:font-bold py-2 px-10 rounded-r-3xl 
                ${darkMode === 'light' ? ' hover:text-[#635FC7]  hover:bg-[#635FC740]' : ' hover:bg-white hover:text-[#635FC7]  '}`}> {e.name}
                    </NavLink >
                  </div>)}
                {/* CREATE NEW BOARD */}
              </ul>
              <button data-id='create-board-button' onClick={handleCreateNewBoard}
                className={` font-bold my-2 py-2 px-10  text-[14px] whitespace-nowrap  flex  items-center gap-2 p-2 rounded-r-3xl text-[#635FC7]  hover:font-bold  
              ${darkMode === 'light' ? ' hover:text-[#635FC7] hover:bg-[#635FC740] ' : ' hover:bg-white hover:text-[#635FC7]'}`} ><TbLayoutBoardSplit /> + Create New Board</button>

            </div>
            {/*  DARK-MODE MENU */}
            <div className={` self-center mt-auto mb-4 px-16 py-4 flex gap-4  rounded 
              ${darkMode === 'light' ? 'bg-[#F4F7FD] ' : ' bg-[#20212C] '}`} >
              <MdLightMode></MdLightMode>
              <div onClick={changeDarkMode}
                className='bg-violet-500 w-9 hover:bg-violet-400 rounded-xl px-[1px] flex relative items-center cursor-pointer '>
                <div className={` w-3 h-3 bg-white rounded-full border-black  ${darkMode === 'dark' ? ' ml-auto ' : ' mr-auto '} `} ></div>
              </div>
              <BsFillMoonStarsFill></BsFillMoonStarsFill>
            </div>
            {/* HIDE LEFT NAVBAR  */}
            <button onClick={() => { setShowLeftNavbar(false) }}
              className={`hidden py-3 px-10 rounded-r-3xl mt-4 w-[90%]  text-[#828FA3] hover:text-[#635FC7] font-bold md:flex  items-center gap-2 
               ${darkMode === 'light' ? 'hover:bg-[#635FC740] ] ' : '  hover:bg-[#F4F7FD] '}`} > <BsEyeSlash></BsEyeSlash> Hide Sidebar</button>
          </motion.nav>
        }
      </AnimatePresence>
      {/* SHOW NAVBAR BUTTON */}
      <AnimatePresence>
        {!showLeftNavbar &&
          <motion.button onClick={() => {
            setHover(false)
            setShowLeftNavbar(true)
          }}
            onMouseLeave={() => { setHover(false) }} onMouseEnter={() => { setHover(true) }}
            className=' hidden md:flex  items-center gap-4 fixed bottom-6  hover:bg-[#8180c4] bg-[#635FC7] py-4 px-6 rounded-r-full hover:scale-110 duration-300 hover:pr-10'
            {...ani.slideLeftToRightAnimation()}>
            <BsEye></BsEye>
            {hover && <span className='text-[12px] font-bold transition-all duration-300'>Show</span>}
          </motion.button>}
      </AnimatePresence>
    </>
  )
}
