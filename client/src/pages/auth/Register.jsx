import React, { useContext, useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { axiosReq } from '../../utils/axios';
import Logo from "../../resources/Logo"
import { FcGoogle } from "react-icons/fc";
import Spinner from '../../components/Spinner';
import { AppContext } from '../../utils/context';

function Register({ registerType }) {
    const { userData, isLoading, setIsLoading } = useContext(AppContext)
    const [modeOfPayments, setModeOfPayments] = useState([]);
    const [showBankLoanOptions, setShowBankLoanOptions] = useState(false);
    const [dealershipImage, setDealershipImage] = useState(null);
    const [agentRegisterType, setAgentRegisterType] = useState("bankAgent");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        try {
            setIsLoading(true);
            e.preventDefault();

            const formData = {};

            for (const element of e.target.elements) {
                if (element.name && element.value) {
                    formData[element.name] = element.value;
                }
            }
            await axiosReq.post("/buyer/register", formData);
            setIsLoading(false);
            toast.success("Registered succesfully");
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(error.response.data.message)
        }
    }

    const handleGoogleRegister = async (e) => {
        const response = await fetch("http://localhost:6969/auth/google");
        const data = await response.json();
        const url = data.data.authorizationUrl;
        window.location.href = url;
    }

    const handleManagerRegister = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            const formData = new FormData();

            for (const element of e.target.elements) {
                if (element.name && element.value) {
                    formData.append(element.name, element.value);
                }
            }

            formData.set("dealershipImage", dealershipImage);
            formData.set("modeOfPayments", modeOfPayments);

            await axiosReq.post("/manager/register", formData);
            setIsLoading(false);
            toast.success("Registered succesfully");
        } catch (error) {
            setIsLoading(false);
            console.error(error)
            toast.error(error.response.data.message)
        }
    }

    const handleAgentRegister = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            const inputs = {};

            for (const element of e.target.elements) {
                if (element.name && element.value) {
                    inputs[element.name] = element.value;
                }
            }

            inputs.agentType = agentRegisterType;
            await axiosReq.post("/agent/register", inputs);
            setIsLoading(false);
            toast.success("Successfully added new agent")
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            toast.error(error.response.data.message);
        }
    }

    const handleModeOfPaymentChange = (event) => {
        const { name, value, checked } = event.target;
        if (checked) {
            setModeOfPayments(prevOptions => [...prevOptions, value]);
        } else {
            setModeOfPayments(prevOptions => prevOptions.filter(option => option !== value));
        }
    };

    const handleShowBankLoanOption = (e) => {
        setShowBankLoanOptions(!showBankLoanOptions);
    };

    useEffect(() => {
        if (registerType == "agent" && userData.role != "dealershipManager") {
            navigate("/")
        }
    }, [])

    return (
        <div>
            {isLoading && <Spinner />}
            <div className='flex flex-col justify-center items-center text-xs p-5'>
                <div className='flex-basis-[20%]'>
                    <Logo />
                </div>
                <div>
                    {registerType == 'buyer' && (
                        <form onSubmit={(e) => handleRegister(e)} className='flex flex-col gap-4 justify-center border p-10 pb-5 bg-gray-200 rounded-lg'>
                            <h1 className='font-bold text-lg text-center'>Buyer Registration</h1>
                            <div className='flex flex-row gap-1'>
                                <div class="relative w-full min-w-[200px] h-10">
                                    <input name="firstName" required
                                        class="peer bg-[#FAFAF9] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 shadow-md"
                                        placeholder=" " /><label
                                            class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:-top-[13px] peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] before:content[' '] before:block before:w-2.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md peer-focus:-left-3 before:pointer-events-none before:transition-all peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900">First Name
                                    </label>
                                </div>

                                <div class="relative w-full min-w-[200px] h-10">
                                    <input name="lastName" required
                                        class="peer bg-[#FAFAF9] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 shadow-md"
                                        placeholder=" " /><label
                                            class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:-top-[13px] peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] before:content[' '] before:block before:w-2.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md peer-focus:-left-3 before:pointer-events-none before:transition-all peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900">Last Name
                                    </label>
                                </div>
                            </div>

                            <div class="relative w-full min-w-[200px] h-10">
                                <input name="email" type="email" required
                                    class="peer bg-[#FAFAF9] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 shadow-md"
                                    placeholder=" " /><label
                                        class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:-top-[13px] peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] before:content[' '] before:block before:w-2.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md peer-focus:-left-3 before:pointer-events-none before:transition-all peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900">Email
                                </label>
                            </div>

                            <div class="relative w-full min-w-[200px] h-10">
                                <input name="password" type="password" required
                                    class="peer bg-[#FAFAF9] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 shadow-md"
                                    placeholder=" " /><label
                                        class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:-top-[13px] peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] before:content[' '] before:block before:w-2.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md peer-focus:-left-3 before:pointer-events-none before:transition-all peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900">Password
                                </label>
                            </div>

                            <div className='flex flex-row gap-2 items-center'>
                                <label htmlFor="gender" className='text-md font-semibold'>Gender: </label>
                                <select name="gender" className='px-2 py-1 border border-black rounded' required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            <div class="relative w-full min-w-[200px] h-10">
                                <input name="phoneNumber" type="tel" required
                                    class="peer bg-[#FAFAF9] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 shadow-md"
                                    placeholder=" " /><label
                                        class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:-top-[13px] peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] before:content[' '] before:block before:w-2.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md peer-focus:-left-3 before:pointer-events-none before:transition-all peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900">Phone Number
                                </label>
                            </div>

                            <div class="relative w-full min-w-[200px] h-10">
                                <input name="address" required
                                    class="peer bg-[#FAFAF9] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-black placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 shadow-md"
                                    placeholder=" " /><label
                                        class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:-top-[13px] peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[12px] before:content[' '] before:block before:w-2.5 before:mt-[6.5px] before:mr-1 before:rounded-tl-md peer-focus:-left-3 before:pointer-events-none before:transition-all peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900">Address
                                </label>
                            </div>
                            <div className="flex flex-col items-center w-full gap-1">
                                <button type="submit" className='w-full border rounded px-3 py-2 bg-blue-300 w-100  shadow-md shadow-gray-300'>Sign up</button>
                                <div className='flex flex-row w-[100%] items-center justify-center gap-1'>
                                    <div className='border border-b border-black w-[80%] h-[1px]'></div>
                                    <p>Or</p>
                                    <div className='border border-b border-black w-[80%] h-[1px]'></div>
                                </div>

                                <button type="button" onClick={handleGoogleRegister} className='border bg-white p-3 rounded-lg flex flex-row items-center gap-2 shadow-md'>
                                    <FcGoogle className='text-xl' />
                                    <p>Sign Up with Google</p>
                                </button>
                            </div>


                            <span className='flex flex-row gap-2 text-sm'>
                                <p>Already have an account?</p>
                                <Link to="/login" className='text-blue-500'>Login</Link>
                            </span>
                        </form>
                    )}

                    {registerType == 'manager' && (
                        <form onSubmit={(e) => handleManagerRegister(e)} encType='multipart/form-data' className='flex flex-col gap-3 justify-center border p-10 bg-gray-200 rounded-lg'>
                            <h1 className='font-bold text-xl text-center'>Dealership Manager Registration</h1>
                            <div className='flex flex-row gap-2 w-full'>
                                <input type="text" name="firstName" placeholder='First Name' className='px-2 py-1 border border-black rounded w-1/2' required />
                                <input type="text" name="lastName" placeholder='Last Name' className='px-2 py-1 border border-black rounded w-1/2' required />
                            </div>
                            <input type="email" name="email" placeholder='Enter your email' className='px-2 py-1 border border-black rounded' required />
                            <input type="password" name="password" placeholder='Password' className='px-2 py-1 border border-black rounded' required />
                            <div className='flex flex-row gap-2 items-center'>
                                <label htmlFor="gender" className='text-md font-semibold'>Gender: </label>
                                <select name="gender" className='px-2 py-1 border border-black rounded' required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            <input type="tel" name="phoneNumber" placeholder='Phone Number' className='px-2 py-1 border border-black rounded' required />
                            <input type="text" name="dealershipName" placeholder='Dealership Name' className='px-2 py-1 border border-black rounded' required />
                            <div className='flex flex-row items-center gap-3'>
                                <label htmlFor="dealershipImage" className='font-semibold text-md'>Dealership Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    name="dealershipImage"
                                    className='px-2 py-1 border border-black rounded'
                                    onChange={(e) => setDealershipImage(e.target.files[0])}
                                    required
                                />
                            </div>
                            <input type="text" name="establishmentAddress" placeholder='Establishment Address' className='px-2 py-1 border border-black rounded' required />


                            <label htmlFor="">Temporary (need MAPS API key(paid), input valid lat and long as it will be used to calculate distance from buyer to dealership est.)</label>
                            <input type="text" name="latitude" placeholder='Latitude' className='px-2 py-1 border border-black rounded' required />

                            <input type="text" name="longitude" placeholder='Longitude' className='px-2 py-1 border border-black rounded' required />

                            <label htmlFor="modeOfPayment">Mode of Payment</label>

                            <div className='flex flex-row gap-3'>
                                <label className='flex items-center'>
                                    <input name="inhouseFinance" value="inhouseFinance" type="checkbox" onChange={handleModeOfPaymentChange} />
                                    Inhouse Finance
                                </label>

                                <label className='flex items-center'>
                                    <input name="bankLoan" value="bankLoan" type="checkbox" onChange={handleShowBankLoanOption} />
                                    Bank Loan
                                </label>

                                <label className='flex items-center'>
                                    <input name="cash" value="cash" type='checkbox' onChange={handleModeOfPaymentChange} />
                                    Cash
                                </label>

                                <label className='flex items-center'>
                                    <input name="cheque" value="cheque" type='checkbox' onChange={handleModeOfPaymentChange} />
                                    Cheque
                                </label>
                            </div>

                            {showBankLoanOptions && (
                                <div className='flex flex-row gap-5'>
                                    <label>
                                        <input type="checkbox" name="bankLoanOption" value="dealershipBankChoice" onChange={handleModeOfPaymentChange} />
                                        Dealership Bank Choice
                                    </label>

                                    <label>
                                        <input type="checkbox" name="bankLoanOption" value="buyerBankChoice" onChange={handleModeOfPaymentChange} />
                                        Buyer Bank Choice
                                    </label>
                                </div>
                            )}

                            {userData.role == 'admin' ? (
                                <>
                                    <button type="submit" className='border rounded px-3 py-2 bg-blue-300 w-100'>Register Dealership Manager</button>
                                    <button onClick={() => navigate(-1)}>Go Back</button>
                                </>
                            ) : (
                                <>
                                    <button type="submit" className='border rounded px-3 py-2 bg-blue-300 w-100'>Sign up</button>
                                    <div className='flex flex-row w-[100%] items-center justify-center gap-3'>
                                        <div className='border border-b border-black w-[80%] h-[1px]'></div>
                                        <p>Or</p>
                                        <div className='border border-b border-black w-[80%] h-[1px]'></div>
                                    </div>

                                    <button type="button" className='border bg-white p-3 rounded-lg flex flex-row items-center gap-2'>
                                        <FcGoogle className='text-xl' />
                                        <p>Sign Up with Google</p>
                                    </button>

                                    <span className='flex flex-row gap-2'>
                                        <p>Already have an account?</p>
                                        <Link to="/login" className='text-blue-500'>Login</Link>
                                    </span>
                                </>
                            )}


                        </form>
                    )}

                    {registerType == "agent" && (
                        <form onSubmit={(e) => handleAgentRegister(e)} encType='multipart/form-data' className='flex flex-col gap-3 justify-center border p-10 bg-gray-200 rounded-lg'>
                            <h1 className='font-bold text-xl text-center'>Register new agent as</h1>
                            <div className='flex flex-row justify-center gap-2'>
                                <label>
                                    <input type="radio" name="agentType" value="bankAgent" onChange={() => setAgentRegisterType("bankAgent")} checked={agentRegisterType == 'bankAgent'} />
                                    Bank Agent
                                </label>
                                <label>
                                    <input type="radio" name="agentType" value="dealershipAgent" onChange={() => setAgentRegisterType("dealershipAgent")} checked={agentRegisterType == 'dealershipAgent'} />
                                    Dealership Agent
                                </label>
                            </div>

                            <div className='flex flex-row gap-2 w-full'>
                                <input type="text" name="firstName" placeholder='First Name' className='px-2 py-1 border border-black rounded w-1/2' required />
                                <input type="text" name="lastName" placeholder='Last Name' className='px-2 py-1 border border-black rounded w-1/2' required />
                            </div>
                            <input type="email" name="email" placeholder='Enter email' className='px-2 py-1 border border-black rounded' required />
                            <input type="password" name="password" placeholder='Password' className='px-2 py-1 border border-black rounded' required />
                            <div className='flex flex-row gap-2 items-center'>
                                <label htmlFor="gender" className='text-md font-semibold'>Gender: </label>
                                <select name="gender" className='px-2 py-1 border border-black rounded' required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            <input type="tel" name="phoneNumber" placeholder='Phone Number' className='px-2 py-1 border border-black rounded' required />
                            <input type="text" name="address" placeholder='Address' className='px-2 py-1 border border-black rounded' required />
                            {agentRegisterType == "bankAgent" && (
                                <>
                                    <input type="text" name="bank" placeholder='Bank' className='px-2 py-1 border border-black rounded' required />
                                    <input type="text" name="bankAddress" placeholder='Bank Address' className='px-2 py-1 border border-black rounded' required />
                                </>
                            )}

                            <button type="submit" className='border rounded px-3 py-2 bg-blue-300 w-100'>Register New Agent</button>
                            <button onClick={() => navigate(-1)}>Go Back</button>
                        </form>
                    )}

                </div>

            </div >
        </div>
    )
}

export default Register