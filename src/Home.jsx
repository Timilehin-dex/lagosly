import { SlLocationPin } from "react-icons/sl";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoSearchOutline } from "react-icons/io5";
import { IoFilter } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { BsLightningCharge } from "react-icons/bs";
import { GoPlusCircle } from "react-icons/go";
import { IoMdArrowForward } from "react-icons/io";
import { MdRadar } from "react-icons/md";
import { IoCarOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { CiLocationArrow1 } from "react-icons/ci";

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
            <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-medium text-sm tracking-[0.14px] text-[#0E1C31]">Restaurants</span></button>
          </div>
          <div className="carousel-item">
            <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">Rooftop</span></button>
          </div>
          <div className="carousel-item">
            <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">Beach Clubs</span></button>
          </div>
          <div className="carousel-item">
            <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">Cafe and Brunch</span></button>
          </div>
          <div className="carousel-item">
            <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">Art and Culture</span></button>
          </div>
          <div className="carousel-item">
            <button className="px-4 py-2 rounded-full shadow-[0px_1px_2px_-0px_#000000]/5 bg-white"><span className="font-inter font-semibold text-sm tracking-[0.14px] text-[#0E1C31]">Nightlife</span></button>
          </div>
        </div>
      </section>
      {/*  */}
      <section className="px-5 pt-6">
        <div className="p-4 rounded-2xl bg-[#F0F3FF] shadow-[0px_1px_2px_0px_#000000]/5 grid gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4169E1] rounded-full flex items-center justify-center">
                <MdRadar className="text-white w-3.5 h-3.5" />
              </div>
              <div>
                <h1 className="font-inter font-bold text-base tracking-[-0.17px] text-[#0E1C31]">Lekki Proximity Radar</h1>
                <p className="font-inter text-xs text-[#434654]">Within 15 mins driving right now</p>
              </div>
            </div>
            <div className="bg-[#E8EEFF] rounded-full px-2.5 py-1"><span className="font-inter text-xs font-semibold tracking-[0.36px] text-[#214FC7]">Live</span></div>
          </div>
          <div className="pt-1">
            <div className="grid gap-2.5">
              <div className="bg-white rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <div>
                  <h3 className="text-sm font-bold tracking-[0.14px] text-[#0E1C31]">Craft Gourmet Lekki</h3>
                  <p className="text-xs text-[#434654]">Bistro & Artisan Bakery · Open till 11:00 PM</p>
                  <div className="pt-px flex gap-3">
                    <span className="font-semibold text-xs tracking-[0.36px] text-[#00655B]">1.2km</span>
                    <span className="font-semibold text-xs tracking-[0.36px] text-[#434654]">6 min drive</span>
                  </div>
                </div>
                <div className="w-9 h-9 bg-[#DFE8FF] rounded-full flex items-center justify-center text-[#214FC7]">
                  <IoCarOutline className="w-5 h-5" />
                </div>
              </div>
              <div className="bg-white rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <div>
                  <h3 className="text-sm font-bold tracking-[0.14px] text-[#0E1C31]">Craft Gourmet Lekki</h3>
                  <p className="text-xs text-[#434654]">Bistro & Artisan Bakery · Open till 11:00 PM</p>
                  <div className="pt-px flex gap-3">
                    <span className="font-semibold text-xs tracking-[0.36px] text-[#00655B]">1.2km</span>
                    <span className="font-semibold text-xs tracking-[0.36px] text-[#434654]">6 min drive</span>
                  </div>
                </div>
                <div className="w-9 h-9 bg-[#DFE8FF] rounded-full flex items-center justify-center text-[#214FC7]">
                  <IoCarOutline className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*  */}
      <section className="pt-6">
        <div className="grid gap-3 px-5">
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31]">Trending in Lagos</h1>
              <p className="text-xs text-[#434654]">Top-saved by locals this week</p>
            </div>
            <div>
              <span className="text-[#214FC7] font-semibold tracking-[0.36px] text-xs">Verified Only</span>
            </div>
          </div>
          {/*  */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_88px_24px_0px_#0E1C31]/6">
            <div className="relative w-full h-44">
              {/* Background image */}
              <img
                src="/lagosly/src/assets/images.jpeg"
                alt="Victoria Island"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

              {/* Top section: Rating, location badge and bookmark */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">

                <div className="flex items-center gap-1.5">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                    <FaStar className="text-[#00655B] w-3 h-3" />
                    <span className="text-xs font-bold text-[#00655B] tracking-[0.36px]">4.8</span>
                  </div>

                  {/* Area */}
                  <div className="bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                    <span className="flex text-xs font-bold text-[#0E1C31] tracking-[0.66px]">
                      VICTORIA ISLAND
                    </span>
                  </div>
                </div>

                {/* Bookmark */}
                <button className="w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
                  <FaRegBookmark className="text-[#0E1C31]" />
                </button>

              </div>

              {/* Bottom section: Distance and travel time */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <CiLocationArrow1 className="text-[#DCE1FF] w-4 h-4" />
                <span className="text-xs font-medium text-white">
                  2.1 km away · 8 min drive
                </span>
              </div>

            </div>
            <div className="p-3.5 grid gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31]">NOK by Alara</h1>
                  <p className="text-xs text-[#434654]">Contemporary African Fine Dining ·Garden Lounge</p>
                </div>
                <div className="bg-[#DFE8FF] px-2 py-1 rounded-lg">
                  <span className="text-xs font-semibold">₦28,000<span className="text-xs font-normal">/pp</span></span>
                </div>
              </div>

              <div className="mt-1 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00655B]"></div>
                  <h4 className="font-medium text-xs text-[#00655B]">Tables free for 7:30 PM</h4>
                </div>
                <div><button className="px-3.5 py-1.5 bg-[#4169E1] rounded-full shadow-[0px_1px_2px_0px_#000000]/5 flex items-center gap-1 text-white"><FiPlus className=" w-3 h-3" /><span className="text-xs font-semibold tracking-[0.36px]">Add to Plan</span></button></div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_88px_24px_0px_#0E1C31]/6">
            <div className="relative w-full h-44">
              {/* Background image */}
              <img
                src="/lagosly/src/assets/images.jpeg"
                alt="Victoria Island"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

              {/* Top section: Rating, location badge and bookmark */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">

                <div className="flex items-center gap-1.5">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                    <FaStar className="text-[#00655B] w-3 h-3" />
                    <span className="text-xs font-bold text-[#00655B] tracking-[0.36px]">4.8</span>
                  </div>

                  {/* Area */}
                  <div className="bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                    <span className="flex text-xs font-bold text-[#0E1C31] tracking-[0.66px]">
                      VICTORIA ISLAND
                    </span>
                  </div>
                </div>

                {/* Bookmark */}
                <button className="w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
                  <FaRegBookmark className="text-[#0E1C31]" />
                </button>

              </div>

              {/* Bottom section: Distance and travel time */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <CiLocationArrow1 className="text-[#DCE1FF] w-4 h-4" />
                <span className="text-xs font-medium text-white">
                  2.1 km away · 8 min drive
                </span>
              </div>

            </div>
            <div className="p-3.5 grid gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31]">NOK by Alara</h1>
                  <p className="text-xs text-[#434654]">Contemporary African Fine Dining ·Garden Lounge</p>
                </div>
                <div className="bg-[#DFE8FF] px-2 py-1 rounded-lg">
                  <span className="text-xs font-semibold">₦28,000<span className="text-xs font-normal">/pp</span></span>
                </div>
              </div>

              <div className="mt-1 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00655B]"></div>
                  <h4 className="font-medium text-xs text-[#00655B]">Tables free for 7:30 PM</h4>
                </div>
                <div><button className="px-3.5 py-1.5 bg-[#4169E1] rounded-full shadow-[0px_1px_2px_0px_#000000]/5 flex items-center gap-1 text-white"><FiPlus className=" w-3 h-3" /><span className="text-xs font-semibold tracking-[0.36px]">Add to Plan</span></button></div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0px_88px_24px_0px_#0E1C31]/6">
            <div className="relative w-full h-44">
              {/* Background image */}
              <img
                src="/lagosly/src/assets/images.jpeg"
                alt="Victoria Island"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>

              {/* Top section: Rating, location badge and bookmark */}
              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">

                <div className="flex items-center gap-1.5">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                    <FaStar className="text-[#00655B] w-3 h-3" />
                    <span className="text-xs font-bold text-[#00655B] tracking-[0.36px]">4.8</span>
                  </div>

                  {/* Area */}
                  <div className="bg-white/90 rounded-full px-2.5 py-1 shadow-sm">
                    <span className="flex text-xs font-bold text-[#0E1C31] tracking-[0.66px]">
                      VICTORIA ISLAND
                    </span>
                  </div>
                </div>

                {/* Bookmark */}
                <button className="w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
                  <FaRegBookmark className="text-[#0E1C31]" />
                </button>

              </div>

              {/* Bottom section: Distance and travel time */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                <CiLocationArrow1 className="text-[#DCE1FF] w-4 h-4" />
                <span className="text-xs font-medium text-white">
                  2.1 km away · 8 min drive
                </span>
              </div>

            </div>
            <div className="p-3.5 grid gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-bold tracking-[-0.17px] text-[#0E1C31]">NOK by Alara</h1>
                  <p className="text-xs text-[#434654]">Contemporary African Fine Dining ·Garden Lounge</p>
                </div>
                <div className="bg-[#DFE8FF] px-2 py-1 rounded-lg">
                  <span className="text-xs font-semibold">₦28,000<span className="text-xs font-normal">/pp</span></span>
                </div>
              </div>

              <div className="mt-1 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00655B]"></div>
                  <h4 className="font-medium text-xs text-[#00655B]">Tables free for 7:30 PM</h4>
                </div>
                <div><button className="px-3.5 py-1.5 bg-[#4169E1] rounded-full shadow-[0px_1px_2px_0px_#000000]/5 flex items-center gap-1 text-white"><FiPlus className=" w-3 h-3" /><span className="text-xs font-semibold tracking-[0.36px]">Add to Plan</span></button></div>
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </section>
      {/*  */}
      <section className="pt-6">
        <div className="px-5 grid gap-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-inter font-bold tracking-[-0.17px] text-[#0E1C31]">Curated Lagos Guides</h1>
              <p className="font-inter text-xs text-[#434654]">Editorial routes curated by culture editors</p>
            </div>
            <div className="flex items-center gap-1 text-[#214FC7]">
              <a href="#" className="font-inter text-sm font-semibold tracking-[0.36px] ">Explore</a> <IoMdArrowForward />
            </div>
          </div>
          <div className=" grid gap-3">
            <div className="p-3 bg-white shadow-[0px_1px_2px_0px_#000000]/5 rounded-2xl">
              <div className="flex gap-3 items-center">
                <div className="rounded-xl w-20 h-20 bg-[#214FC7]">
                </div>
                <div className="py-0.5">
                  <div>
                    <div className="bg-[#DFE8FF] rounded px-2 py-0.5 w-fit"><span className="font-inter font-bold text-xs tracking-[0.66px] text-[#0E1C31]">4 STOPS · FULL DAY</span></div>
                    <h1 className="pt-1.5 font-inter font-bold tracking-[-0.17px] text-[#0E1C31]">Weekend in Lekki: Coffee to Rooftops</h1>
                    <p className="font-inter text-xs text-[#434654]">Start at Artisanal Roastery, sunset…</p>
                  </div>
                  <div className="pt-1">
                    <span className="font-inter font-semibold text-xs tracking-[0.36px] text-[#434654]">₦22,000 avg budget</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <span className="font-inter font-semibold text-xs tracking-[0.36px] text-[#434654]">Curated by Timilehin</span>
              </div>
            </div>
            <div className="p-3 bg-white shadow-[0px_1px_2px_0px_#000000]/5 rounded-2xl">
              <div className="flex gap-3 items-center">
                <div className="rounded-xl w-20 h-20 bg-[#214FC7]">
                </div>
                <div className="py-0.5">
                  <div>
                    <div className="bg-[#DFE8FF] rounded px-2 py-0.5 w-fit"><span className="font-inter font-bold text-xs tracking-[0.66px] text-[#0E1C31]">4 STOPS · FULL DAY</span></div>
                    <h1 className="pt-1.5 font-inter font-bold tracking-[-0.17px] text-[#0E1C31]">Weekend in Lekki: Coffee to Rooftops</h1>
                    <p className="font-inter text-xs text-[#434654]">Start at Artisanal Roastery, sunset…</p>
                  </div>
                  <div className="pt-1">
                    <span className="font-inter font-semibold text-xs tracking-[0.36px] text-[#434654]">₦22,000 avg budget</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <span className="font-inter font-semibold text-xs tracking-[0.36px] text-[#434654]">Curated by Timilehin</span>
              </div>
            </div>
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