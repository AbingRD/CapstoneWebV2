import React, { useContext, useState } from 'react'
import Register from '../../auth/Register';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosReq } from '../../../utils/axios';
import { MdOutlineSearch } from "react-icons/md";
import { IoPencilOutline } from "react-icons/io5";
import { FaPlusCircle } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { AppContext } from '../../../utils/context';


function ManageAccounts({ users, setUsers, dealerships, agents }) {
    const { setIsLoading } = useContext(AppContext);
    const [usersFilter, setUsersFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user => {
        try {
            const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
            let query = searchQuery.toLowerCase();
            return (
                user.role !== 'admin' &&
                (query === '' ||
                    user.id.toLowerCase().includes(query) ||
                    user.role.toLowerCase().includes(query) ||
                    fullName.includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.address.toLowerCase().includes(query))
            );
        } catch (error) {
            return null;
        }
    });


    const updateUserStatus = async (user, status) => {
        try {
            setIsLoading(true);
            const inputs = {
                userId: user.id,
                isApproved: status
            }
            await axiosReq.put("/admin/users/status", inputs);

            setUsers(users.map(u => u.id === user.id ? { ...u, isapproved: status } : u));

            setIsLoading(false);
            toast.success("Successfully changed user status");
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className='h-full w-full flex flex-col'>
            <div className='basis-[20%] p-6 flex flex-row justify-between'>
                <div className='flex flex-col justify-between'>
                    <h1 className='font-black text-2xl'>Howdy Admin</h1>
                    <p className='font-bold text-xl'>Accounts</p>

                </div>
                <div className="flex flex-row gap-4 items-end w-[80%]">
                    <div className='flex flex-row gap-20'>
                        <div className='flex flex-row relative items-center font-bold gap-3'>
                            <button onClick={() => {
                                setUsersFilter("all");
                            }} className='px-2 py-1 rounded-lg bg-[#7fdbe2]'>All</button>
                            <button onClick={() => {
                                setUsersFilter("buyer");
                            }} className='px-2 py-1 rounded-lg bg-[#7fdbe2]'>Buyers</button>
                            <button onClick={() => {
                                setUsersFilter("dealershipManager");
                            }} className='px-2 py-1 rounded-lg bg-[#7fdbe2]'>Dealership Manager</button>

                            <button onClick={() => {
                                setUsersFilter("dealershipAgent");
                            }} className='px-2 py-1 rounded-lg bg-[#7fdbe2]'>Dealership Agent</button>

                            <button onClick={() => {
                                setUsersFilter("bankAgent");
                            }} className='px-2 py-1 rounded-lg bg-[#7fdbe2]'>Bank Agents</button>
                        </div>
                    </div>
                    <div className='flex flex-row items-center w-[35%]'>
                        <input
                            type="text"
                            name="search"
                            placeholder='Search'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full rounded-lg py-1 px-2  bg-[#f5f3ff] text-[#4f41bc] border border-black'
                        />
                        <MdOutlineSearch className='relative right-6 text-[#4f41bc]' />
                    </div>
                </div>

            </div>
            <div className='border border-b border-black w-full h-[1px]'></div>

            <div className={`${usersFilter == "dealershipManager" ? "basis-[69%]" : "basis-[80%]"} max-h-full overflow-y-auto text-[13px] p-6 pt-0`}>
                {(usersFilter == "all") && (
                    <table className='w-full'>
                        <thead className='sticky top-0 bg-white font-black'>
                            <tr className='border-b border-black'>
                                <th className='border-r border-black'>User ID</th>
                                <th className='border-r border-black'>Type</th>
                                <th className='border-r border-black'>Full Name</th>
                                <th className='border-r border-black'>Email</th>
                                <th className='border-r border-black'>Address</th>
                                <th className='border-r border-black'>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 && (
                                filteredUsers.filter(user => user.role != "admin")
                                    .map(user => {
                                        const id = user.id;
                                        const role = user.role
                                        const firstname = user.firstname
                                        const lastname = user.lastname
                                        const fullname = (firstname == null || lastname == null) ? "NULL" : (firstname + " " + lastname)
                                        const email = user.email
                                        const address = user.address == null ? "NULL" : user.address
                                        return (
                                            <tr key={id} className='border-b border-black text-md'>
                                                <td className='border-r border-black p-2'>{id}</td>
                                                <td className='border-r border-black p-2'>{role}</td>
                                                <td className={`${fullname == "NULL" && 'text-red-600'} border-r border-black p-2`}>{fullname}</td>
                                                <td className='border-r border-black p-2'>{email}</td>
                                                <td className={`${address == "NULL" && 'text-red-600'} border-r border-black p-2`}>{address}</td>
                                                <td className={`border-r border-black p-2 ${user.isapproved == true && "text-green-600"}`}>{user.isapproved == true ? "Approved" : "Pending"}</td>
                                                <td className='p-2'>
                                                    {user.isapproved == true ? (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-xl'>
                                                            <IoPencilOutline className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, false)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-lg'>
                                                            <IoIosCheckmarkCircle className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, true)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                        )
                                    }
                                    )
                            )}
                        </tbody>
                    </table>
                )}
                {usersFilter == "buyer" && (
                    <table className='w-full'>
                        <thead className='sticky top-0 bg-white font-black'>
                            <tr className='border-b border-black'>
                                <th className='border-r border-black'>User ID</th>
                                <th className='border-r border-black'>Type</th>
                                <th className='border-r border-black'>Full Name</th>
                                <th className='border-r border-black'>Email</th>
                                <th className='border-r border-black'>Address</th>
                                <th className='border-r border-black'>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 && (
                                filteredUsers.filter(user => user.role == "buyer")
                                    .map(user => {
                                        const id = user.id;
                                        const role = user.role
                                        const firstname = user.firstname
                                        const lastname = user.lastname
                                        const fullname = (firstname == null || lastname == null) ? "NULL" : (firstname + " " + lastname)
                                        const email = user.email
                                        const address = user.address == null ? "NULL" : user.address
                                        return (
                                            <tr key={user.id} className='border-b border-black text-md'>
                                                <td className='border-r border-black p-2'>{id}</td>
                                                <td className='border-r border-black p-2'>{role}</td>
                                                <td className={`${fullname == "NULL" && 'text-red-600'} border-r border-black p-2`}>{fullname}</td>
                                                <td className='border-r border-black p-2'>{email}</td>
                                                <td className={`${address == "NULL" && 'text-red-600'} border-r border-black p-2`}>{address}</td>
                                                <td className={`border-r border-black p-2 ${user.isapproved == true && "text-green-600"}`}>{user.isapproved == true ? "Approved" : "Pending"}</td>
                                                <td className='p-2'>
                                                    {user.isapproved == true ? (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-xl'>
                                                            <IoPencilOutline className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, false)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-lg'>
                                                            <IoIosCheckmarkCircle className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, true)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                            )}
                        </tbody>
                    </table>
                )}
                {usersFilter == "dealershipManager" && (
                    <table className='w-full'>
                        <thead className='sticky top-0 bg-white font-black'>
                            <tr className='border-b border-black'>
                                <th className='border-r border-black'>User ID</th>
                                <th className='border-r border-black'>Type</th>
                                <th className='border-r border-black'>Full Name</th>
                                <th className='border-r border-black'>Email</th>
                                <th className='border-r border-black'>Dealership ID</th>
                                <th className='border-r border-black'>Dealership Name</th>
                                <th className='border-r border-black'>Dealership Address</th>
                                <th className='border-r border-black'>Total Agents</th>
                                <th className='border-r border-black'>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 && (
                                filteredUsers
                                    .filter(user => user.role == 'dealershipManager')
                                    .map(user => {
                                        const dealership = dealerships.find(d => d.manager.id == user.id);
                                        return (
                                            <tr key={user.id} className='border-b border-black text-md'>
                                                <td className='border-r border-black p-2'>{user.id}</td>
                                                <td className='border-r border-black p-2'>{user.role}</td>
                                                <td className='border-r border-black p-2'>{user.firstname} {user.lastname}</td>
                                                <td className='border-r border-black p-2'>{user.email}</td>
                                                <td className='border-r border-black p-2'>{dealership.id}</td>
                                                <td className='border-r border-black p-2'>{dealership.name}</td>
                                                <td className='border-r border-black p-2'>{dealership.address}</td>
                                                <td className='border-r border-black p-2 text-center'>{agents.filter(a => a.dealership == dealership.id).length}</td>
                                                <td className={`border-r border-black p-2 ${user.isapproved == true && "text-green-600"}`}>{user.isapproved == true ? "Approved" : "Pending"}</td>
                                                <td className='p-2'>
                                                    {user.isapproved == true ? (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-xl'>
                                                            <IoPencilOutline className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, false)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-lg'>
                                                            <IoIosCheckmarkCircle className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, true)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )
                            )}
                        </tbody>
                    </table>
                )}

                {usersFilter == "dealershipAgent" && (
                    <table className='w-full'>
                        <thead className='sticky top-0 bg-white font-black'>
                            <tr className='border-b border-black'>
                                <th className='border-r border-black'>User ID</th>
                                <th className='border-r border-black'>Type</th>
                                <th className='border-r border-black'>Full Name</th>
                                <th className='border-r border-black'>Email</th>
                                <th className='border-r border-black'>Dealership ID</th>
                                <th className='border-r border-black'>Dealership Name</th>
                                <th className='border-r border-black'>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredUsers
                                    .filter(user => user.role == "dealershipAgent")
                                    .map(user => {
                                        const agent = agents.find(agent => agent.id = user.id)
                                        if (!user) return null;
                                        if (user.role != "dealershipAgent") return null;
                                        const isApproved = user.isapproved === true;
                                        const dealership = dealerships.find(d => d.id == agent.dealership.id);

                                        return (
                                            <tr key={agent.id} className='border-b border-black text-md'>
                                                <td className='border-r border-black p-2'>{user.id}</td>
                                                <td className='border-r border-black p-2'>{user.role}</td>
                                                <td className='border-r border-black p-2'>{user.firstname} {user.lastname}</td>
                                                <td className='border-r border-black p-2'>{user.email}</td>
                                                <td className='border-r border-black p-2'>{dealership.id}</td>
                                                <td className='border-r border-black p-2'>{dealership.name}</td>
                                                <td className={`border-r border-black p-2 ${isApproved && "text-green-600"}`}>{isApproved ? "Approved" : "Pending"}</td>
                                                <td className='p-2'>
                                                    {isApproved ? (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-xl'>
                                                            <IoPencilOutline className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(agent, false)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-lg'>
                                                            <IoIosCheckmarkCircle className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, true)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })

                            }
                        </tbody>
                    </table>
                )}

                {usersFilter == "bankAgent" && (
                    <table className='w-full'>
                        <thead className='sticky top-0 bg-white font-black'>
                            <tr className='border-b border-black'>
                                <th className='border-r border-black'>User ID</th>
                                <th className='border-r border-black'>Type</th>
                                <th className='border-r border-black'>Full Name</th>
                                <th className='border-r border-black'>Email</th>
                                <th className='border-r border-black'>Dealership ID</th>
                                <th className='border-r border-black'>Dealership Name</th>
                                <th className='border-r border-black'>Bank Name</th>
                                <th className='border-r border-black'>Bank Address</th>
                                <th className='border-r border-black'>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredUsers.filter(user => user.role == "bankAgent")
                                    .map(user => {
                                        const agent = agents.find(a => a.id === user.id);
                                        if (!agent) return null;
                                        const isApproved = user.isapproved === true;
                                        const dealership = dealerships.find(d => d.id == agent.dealership.id);
                                        console.log(agent)
                                        return (
                                            <tr key={agent.id} className='border-b border-black text-md'>
                                                <td className='border-r border-black p-2'>{user.id}</td>
                                                <td className='border-r border-black p-2'>{user.role}</td>
                                                <td className='border-r border-black p-2'>{user.firstname} {user.lastname}</td>
                                                <td className='border-r border-black p-2'>{user.email}</td>
                                                <td className='border-r border-black p-2'>{dealership.id}</td>
                                                <td className='border-r border-black p-2'>{dealership.name}</td>
                                                <td className='border-r border-black p-2'>{agent.bank}</td>
                                                <td className='border-r border-black p-2'>{agent.bankaddress}</td>
                                                <td className={`border-r border-black p-2 ${isApproved && "text-green-600"}`}>{isApproved ? "Approved" : "Pending"}</td>
                                                <td className='p-2'>
                                                    {isApproved ? (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-xl'>
                                                            <IoPencilOutline className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, false)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-row gap-2 items-center justify-center text-lg'>
                                                            <IoIosCheckmarkCircle className='text-green-600 cursor-pointer' onClick={() => updateUserStatus(user, true)} />
                                                            <FaRegTrashCan className='text-red-600 cursor-pointer' />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })

                            }
                        </tbody>
                    </table>
                )}

            </div>

            {usersFilter == "dealershipManager" && (
                <Link to="/manager/register" element={<Register registerType={"manager"} isAdmin={true}></Register>} className='flex flex-row gap-2 items-center p-4'>
                    <FaPlusCircle className='text-green-600 text-5xl cursor-pointer' />
                    <p className='font-semibold'>Add Dealership Manager</p>
                </Link>
            )}
        </div>


    )
}

export default ManageAccounts