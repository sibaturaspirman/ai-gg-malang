'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Image from "next/image";
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const useWebcam = ({
    videoRef
  }) => {
    useEffect(() => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
          if (videoRef.current !== null) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        });
      }
    }, [videoRef]);
};
// let waktuBatasTake;

export default function Cam() {
    const router = useRouter();
    const [enabled, setEnabled] = useState(false);
    const [captured, setCaptured] = useState(false);
    // const [countDown, setCoundown] = useState(5);
    // const [counter, setCounter] = useState(60);
    // const waktuBatasTake = useRef(null);
    const videoRef = useRef(null);
    const previewRef = useRef(null);
    const [scanQR, setScanQR] = useState(false);
    const [lokasi, setLokasi] = useState(getCookie('lokasi_GGFIEURO'));
    if(lokasi != undefined){
        setScanQR(true)
    }

    const [payload, setPayload] = useState({
      stasiun: getCookie('stasiun'),
      stasiunName: getCookie('stasiunName'),
    });

    useWebcam({ videoRef,previewRef});

    const captureVideo  = ({
        width = 512,
        height = 512,
    }) => {
        setCaptured(true)

        gtag('event', 'Euro2024', {
            event_category: 'clickButton',
            event_label: 'Take Photo - '+lokasi,
            event_action: 'Start'
        })

        setTimeout(() => {
            setEnabled(true)
            setCaptured(null)
            const canvas = previewRef.current;
            const video = videoRef.current;
            video.play;
            if (canvas === null || video === null) {
                return;
            }
        
            // Calculate the aspect ratio and crop dimensions
            const aspectRatio = video.videoWidth / video.videoHeight;
            let sourceX, sourceY, sourceWidth, sourceHeight;
        
            if (aspectRatio > 1) {
                // If width is greater than height
                sourceWidth = video.videoHeight;
                sourceHeight = video.videoHeight;
                sourceX = (video.videoWidth - video.videoHeight) / 2;
                sourceY = 0;
            } else {
                // If height is greater than or equal to width
                sourceWidth = video.videoWidth;
                sourceHeight = video.videoWidth;
                sourceX = 0;
                sourceY = (video.videoHeight - video.videoWidth) / 2;
            }
        
            // Resize the canvas to the target dimensions
            canvas.width = width;
            canvas.height = height;
        
            const context = canvas.getContext('2d');
            if (context === null) {
                return;
            }
        
            // Draw the image on the canvas (cropped and resized)
            context.drawImage(
                video,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                width,
                height
            );
    
            let faceImage = canvas.toDataURL();
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("faceImage", faceImage)
            }
            // setTimeout(() => {
            //     router.push('/generate');
            // }, 1250);
        }, 3000);
    }

    const retake = () => {
        setEnabled(false)
        // gtag('event', 'ClickButton', {
        //     event_category: 'Button',
        //     event_label: 'Retake - '+payload.stasiunName,
        //     event_action: 'Next'
        // })
    }

    const gtmGenerate = () => {
        setTimeout(() => {
            gtag('event', 'Euro2024', {
                event_category: 'pageviewed',
                event_label: 'SelectCountry - '+lokasi,
                event_action: 'PageOpened'
            })
        }, 0);
    }
    return (
        <main className="flex fixed h-full w-full bg-page-euro overflow-auto flex-col justify-center items-center py-5 px-5 lg:py-16 lg:px-20" onContextMenu={(e)=> e.preventDefault()}>

        <div className={`fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-50 ${scanQR ? 'hidden' : ''}`}>
          <div className='relative w-[80%] mx-auto flex justify-center items-center pointer-events-none'>
            <Image src='/euro/scan-qr.png' width={327} height={222} alt='Zirolu' className='w-full' priority />
          </div>
        </div>
            <div className='fixed w-[35px] mx-auto flex justify-center items-center pointer-events-none top-4 right-4'>
            <Image src='/euro/logo-18.png' width={96} height={96} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center">
                <div className='relative w-[60%] mx-auto flex justify-center items-center pointer-events-none mb-2'>
                    <Image src='/euro/title-take.png' width={348} height={94} alt='Zirolu' className='w-full' priority />
                </div>
                <div className='relative w-full mb-2'>
                    {captured && 
                    <div className='absolute top-0 left-0 right-0 bottom-0 w-[100px] h-[100px] lg:w-[174px] lg:h-[174px] overflow-hidden m-auto flex justify-center items-center pointer-events-none z-10'>
                        <div className='w-full animate-countdown translate-y-[35%]'>
                            <Image src='/countdown.png' width={174} height={522} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div>
                    }

                    {!enabled && 
                    <div className='w-[62%] mx-auto absolute left-0 right-0 bottom-0 z-10'>
                        <Image src='/frame-pose.png' width={426} height={461} alt='Zirolu' className='w-full' priority />
                    </div>
                    }

                    <video ref={videoRef} className={`w-[67%] lg:w-full mx-auto border-2 border-[#ffffff] rounded-sm ${enabled ? 'absolute opacity-0':'relative'}`} playsInline height={512}></video>
                    <canvas ref={previewRef} width="512" height="512" className={`${enabled ? 'relative':'absolute opacity-0'} w-[67%] lg:w-full top-0 left-0 right-0 mx-auto pointer-events-nones border-2 border-[#ffffff] rounded-sm`}></canvas>
                </div>
                {!enabled && 
                    <p className='block text-center text-base lg:text-4xl mt-1 mb-3 lg:mt-4 text-white'>*Ikuti garis pose dan tidak terlalu zoom</p> 
                }
            </div>


            {!enabled && 
                <div className="relative left-0 mt-4 w-full flex justify-center items-center flex-col">
                    <button className="relative mx-auto flex w-[100%] justify-center items-center" onClick={captureVideo}>
                        <Image src='/euro/btn-take.png' width={359} height={88} alt='Zirolu' className='w-full' priority />
                    </button>
                    <Link href='/' className="relative w-[100%] mx-auto flex justify-center items-center">
                        <Image src='/btn-back.png' width={433} height={81} alt='Zirolu' className='w-full' priority />
                    </Link>
                </div>
            }
            <div className={`relative left-0 w-full mt-4 ${!enabled ? 'hidden' : ''}`}>
                <div className="relative w-[100%] mx-auto flex justify-center items-center flex-col">
                    <Link href='/generate' className="w-full relative mx-auto flex justify-center items-center" onClick={gtmGenerate}>
                        <Image src='/euro/btn-continue.png' width={359} height={88} alt='Zirolu' className='w-full' priority />
                    </Link>
                    <button className="relative w-[70%] mx-auto flex justify-center items-center pt-2" onClick={retake}>
                        <Image src='/btn-retake2.png' width={433} height={81} alt='Zirolu' className='w-full' priority />
                    </button>
                </div>
            </div>
        </main>
    );
}
