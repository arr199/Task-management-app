import { Link } from 'react-router-dom'

export function NotFoundPage (): JSX.Element {
  return (
        <main className="grid h-screen w-full place-items-center ">
             <div className="flex justify-center flex-col gap-6 items-center">
                <img className='w-52' src="/assets/logo-light.svg" alt='kanban logo'/>
                <h1 className="text-5xl font-bold">Nothing here !</h1>
                <Link className='px-20 py-2 bg-[#635FC7] hover:bg-[#FFFFFF] hover:text-[#635FC7] active:scale-95 rounded-l-full rounded-r-full font-bold mt-4' to="/">Back</Link>
             </div>
        </main>

  )
}
