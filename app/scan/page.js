'use client';

// import { useEffect, useRef, useState, useMemo } from 'react';
import Image from "next/image";
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
// import { getCookie } from 'cookies-next';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

export default function Scan() {
    gtag('event', 'Euro2024', {
        event_category: 'pageviewed',
        event_label: 'PopUpError',
        event_action: 'PageOpened'
    })

    return (
        <main className="flex fixed h-full w-full bg-page-euro overflow-auto flex-col justify-center items-center py-5 px-5 lg:py-16 lg:px-20" onContextMenu={(e)=> e.preventDefault()}>
            <div className='fixed w-[40%] mx-auto flex justify-center items-center pointer-events-none top-4 left-0 right-0'>
            <Image src='/euro/logo-ggfi.png' width={146} height={62} alt='Zirolu' className='w-full' priority />
            </div>
            <div className='fixed w-[35px] mx-auto flex justify-center items-center pointer-events-none top-4 right-4'>
            <Image src='/euro/logo-18.png' width={96} height={96} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center">
                <div className='relative w-[80%] mx-auto flex justify-center items-center pointer-events-none'>
                <Image src='/euro/scan-qr.png' width={327} height={222} alt='Zirolu' className='w-full' priority />
                </div>
            </div>
        </main>
    );
}
