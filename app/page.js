'use client'

import React,{ useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import SearchBar from './components/Searchbar'
import {Suspense} from "react";

export default function Home() {
  // const searchParams = useSearchParams();
  // const lokasiParam = searchParams.get("lokasi");
  // const qrParam = searchParams.get("qr");
  const router = useRouter();
  const [scanQR, setScanQR] = useState(true);
  // const [lokasi, setLokasi] = useState(getCookie('lokasi_GGFIEURO'));
  // if(lokasi != undefined){
  //     setScanQR(true)
  // }

  useEffect(() => {
    if(getCookie('lokasi_GGFIEURO') != undefined){
        setScanQR(true)
    }else{
      setScanQR(false)
    }
  }, [scanQR]);

  const pageOpened = () => {
    setTimeout(() => {
      if(getCookie('lokasi_GGFIEURO') != undefined){
        setScanQR(true)

        gtag('event', 'Euro2024', {
          event_category: 'pageviewed',
          event_label: getCookie('lokasi_GGFIEURO'),
          event_action: 'PageOpened'
        })

        gtag('event', 'Euro2024', {
          event_category: 'clickButton',
          event_label: 'MainScreen - '+getCookie('lokasi_GGFIEURO'),
          event_action: 'Start'
        })

        setTimeout(() => {
          gtag('event', 'Euro2024', {
            event_category: 'pageviewed',
            event_label: 'TakePhoto - '+getCookie('lokasi_GGFIEURO'),
            event_action: 'PageOpened'
          })
        }, 0);

        router.push('/cam');
      }else{
        setScanQR(false)
      }
    }, 300);
  }

  function SearchBarFallback() {
    // return <>placeholder</>
  }

  return (
    <div className={`flex fixed w-full h-full bg-euro flex-col items-center justify-center ${scanQR ? '' : 'pointer-events-none'}`} onClick={pageOpened}>

      <Suspense fallback={<SearchBarFallback />}>
        <SearchBar />
      </Suspense>

      <div className={`fixed top-0 left-0 w-full h-full flex items-end justify-center content-end z-50 ${scanQR ? 'hidden' : ''}`}>
        <div className='relative w-[85%] mx-auto mb-1 flex justify-center items-center pointer-events-none'>
          <Image src='/euro/scan2.png' width={327} height={113} alt='Zirolu' className='w-full' priority />
        </div>
      </div>

      <div className='fixed w-[40%] mx-auto flex justify-center items-center pointer-events-none top-4 left-0 right-0'>
        <Image src='/euro/logo-ggfi.png' width={146} height={62} alt='Zirolu' className='w-full' priority />
      </div>
      <div className='fixed w-[35px] mx-auto flex justify-center items-center pointer-events-none top-4 right-4'>
        <Image src='/euro/logo-18.png' width={96} height={96} alt='Zirolu' className='w-full' priority />
      </div>
      <div className='fixed w-full mx-auto flex justify-center items-center pointer-events-none bottom-0 left-0 right-0'>
        <Image src='/euro/pattern-bawah.png' width={562} height={178} alt='Zirolu' className='w-full' priority />
      </div>
      <div className="fixed w-full mx-auto pointer-events-none bottom-0 left-0 right-0 py-3 px-5">
        <div className="relative w-[40%] flex justify-center items-center ml-auto mb-8">
          <div className='animate-upDown relative w-full mx-auto flex justify-center items-center pointer-events-none'>
            <Image src='/euro/jersey.png' width={396} height={452} alt='Zirolu' className='w-full' priority />
          </div>
        </div>
        <div className="relative w-full mx-auto flex justify-center items-center">
          <Image src='/euro/btn-start.png' width={359} height={88} alt='Zirolu' className='w-full' priority />
        </div>
      </div>
    </div>
  );
}
