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
import { FaRegMoneyBillAlt } from "react-icons/fa";
import Home from './Home'
import Explore from './Explore'
import Saved from './Saved'
import VenueDetail from './VenueDetail'


function App() {
  return (
    <BrowserRouter basename="/lagosly">
      {/*  */}
      <div className='fixed top-0 left-0 right-0 z-50'>
        <header className='flex items-center justify-between px-5 lg:px-12 py-3 shadow-[0px_1px_10px_0px_#0E1C310F] bg-white'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <h1 className='text-xl font-extrabold tracking-[-0.5px] font-jakarta leading-7'>Lagosly</h1>
              <div className='w-1.5 h-1.5 rounded-full bg-black'></div>
            </div>
            <button className='px-2.5 py-1 bg-[#F0F3FF] rounded-full flex items-center justify-center gap-1'><TbLocation className='text-base' /><h1 className='text-xs font-semibold tracking-[0.36px]'>Lagos, NG</h1><RiArrowDropDownLine className='text-xl' /></button>
          </div>
          {/* desktop nav */}
          <div className='rounded-full bg-[#F0F3FF] shadow-[0px_2px_10px_0px_#0E1C310F] hidden lg:block'>
            <ul className='text-[#434654] flex items-center justify-between gap-1 p-1'>
              <Link to="/"><li className='px-4 py-1.5 font-medium text-sm trackingg-[0.14px] cursor-pointer'>Home</li></Link>
              <Link to="/explore"><li className='px-4 py-1.5 font-medium text-sm trackingg-[0.14px] cursor-pointer'>Explore</li></Link>
              <Link to="/profile"><li className='px-4 py-1.5 font-medium text-sm trackingg-[0.14px] cursor-pointer'>My Plans</li></Link>
              <Link to="/saved"><li className='px-4 py-1.5 font-medium text-sm trackingg-[0.14px] cursor-pointer'>Saved Places</li></Link>
            </ul>
          </div>
          {/*  */}
          <div className='flex items-center justify-between gap-1 lg:gap-2'>
            <div className='hidden bg-[#4169E1] px-6 py-2.5 rounded-full lg:flex items-center gap-2 text-[#F8F7FF] shadow-[0px_6px_20px_0px_#4169E1]/24'><FaRegCompass className='w-4 h-4' /> <span className='text-sm font-semibold tracking-[0.14px]'>Build a Plan</span></div>
            <div className='w-10 h-10 bg-[#F0F3FF] rounded-full flex items-center justify-center'><FaRegBell className='w-5 h-5' /></div>
            <div className='w-11 h-11 flex items-center justify-center'><RxAvatar className='w-5 h-5' /></div>
          </div>
        </header>
      </div>
      {/*  */}
      <div className='py-20'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
        </Routes>
      </div>
      {/*  */}
      <div className='lg:hidden fixed bottom-0 left-0 right-0 z-40'>
        <nav className='flex items-center justify-between p-1 text-[#434654] font-inter relative shadow-[0px_-3px_16px_0px_#0E1C310F] bg-white'>
          <Link to="/">
            <div className='flex flex-col items-center justify-center w-14 h-14'>
              <FaRegCompass className='w-5 h-5' />
              <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'>Home</h1>
            </div>
          </Link>
          <Link to="/explore">
            <div className='flex flex-col items-center justify-center w-14 h-14'>
              <FaRegMap className='w-5 h-5' />
              <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'>Explore</h1>
            </div>
          </Link>

          <div className='relative -top-2'>
            <div className='flex flex-col items-center justify-center w-14 h-14'>
              <div className='w-12 h-9 bg-[#4169E1] rounded-full flex items-center justify-center'>
                <FaPlus className='text-white w-5 h-5' />
              </div>
              <h1 className='mt-1 text-xs font-semibold tracking-[0.36px]'>Build</h1>
            </div>
          </div>

          <Link to="/saved">
            <div className='flex flex-col items-center justify-center w-14 h-14'>
              <FaRegBookmark className='w-5 h-5' />
              <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'>Saved</h1>
            </div>
          </Link>

          <div className='flex flex-col items-center justify-center w-14 h-14'>
            <CgProfile className='w-5 h-5' />
            <h1 className='mt-0.5 text-xs font-semibold tracking-[0.36px]'>Profile</h1>
          </div>
        </nav>
      </div>
      {/*  */}
      <footer className='bg-[#F0F3FF] hidden lg:block'>
        <div className='px-12 py-16'>
          <div className='grid grid-cols-12 gap-10 pb-10'>
            <div className='col-span-4 grid gap-4'>
              <h1 className='text-xl font-jakarta font-bold tracking-[-0.5px] text-[#0E1C31] pb-2'>Lagosly</h1>
              <p className='text-sm text-[#434654]'>Curated outings, dining, and weekend discovery across Lagos, Nigeria</p>
              <div className='bg-[#E8EEFF] px-4 py-1.5 rounded-full flex items-center gap-2 w-fit'>
                <FaRegMoneyBillAlt className='text-[#00655B]' />
                <span className='text-[#0E1C31] font-semibold text-sm tracking-[0.36px]'>
                  Currency base: ₦ Nigerian Naira (NGN)
                </span>
              </div>
            </div>
            <div className='col-span-3 grid gap-2'>
              <h3 className='font-semibold tracking-[-0.17px] text-[#0E1C31]'>Neighborhoods</h3>
              <ul className='grid gap-1 text-[#434654] text-sm uppercase'>
                <li>Ikeja</li>
                <li>Ikeja</li>
                <li>Ikeja</li>
                <li>Ikeja</li>
                <li>Ikeja</li>
              </ul>
            </div>
            <div className='col-span-3 pb-6 grid gap-2'>
                     <h3 className='font-semibold tracking-[-0.17px] text-[#0E1C31]'>Curation & Tools</h3>
              <ul className='grid gap-1 text-[#434654] text-sm uppercase'>
                <li>Ikeja</li>
                <li>Ikeja</li>
                <li>Ikeja</li>
                <li>Ikeja</li>
                <li>Ikeja</li>
              </ul>
            </div>
            <div className='col-span-2'></div>
          </div>

        </div>
      </footer>
    </BrowserRouter>
  )
}

export default App