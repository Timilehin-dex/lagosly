import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { RiArrowDropDownLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { FaRegBookmark } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaRegMap } from "react-icons/fa6";
import { FaRegCompass } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { FaRegBell } from "react-icons/fa6";
import { TbLocation } from "react-icons/tb";
import Home from './Home'
import Explore from './Explore'
import Saved from './Saved'

function App() {
  return (
    <BrowserRouter basename="/lagosly">
      {/*  */}
      <div className='fixed top-0 left-0 right-0'>
        <header className='flex items-center justify-between px-5 py-3 shadow-[0px_1px_10px_0px_#0E1C310F] bg-white'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <h1 className='text-xl font-extrabold tracking-[-0.5px] font-jakarta leading-7'>Lagosly</h1>
              <div className='w-1.5 h-1.5 rounded-full bg-black'></div>
            </div>
            <button className='px-2.5 py-1 bg-[#F0F3FF] rounded-full flex items-center justify-center gap-1'><TbLocation className='text-base' /><h1 className='text-xs font-semibold tracking-[0.36px]'>Lagos, NG</h1><RiArrowDropDownLine className='text-xl' /></button>
          </div>
          <div className='flex items-center justify-between gap-1'>
            <div className='w-11 h-11 flex items-center justify-center'><FaRegBell className='w-5 h-5' /></div>
            <div className='w-11 h-11 flex items-center justify-center'><RxAvatar className='w-5 h-5' /></div>
          </div>
        </header>
      </div>
      {/*  */}
      <div className='pt-20'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </div>
      {/*  */}
      <div className='fixed bottom-0 left-0 right-0'>
        <nav className='flex items-center justify-between p-1 text-[#434654] font-inter relative shadow-[0px_-3px_16px_0px_#0E1C310F]'>
          <div className='flex flex-col items-center justify-center w-14 h-14'>
            <FaRegCompass className='w-5 h-5' />
            <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'><Link to="/">Home</Link></h1>
          </div>
          <div className='flex flex-col items-center justify-center w-14 h-14'>
            <FaRegMap className='w-5 h-5' />
            <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'> <Link to="/explore">Explore</Link></h1>
          </div>
          <div className='relative -top-2'>
            <div className='flex flex-col items-center justify-center w-14 h-14'>
              <div className='w-12 h-9 bg-[#4169E1] rounded-full flex items-center justify-center'>
                <FaPlus className='text-white w-5 h-5' />
              </div>
              <h1 className='mt-1 text-xs font-semibold tracking-[0.36px]'>Build</h1>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center w-14 h-14'>
            <FaRegBookmark className='w-5 h-5' />
            <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'><Link to="/saved">Saved</Link></h1>
          </div>
          <div className='flex flex-col items-center justify-center w-14 h-14'>
            <CgProfile className='w-5 h-5' />
            <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'>Profile</h1>
          </div>
        </nav>
      </div>
    </BrowserRouter>
  )
}

export default App