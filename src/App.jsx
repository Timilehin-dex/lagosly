
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

import { RiArrowDropDownLine } from "react-icons/ri"
import { CgProfile } from "react-icons/cg"
import {
  FaRegBookmark,
  FaBookmark,
  FaRegCompass,
  FaCompass,
  FaRegMoneyBillAlt,
} from "react-icons/fa"
import {
  FaPlus,
  FaRegMap,
  FaMap,
  FaRegBell,
} from "react-icons/fa6"
import { RxAvatar } from "react-icons/rx"
import { TbLocation } from "react-icons/tb"

import Home from './Home'
import Explore from './Explore'
import Saved from './Saved'
import VenueDetail from './VenueDetail'
import Plans from './Plans'
import PlanEditor from './PlanEditor'

const tabClass = ({ isActive }) =>
  `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition ${
    isActive
      ? 'bg-[#E8EEFF] text-[#214FC7]'
      : 'hover:bg-[#F0F3FF] hover:text-[#0E1C31]'
  }`

function App() {
  return (
    <BrowserRouter basename="/lagosly">

      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <header className="flex items-center justify-between px-5 lg:px-12 py-3 shadow-[0px_1px_10px_0px_#0E1C310F] bg-white">

          {/* Logo and location */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-extrabold tracking-[-0.5px] font-jakarta leading-7">
                Lagosly
              </h1>
              <div className="w-1.5 h-1.5 rounded-full bg-black" />
            </div>

            <button className="px-2.5 py-1 bg-[#F0F3FF] rounded-full flex items-center justify-center gap-1">
              <TbLocation className="text-base" />
              <span className="text-xs font-semibold tracking-[0.36px]">
                Lagos, NG
              </span>
              <RiArrowDropDownLine className="text-xl" />
            </button>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:block rounded-full bg-[#F0F3FF] shadow-[0px_2px_10px_0px_#0E1C310F]">
            <ul className="text-[#434654] flex items-center justify-between gap-1 p-1">

              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `block px-4 py-1.5 font-medium text-sm tracking-[0.14px] rounded-full transition ${
                      isActive ? 'bg-white text-[#214FC7] shadow-sm' : ''
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/explore"
                  className={({ isActive }) =>
                    `block px-4 py-1.5 font-medium text-sm tracking-[0.14px] rounded-full transition ${
                      isActive ? 'bg-white text-[#214FC7] shadow-sm' : ''
                    }`
                  }
                >
                  Explore
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/build"
                  className={({ isActive }) =>
                    `block px-4 py-1.5 font-medium text-sm tracking-[0.14px] rounded-full transition ${
                      isActive ? 'bg-white text-[#214FC7] shadow-sm' : ''
                    }`
                  }
                >
                  My Plans
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/saved"
                  className={({ isActive }) =>
                    `block px-4 py-1.5 font-medium text-sm tracking-[0.14px] rounded-full transition ${
                      isActive ? 'bg-white text-[#214FC7] shadow-sm' : ''
                    }`
                  }
                >
                  Saved Places
                </NavLink>
              </li>

            </ul>
          </nav>

          {/* HEADER ACTIONS */}
          <div className="flex items-center justify-between gap-1 lg:gap-2">

            <NavLink
              to="/build"
              className="hidden bg-[#4169E1] px-6 py-2.5 rounded-full lg:flex items-center gap-2 text-[#F8F7FF] shadow-[0px_6px_20px_0px_#4169E1]/24 hover:bg-[#3257c8] transition"
            >
              <FaRegCompass className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-[0.14px]">
                Build a Plan
              </span>
            </NavLink>

            <button
              aria-label="Notifications"
              className="w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center"
            >
              <FaRegBell className="w-5 h-5" />
            </button>

            <button
              aria-label="Profile"
              className="w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center"
            >
              <RxAvatar className="w-5 h-5" />
            </button>

          </div>
        </header>
      </div>

      {/* PAGE ROUTES */}
      <main className="pt-20 pb-20 lg:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/build" element={<Plans />} />
          <Route path="/build/:planId" element={<PlanEditor />} />
          <Route path="/venue/:id" element={<VenueDetail />} />
        </Routes>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <nav className="flex items-center justify-between p-1 text-[#434654] font-inter relative shadow-[0px_-3px_16px_0px_#0E1C310F] bg-white">

          <NavLink to="/" end className={tabClass}>
            {({ isActive }) => (
              <>
                {isActive
                  ? <FaCompass className="w-5 h-5" />
                  : <FaRegCompass className="w-5 h-5" />
                }
                <span className="mt-0.5 text-xs font-semibold tracking-[0.36px]">
                  Home
                </span>
              </>
            )}
          </NavLink>

          <NavLink to="/explore" className={tabClass}>
            {({ isActive }) => (
              <>
                {isActive
                  ? <FaMap className="w-5 h-5" />
                  : <FaRegMap className="w-5 h-5" />
                }
                <span className="mt-0.5 text-xs font-semibold tracking-[0.36px]">
                  Explore
                </span>
              </>
            )}
          </NavLink>

          {/* BUILD */}
          <NavLink to="/build" className="relative -top-2">
            {({ isActive }) => (
              <div className="flex flex-col items-center justify-center w-14 h-14">
                <div
                  className={`w-12 h-9 bg-[#4169E1] rounded-full flex items-center justify-center transition ${
                    isActive
                      ? 'ring-4 ring-[#DCE1FF]'
                      : 'hover:bg-[#3257c8]'
                  }`}
                >
                  <FaPlus className="text-white w-5 h-5" />
                </div>

                <span
                  className={`mt-1 text-xs font-semibold tracking-[0.36px] ${
                    isActive ? 'text-[#214FC7]' : ''
                  }`}
                >
                  Build
                </span>
              </div>
            )}
          </NavLink>

          <NavLink to="/saved" className={tabClass}>
            {({ isActive }) => (
              <>
                {isActive
                  ? <FaBookmark className="w-5 h-5" />
                  : <FaRegBookmark className="w-5 h-5" />
                }
                <span className="mt-0.5 text-xs font-semibold tracking-[0.36px]">
                  Saved
                </span>
              </>
            )}
          </NavLink>

          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl hover:bg-[#F0F3FF]">
            <CgProfile className="w-5 h-5" />
            <span className="mt-0.5 text-xs font-semibold tracking-[0.36px]">
              Profile
            </span>
          </button>

        </nav>
      </div>

      {/* DESKTOP FOOTER */}
      <footer className="bg-[#F0F3FF] hidden lg:block">
        <div className="px-12 py-16">
          <div className="grid grid-cols-12 gap-10 pb-10">

            {/* BRAND */}
            <div className="col-span-4 grid content-start gap-4">
              <h2 className="text-xl font-jakarta font-bold tracking-[-0.5px] text-[#0E1C31] pb-2">
                Lagosly
              </h2>

              <p className="text-sm text-[#434654]">
                Curated outings, dining, and weekend discovery across Lagos,
                Nigeria
              </p>

              <div className="bg-[#E8EEFF] px-4 py-1.5 rounded-full flex items-center gap-2 w-fit">
                <FaRegMoneyBillAlt className="text-[#00655B]" />
                <span className="text-[#0E1C31] font-semibold text-sm tracking-[0.36px]">
                  Currency base: ₦ Nigerian Naira (NGN)
                </span>
              </div>
            </div>

            {/* NEIGHBORHOODS */}
            <div className="col-span-3 grid content-start gap-2">
              <h3 className="font-semibold tracking-[-0.17px] text-[#0E1C31]">
                Neighborhoods
              </h3>

              <ul className="grid gap-1 text-[#434654] text-sm uppercase">
                <li>Ikeja</li>
                <li>Victoria Island</li>
                <li>Lekki</li>
                <li>Ikoyi</li>
                <li>Yaba</li>
              </ul>
            </div>

            {/* CURATION AND TOOLS */}
            <div className="col-span-3 grid content-start gap-2">
              <h3 className="font-semibold tracking-[-0.17px] text-[#0E1C31]">
                Curation &amp; Tools
              </h3>

              <ul className="grid gap-1 text-[#434654] text-sm">
                <li>Explore venues</li>
                <li>Saved places</li>
                <li>Build a plan</li>
                <li>Dining and outings</li>
                <li>Weekend discovery</li>
              </ul>
            </div>

            <div className="col-span-2" />

          </div>
        </div>
      </footer>

    </BrowserRouter>
  )
}

export default App
