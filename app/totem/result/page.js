'use client';

import Link from 'next/link';
import Image from "next/image";
import { getCookie } from 'cookies-next';
import React,{ useEffect, useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
// import io from 'socket.io-client';
import { Poppins} from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
// import BtnHexagon2 from "../components/BtnHexagon2";
import ReactToPrint from "react-to-print";


export default function Result() {
    const [imageResultAI, setImageResultAI] = useState(null);
    const [generateQR, setGenerateQR] = useState(null);
    const [linkQR, setLinkQR] = useState('https://zirolu.id/');
    const [loadingDownload, setLoadingDownload] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    let componentRef = useRef();

    const [payload, setPayload] = useState({
        name: 'GGIF Totem',
        phone: '000',
    });
    const { Canvas } = useQRCode();

    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('resulAIBase64')
            const item2 = localStorage.getItem('styleGender')
            setImageResultAI(item)
            setStyleGender(item2)
        }
    }, [imageResultAI, styleGender])

    const downloadImageAI = () => {
        // gtag('event', 'ClickButton', {
        //     event_category: 'Button',
        //     event_label: 'ResultPage - '+payload.stasiunName,
        //     event_action: 'CollectYourPhoto'
        // })
        
        import('html2canvas').then(html2canvas => {
            html2canvas.default(document.querySelector("#capture"), {scale:1}).then(canvas => 
                uploadImage(canvas)
            )
        }).catch(e => {console("load failed")})
        // setGenerateQR('true')
    }
    const uploadImage = async (canvas) => {
        setLoadingDownload('≈')

        canvas.toBlob(async function(blob) {
            let bodyFormData = new FormData();
            bodyFormData.append("name", payload.name+' - '+styleGender);
            bodyFormData.append("phone", payload.phone);
            bodyFormData.append("type", 'ggif');
            bodyFormData.append("file", blob, payload.name+'-ai-zirolu.png');
          
            const options = {
                method: 'POST',
                body: bodyFormData,
                headers: {
                    'Authorization': '89d183b7-ce47-4ceb-8676-1c2378f5be19:wZgrzLLKXOIjgACeJWH34iwOGqVZQmVg',
                    'Accept': 'application/json',
                }
            };
            
            await fetch('https://api.priapunyaselera.ai/v1/photoai', options)
                .then(response => response.json())
                .then(response => {
                    // console.log(response)
                    // console.log(response.file)
                    setLinkQR(response.file)
                    setGenerateQR('true')
                    setLoadingDownload(null)
                })
                .catch(err => {
                    if (typeof localStorage !== 'undefined') {
                        const item = localStorage.getItem('faceURLResult')
                        setLinkQR(item)
                        setGenerateQR('true')
                        setLoadingDownload(null)
                    }
                });
        });
    }
    const backHome = () => {
        // gtag('event', 'ClickButton', {
        //     event_category: 'Button',
        //     event_label: 'ResultPage - '+payload.stasiunName,
        //     event_action: 'BackToHome'
        // })
    }

    

    return (
        <main className="flex fixed h-full w-full bg-page overflow-auto flex-col justify-center items-center py-5 px-5 lg:py-16 lg:px-20" onContextMenu={(e)=> e.preventDefault()}>
            {/* QR */}
            {generateQR && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col z-40 bg-kai3 text-black bg-opacity-0'>
                    <div className='fixed w-full mx-auto flex justify-center items-center pointer-events-none top-0 left-0 right-0'>
                    <Image src='/top-logo.png' width={1179} height={246} alt='Zirolu' className='w-full' priority />
                    </div>
                    {/* <div className='fixed top-0 mx-auto w-[65%] mt-28'>
                        <Image src='/title-scan.png' width={815} height={195} alt='Zirolu' className='w-full' priority />
                    </div> */}

                    <p className={`text-center font-semibold text-5xl mb-7 px-5 text-white ${poppins.className}`}>Scan QR to Download the image</p>
                    <div className='relative mt-0 w-[60%] mx-auto flex items-center justify-center canvas-qr border-4 border-black' onClick={()=>{setGenerateQR(null)}}>
                        <Canvas
                        text={linkQR}
                        options={{
                            errorCorrectionLevel: 'M',
                            margin: 3,
                            scale: 4,
                            width: 500,
                            color: {
                            dark: '#000000',
                            light: '#ffffff',
                            },
                        }}
                        />
                    </div>
                    {/* <div className={`relative w-full mb-8`}>
                    <div className="relative w-[70%] mx-auto flex justify-center items-center flex-col mt-2">
                        <a href={linkQR} target='_blank' className="relative mx-auto flex justify-center items-center">
                            <Image src='/btn-download2.png' width={632} height={105} alt='Zirolu' className='w-full' priority />
                        </a>
                    </div>
                    </div>
                    <p className={`text-center font-semibold text-base px-5 text-white ${poppins.className}`}>Or you can print at <br></br>the Automatic Print Station</p> */}
                    <Link href='/totem' className='text-center font-semibold text-5xl text-white w-full mt-2 p-52' onClick={()=>{setGenerateQR(null)}}>Tap here to close</Link>
                    {/* <a href='/home' className='text-center font-semibold text-4xl py-20 pb-36 p-40'>Tap here to close</a> */}

                    {/* <div className={`fixed left-0 bottom-0 w-full`}>
                        <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                            <Link href='/totem' className="relative w-full mx-auto flex justify-center items-center pb-14">
                                <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                            </Link>
                        </div>
                    </div> */}
                </div>
            }
            {/* QR */}


            {/* DOWNLOAD & PRINT */}
            {imageResultAI && 
            <div className='relative w-full mt-0 mb-0 mx-auto flex justify-center items-center opacity-0 pointer-events-none'>
                <div className='absolute z-10 w-[100%]' id='capture'>
                    <div className={`relative w-[full] flex`}>
                        <Image src={imageResultAI}  width={683} height={1024} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div>
                <div className='absolute top-0 left-0  w-full' ref={(el) => (componentRef = el)}>
                    <div className={`relative w-[99%] flex`}>
                        <Image src={imageResultAI}  width={683} height={1024} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div>
            </div>
            }

            <div className={generateQR ? `opacity-0 pointer-events-none w-full` : 'w-full mt-[-3rem]'}>
                {imageResultAI && 
                <div className='relative w-[98%] mx-auto flex justify-center items-center rounded-sm' id='captureX' onClick={downloadImageAI}>
                    <div className='relative w-full'>
                        <Image src={imageResultAI}  width={1024} height={683} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div>
                }
                {loadingDownload && 
                    <div className='rrelative p-6 mt-5 border-2 border-[#b1454a] text-center bg-[#CF1F29] text-[#fff] text-5xl overflow-auto no-scrollbar w-[70%] mx-auto rounded-lg'>
                        <p>Please wait, loading...</p>
                    </div>
                }
                <div className={`relative w-full ${loadingDownload ? 'hidden' : ''}`}>
                    <div className={`w-full`}>
                        <div className={`w-full mt-6`}>
                            <div className="relative w-[90%] mx-auto flex justify-center items-center flex-col">
                                {/* <button className="w-full relative mx-auto flex justify-center items-center" onClick={downloadImageAI}>
                                    <Image src='/btn-download.png' width={515} height={164} alt='Zirolu' className='w-full' priority />
                                </button> */}


                                <div className={`w-full`} onClick={downloadImageAI}>
                                <ReactToPrint
                                trigger={() => 
                                    <div className={`w-full`}>
                                        <div className="w-full relative mx-auto flex justify-center items-center">
                                            <Image src='/btn-download2.png' width={1265} height={211} alt='Zirolu' className='w-full' priority />
                                        </div>
                                    </div>
                                }
                                content={() => componentRef}
                                />
                                </div> 

                                <Link href='/totem/generate' className="relative w-full mx-auto flex justify-center items-center pt-4">
                                    <Image src='/btn-retake2.png' width={820} height={160} alt='Zirolu' className='w-full' priority />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
