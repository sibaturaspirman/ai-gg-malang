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
    return (
        <main className="flex fixed h-full w-full bg-page overflow-auto flex-col justify-center items-center py-5 px-5 lg:py-16 lg:px-20" onContextMenu={(e)=> e.preventDefault()}>
            <div className='fixed w-full mx-auto flex justify-center items-center pointer-events-none top-0 left-0 right-0'>
                <Image src='/top-logo.png' width={1179} height={246} alt='Zirolu' className='w-full' priority />
            </div>
            <div className="relative w-full flex flex-col justify-center items-center mt-[28vh] mb-[-3vh]">
                <div className='relative w-full mb-2'>
                    {captured && 
                    <div className='absolute top-0 left-0 right-0 bottom-0 w-[100px] h-[100px] lg:w-[174px] lg:h-[174px] overflow-hidden m-auto flex justify-center items-center pointer-events-none z-10'>
                        <div className='w-full animate-countdown translate-y-[35%]'>
                            <Image src='/countdown.png' width={174} height={522} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div>
                    }

                    {!enabled && 
                    <div className='w-[67%] mx-auto absolute left-0 right-0 bottom-[1rem] z-10'>
                        <Image src='/frame-pose.png' width={426} height={461} alt='Zirolu' className='w-full' priority />
                    </div>
                    }

                    {/* <video ref={videoRef} className={`w-[67%] lg:w-full mx-auto border-2 border-[#ffffff] rounded-sm ${enabled ? 'absolute opacity-0':'relative'}`} playsInline height={512}></video>
                    <canvas ref={previewRef} width="512" height="512" className={`${enabled ? 'relative':'absolute opacity-0'} w-[67%] lg:w-full top-0 left-0 right-0 mx-auto pointer-events-nones border-2 border-[#ffffff] rounded-sm`}></canvas> */}

                    <video ref={videoRef} className={`w-full rotate-90 mx-auto top-[-8rem] border-2 border-[#ffffff] rounded-sm ${enabled ? 'absolute opacity-0':'relative'}`} playsInline height={512}></video>
                    <canvas ref={previewRef} width="512" height="512" className={`${enabled ? 'relative':'absolute opacity-0'}  rotate-90 w-[60%] top-[-8rem] left-0 right-0 mx-auto pointer-events-nones border-2 border-[#ffffff] rounded-sm`}></canvas>
                </div>
                {!enabled && 
                    <p className='block text-center text-base lg:text-5xl mt-1 mb-3 lg:mt-4 text-white'>*Ikuti garis pose dan tidak terlalu zoom</p> 
                }
            </div>


            {!enabled && 
                <div className="relative left-0 mt-20 w-full flex justify-center items-center flex-col">
                    <button className="relative mx-auto flex w-[100%] justify-center items-center" onClick={captureVideo}>
                        <Image src='/btn-capture.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                    </button>
                    <Link href='/totem' className="relative w-[100%] mx-auto flex justify-center items-center">
                        <Image src='/btn-back.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                    </Link>
                </div>
            }
            <div className={`relative left-0 w-full mt-10 ${!enabled ? 'hidden' : ''}`}>
                <div className="relative w-[100%] mx-auto flex justify-center items-center flex-col">
                    <Link href='/totem/generate' className="w-full relative mx-auto flex justify-center items-center">
                        <Image src='/btn-next.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                    </Link>
                    <button className="relative w-full mx-auto flex justify-center items-center pt-2" onClick={retake}>
                        <Image src='/btn-retake2.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                    </button>
                </div>
            </div>
        </main>
    );
}
