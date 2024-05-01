import React from 'react'
import { MdOutlineSearch } from "react-icons/md";

function SideNav({ handleOnSearch, handleOnFilter }) {

    return (
        <div className='flex flex-col gap-5 w-[30vh] h-screen fixed border z-30 bg-[#eeeeee] border-r-[#CBD5E1]px-4 pt-20' style={{ boxShadow: '1px 0 2px -1px rgba(0, 0, 0, 0.3)' }}>
            <div className='flex flex-row items-center justify-center'>
                <input
                    type="text"
                    name="search"
                    placeholder='Search'
                    onChange={handleOnSearch}
                    className='w-[80%] rounded-lg py-1 px-2 bg-[#f5f3ff] text-[#4f41bc] border border-black pr-6'
                />
                <MdOutlineSearch className='relative right-6 text-[#4f41bc]' />
            </div>

            <div className='flex flex-col items-center'>
                <div className='w-[80%]'>
                    <p className='text-start'>Filter</p>
                </div>
                <div className='flex flex-row gap-2 justify-start w-[80%]'>
                    <input type="checkbox" name="car" onChange={handleOnFilter} />
                    <p>Car</p>
                </div>

                <div className='flex flex-row gap-2 justify-start w-[80%]'>
                    <input type="checkbox" name="motorcycle" onChange={handleOnFilter} />
                    <p>Motorycle</p>
                </div>
            </div>

        </div>
    )
}

export default SideNav