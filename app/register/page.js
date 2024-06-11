'use client';

import Image from "next/image";
import { useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';
import Link from 'next/link';
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
        document.getElementById('phone').focus(); 
    }, [])


    const isValid = () => {
      if (payload.phone) return true
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
        setCookie('phone', payload.phone);
        setTimeout(() => {
            router.push('/cam');
        }, 250);
    }
    return (
        <main className="flex fixed h-full w-full bg-page overflow-auto flex-col items-center justify-center pt-2 pb-2 px-5 lg:pt-0 lg:px-20 mt-0">
            <div className='fixed w-full mx-auto flex justify-center items-center pointer-events-none top-0 left-0'>
                <Image src='/top-logo.png' width={1179} height={246} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center mt-16 mb-6">
                <div className='relative w-[80%] mb-10'>
                    <label htmlFor="name" className={`text-light font-bold text-xl mb-4 block ${poppins.className}`}>Phone Number</label>
                    <div className='relative w-full'>
                        <Image
                            src='/icon-call.png'
                            width={32}
                            height={32}
                            className='absolute left-3 top-1/2 -translate-y-1/2 w-[18px]'
                            alt='icon'
                        />
                        <p className={`absolute left-[2.1rem] top-1/2 font-bold text-base text-black -translate-y-1/2 ${poppins.className}`}>+62</p>
                        <input
                            type='number'
                            value={payload.phone}
                            id='phone'
                            name='phone'
                            className={`w-full rounded-lg font-semibold text-base outline-none py-3 pr-3 pl-[4.5rem] text-black bg-light ${poppins.className}`}
                            placeholder='Your number'
                            onChange={handleChange}
                        />
                    </div>
                    {/* {payload.phone} */}
                    {/* {errorMsg && <p className='text-[#E00A0A] text-xs'>{errorMsg}</p>} */}
                </div>
            </div>
            <div className="relative w-[90%] mx-auto flex justify-center items-center flex-col">
                <button className={`w-full relative mx-auto flex justify-center items-center ${payload.phone ? '' : 'pointer-events-none opacity-10'}`} onClick={handleSubmit}>
                    <Image src='/btn-next.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                </button>
                <Link href='/' className="relative w-full mx-auto flex justify-center items-center pt-6">
                    <Image src='/btn-back.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                </Link>
            </div>
        </main>
    );
}
