import { SlLocationPin } from "react-icons/sl";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";
import { GoPlusCircle } from "react-icons/go";

function Home() {
  return (
    <main>
      <section className="px-5 pt-8 pb-4 grid gap-3">
        <div className="grid grid-cols-2 items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#008073]"></div>
              <h1 className="font-semibold font-inter text-xs text-[#008073]">MIDDAY IN THE CITY</h1>
            </div>
            <h1 className="pt-0.5 font-extrabold text-xl font-jakarta tracking-[-0.55px] leading-7">Good afternoon, Adaeze</h1>
            <h3 className="text-xs font-inter">Where are we heading today?</h3>
          </div>
          <div className="flex justify-end">
            <button className="px-3 py-1.5 rounded-full bg-[#DFE8FF] flex items-center gap-1.5">
              <SlLocationPin className="text-[#4169E1]" />
              <span className="text-xs font-inter font-semibold">Lagos, NG</span><RiArrowDropDownLine className="text-lg" />
            </button>
          </div>
        </div>
        {/*  */}
        <div className="pt-1 flex items-center gap-2">
          <div className="flex items-center gap-2 w-full px-4 py-3 rounded-full bg-white shadow-[0px_4px_16px_0px_#0E1C310F]">
            <IoSearchOutline className="w-3.75 h-3.75 text-[#434654]" />
            <input type="text" placeholder="Search restaurants, beach clubs, rooftops..." className='flex-1 font-inter placeholder:text-xs placeholder:text-[#434654]/70' />
          </div>
          <div className="">
            <button className="w-11 h-11 flex items-center justify-center rounded-full bg-[#DFE8FF] shadow-[0px_4px_14px_0px_#0E1C310F]"><IoFilter className="w-3.75 h-3.75 text-[#214FC7]" /></button>
          </div>
        </div>
        {/*  */}
        <div className="carousel carousel-center rounded-box max-w-md space-x-4">
          <div className="carousel-item">
            <div className="w-fit flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] rounded-full shadow-[0px_1px_2px_0px_#000000]/5">
              <MdVerified className="text-[#00655B] w-3 h-3" />
              <h1 className="font-inter font-bold text-xs tracking-[0.55px]">1,240+ Verified Spots</h1>
            </div>
          </div>
          <div className="carousel-item">
            <div className="w-fit flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] rounded-full shadow-[0px_1px_2px_0px_#000000]/5">
              <MdVerified className="text-[#00655B] w-3 h-3" />
              <h1 className="font-inter font-bold text-xs tracking-[0.55px]">1,240+ Verified Spots</h1>
            </div>
          </div>
          <div className="carousel-item">
            <div className="w-fit flex items-center gap-1.5 px-3 py-1 bg-[#F0F3FF] rounded-full shadow-[0px_1px_2px_0px_#000000]/5">
              <MdVerified className="text-[#00655B] w-3 h-3" />
              <h1 className="font-inter font-bold text-xs tracking-[0.55px]">1,240+ Verified Spots</h1>
            </div>
          </div>
        </div>
      </section>
      {/*  */}
      <section className="pt-4 px-5">
      <div className="carousel carousel-center rounded-box max-w-full space-x-2">
        <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_4px_6px_-1px_#000000]/10 bg-[#0E1C31]"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-white">All Venues</span></button>
        </div>
        <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-medium text-sm tracking-[0.14px] text-[#0E1C31]">All Venues</span></button>
        </div>
        <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">All Venues</span></button>
        </div>
         <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">All Venues</span></button>
        </div>
       <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">All Venues</span></button>
        </div>
        <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">All Venues</span></button>
        </div>
        <div className="carousel-item">
          <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">All Venues</span></button>
        </div>
      </div>
      </section>
      {/*  */}
      <section className="px-5 pt-8">
        <div className="p-5 rounded-2xl bg-[#214FC7] shadow-[0px_12px_32px_0px_#214FC7]/28">
          <div className="grid gap-3">
            <div className="flex gap-2 items-center">
              <div className="bg-[#4169E1] px-2.5 py-0.5 rounded-full"><h2 className="font-inter font-bold text-xs tracking-[0.55px] text-white">SMART OUTING PLANNER</h2></div>
              <div className="flex items-center gap-1"><BsLightningCharge className="text-[#DCE1FF] w-3 h-3" /><h2 className="text-[#DCE1FF] font-inter font-semibold text-xs tracking-[0.36px]">Instant split</h2></div>
            </div>
            <div className=''>
              <h1 className="text-xl font-extrabold font-jakarta tracking-[-0.5px] leading-6.5 text-white">Build your Lagos outing in seconds</h1>
              <p className="font-inter text-xs text-[#DFE8FF] pt-1"> Pick your crowd, set your budget in Naira, and let our engine map frictionless transit across the bridge.</p>
            </div>
            <div className="pt-2">
              <button className="px-4 py-3 rounded-full bg-white flex items-center justify-center gap-2 w-full text-[#214FC7] font-bold"><GoPlusCircle className="w-4 h-4" /> <span className="font-inter text-sm tracking-[0.14px]">Start Crafting Itinerary</span></button>
            </div>
          </div>
        </div>
      </section>
    </main >
  )
}

export default Home