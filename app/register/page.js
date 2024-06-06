'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';
import BtnHexagon from "../components/BtnHexagon";
import { useRouter } from 'next/navigation';

import { Poppins} from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });

export default function Register() {
    const router = useRouter();
    const [payload, setPayload] = useState({
      name: '',
      phone: '',
    });


    useEffect(() => {
        document.getElementById('name').focus();
    }, [])


    const isValid = () => {
      if (payload.name && payload.phone) return true
      else return false;
    };

    const handleChange = (e) => {
        const { value, name } = e.target;
        setPayload((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleSubmit = () => {
        setCookie('name', payload.name);
        setCookie('phone', payload.phone);
        setTimeout(() => {
            router.push('/gg-jdm/how');
        }, 250);
    }
    return (
        <main className="flex fixed h-full w-full bg-page overflow-auto flex-col items-center justify-center pt-2 pb-5 px-5 lg:pt-0 lg:px-20 mt-0">
            <div className='fixed w-full mx-auto flex justify-center items-center pointer-events-none top-0 left-0'>
                <Image src='/top-logo.png' width={1179} height={246} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center mt-16 mb-6">
                <div className='relative w-[80%] mb-14 lg:mb-20'>
                    <label htmlFor="name" className={`text-light font-bold text-3xl lg:text-5xl mb-4 lg:mb-8 block ${poppins.className}`}>Full Name</label>
                    <div className='relative w-full'>
                        <Image
                            src='/kai/icon-user.png'
                            width={32}
                            height={32}
                            className='absolute left-4 top-1/2 -translate-y-1/2 lg:w-[55px]'
                            alt='icon'
                        />
                        <input
                            type='text'
                            value={payload.name}
                            id='name'
                            name='name'
                            className={`w-full rounded-lg font-semibold text-3xl lg:text-5xl outline-none py-6 lg:py-8 pr-3 pl-14 lg:pl-24 text-black bg-light ${poppins.className}`}
                            placeholder='Your Name'
                            onChange={handleChange}
                        />
                    </div>
                    {/* {payload.name} */}
                    {/* {errorMsg && <p className='text-[#E00A0A] text-xs'>{errorMsg}</p>} */}
                </div>
                <div className='relative w-[80%] mb-10'>
                    <label htmlFor="name" className={`text-light font-bold text-3xl lg:text-5xl mb-4 lg:mb-8 block ${poppins.className}`}>Phone Number</label>
                    <div className='relative w-full'>
                        <Image
                            src='/kai/icon-call.png'
                            width={32}
                            height={32}
                            className='absolute left-4 top-1/2 -translate-y-1/2 lg:w-[55px]'
                            alt='icon'
                        />
                        <p className={`absolute left-[3.5rem] lg:left-[5rem] top-1/2 font-bold text-3xl lg:text-5xl text-black -translate-y-1/2 ${poppins.className}`}>+62</p>
                        <input
                            type='number'
                            value={payload.phone}
                            id='phone'
                            name='phone'
                            className={`w-full rounded-lg font-semibold text-3xl lg:text-5xl outline-none py-6 lg:py-8 pr-3 pl-32 lg:pl-48 text-black bg-light ${poppins.className}`}
                            placeholder='Your number'
                            onChange={handleChange}
                        />
                    </div>
                    {/* {payload.phone} */}
                    {/* {errorMsg && <p className='text-[#E00A0A] text-xs'>{errorMsg}</p>} */}
                </div>
            </div>
            <div className="relative w-[60%] flex justify-center items-center">
                <BtnHexagon
                    disabled={!isValid()}
                    onClick={handleSubmit}
                />
            </div>
        </main>
    );
}
