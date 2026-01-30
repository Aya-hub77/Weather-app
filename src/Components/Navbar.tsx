import { useState, useEffect } from "react";
import { TbSettings } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import logo from '../assets/logo.svg'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
      const handleClickOutside = () => {
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <nav className="flex flex-row justify-between items-center p-5 media:py-10 media:px-20">
      <img src={logo} alt="logo" className="w-[160px]" />
      <div className="relative">
      <button className="flex flex-row items-center justify-between gap-2 text-white text-lg bg-bgWhite p-1 rounded-[8px] cursor-pointer active:outline-white" onClick={() => setIsOpen((prev) => !prev)}> <TbSettings className="text-white text-[20px] font-bold " /> Units
        <IoIosArrowDown className="text-white font-bold" />
      </button>
      {isOpen && (
        <div className='absolute top-[120%] right-0 z-10 bg-bgPur w-[230px] rounded-[10px] border border-gray-500 p-1 flex flex-col text-white gap-1 p-2'>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">Switch to Imperial</button>
          <p className="text-[14px] text-offWhite">Temperature</p>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">Celsius (°C)</button>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">Fahrenheit (°F)</button>
          <p className="text-[14px] text-offWhite border-t pt-2">Wind Speed</p>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">Km/h</button>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">mph</button>
          <p className="text-[14px] text-offWhite border-t mt-1 pt-2">Precipitation</p>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">Millimeters (mm)</button>
          <button className="hover:bg-bgWhite hover:cursor-pointer p-2 rounded-[10px] text-left">Inches (in)</button>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar