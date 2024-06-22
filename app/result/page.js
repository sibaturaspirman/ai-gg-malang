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
// import ReactToPrint from "react-to-print";

const webShareSupported = 'canShare' in navigator;

export default function Result() {
    const [imageResultAI, setImageResultAI] = useState(null);
    const [generateQR, setGenerateQR] = useState(null);
    const [linkQR, setLinkQR] = useState('https://zirolu.id/');
    const [loadingDownload, setLoadingDownload] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    const [isNativeShare, setNativeShare] = useState(false);
    let componentRef = useRef();

    const [payload, setPayload] = useState({
        name: 'GGIF',
        phone: getCookie('phone'),
    });
    const { Canvas } = useQRCode();

    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('resulAIBase64')
            const item2 = localStorage.getItem('styleGender')
            const item3 = localStorage.getItem('faceURLResult')
            setImageResultAI(item)
            setStyleGender(item2)
            setLinkQR(item3)
        }
        if (navigator.share) {
            setNativeShare(true);
        }
    }, [imageResultAI, styleGender, linkQR])

    const downloadImageAI = () => {
        // gtag('event', 'ClickButton', {
        //     event_category: 'Button',
        //     event_label: 'ResultPage - '+payload.stasiunName,
        //     event_action: 'CollectYourPhoto'
        // })
        
        // import('html2canvas').then(html2canvas => {
        //     html2canvas.default(document.querySelector("#capture"), {scale:4}).then(canvas => 
        //         uploadImage(canvas)
        //     )
        // }).catch(e => {console("load failed")})
        setGenerateQR('true')
    }
    const uploadImage = async (canvas) => {
        setLoadingDownload('≈')

        canvas.toBlob(async function(blob) {
            let bodyFormData = new FormData();
            bodyFormData.append("name", payload.name+' - '+styleGender);
            bodyFormData.append("phone", payload.phone);
            bodyFormData.append("type", 'ggif');
            bodyFormData.append("fromPhone", true);
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
        gtag('event', 'ClickButton', {
            event_category: 'Button',
            event_label: 'ResultPage - '+payload.stasiunName,
            event_action: 'BackToHome'
        })
    }

    const sharePhoto = async () => {
        // gtag('event', 'ClickButton', {
        //     event_category: 'Button',
        //     event_label: 'ResultPage - '+payload.stasiunName,
        //     event_action: 'BackToHome'
        // })

        if(isNativeShare){
            // NEW WAY
            import('html2canvas').then(html2canvas => {
                html2canvas.default(document.querySelector("#capture"), {scale:4}).then(async canvas => {
                    const dataUrl = canvas.toDataURL();
                    const blob = await (await fetch(dataUrl)).blob();
                    console.log(blob)
                    const filesArray = [
                        new File(
                            [blob],
                            "Pria Punya Selera.png",
                            {
                                type: blob.type,
                                lastModified: new Date().getTime()
                            }
                        )
                    ];
                    const shareData = {
                        files: filesArray,
                    };
                    if (navigator.canShare(shareData)) {
                        await navigator.share(shareData);
                        try {
                        await navigator.share(shareData);
                        } catch (error) {
                        console.log(error.message)
                        }
                    }
                })
            }).catch(e => {console("load failed")})


            // const canvas = await html2canvas(document.querySelector("#capture"));
            // const dataUrl = canvas.toDataURL();
            // const blob = await (await fetch(dataUrl)).blob();
            // console.log(blob)
            // const filesArray = [
            //     new File(
            //         [blob],
            //         "Pria Punya Selera.png",
            //         {
            //             type: blob.type,
            //             lastModified: new Date().getTime()
            //         }
            //     )
            // ];
            // const shareData = {
            //     files: filesArray,
            // };
            // if (navigator.canShare(shareData)) {
            //     await navigator.share(shareData);
            //     try {
            //     await navigator.share(shareData);
            //     } catch (error) {
            //     console.log(error.message)
            //     }
            // }

        }else{
            window.open(
                linkQR,
                '_blank'
            );
        }
    }

    

    return (
        <main className="fixed h-full w-full bg-page-euro overflow-auto py-3 px-3" onContextMenu={(e)=> e.preventDefault()}>
            <div className='fixed w-[35px] mx-auto flex justify-center items-center pointer-events-none top-4 right-4 z-10'>
                <Image src='/euro/logo-18.png' width={96} height={96} alt='Zirolu' className='w-full' priority />
            </div>
            {/* DOWNLOAD & PRINT */}
            {imageResultAI && 
            <div className='relative w-full mt-0 mb-0 mx-auto flex justify-center items-center opacity-0 pointer-events-none'>
                <div className='absolute z-10 w-[100%]' id='capture'>
                    <div className={`relative w-[full] flex`}>
                        <Image src={imageResultAI}  width={544} height={892} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div>
                {/* <div className='absolute top-0 left-0  w-full' ref={(el) => (componentRef = el)}>
                    <div className={`relative w-[99%] flex`}>
                        <Image src={imageResultAI}  width={683} height={1024} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div> */}
            </div>
            }

            <div className={generateQR ? `opacity-0 pointer-events-none w-full` : 'w-full'}>
                {imageResultAI && 
                <div className='relative w-[65%] mx-auto flex justify-center items-center rounded-sm' id='capture' onClick={downloadImageAI}>
                    <div className='relative w-full'>
                        <Image src={imageResultAI}  width={544} height={892} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div>
                }
                {/* {loadingDownload && 
                    <div className='rrelative p-3 mt-5 border-2 border-[#b1454a] text-center bg-[#CF1F29] text-[#fff] text-base overflow-auto no-scrollbar w-[70%] mx-auto rounded-lg'>
                        <p>Please wait, loading...</p>
                    </div>
                } */}
                <div className="relative w-[90%] mx-auto mt-4 mb-2">
                    <Image src='/euro/info-giveaway.png' width={327} height={220} alt='Zirolu' className='w-full' priority />
                </div>
                <div className="relative w-[90%] mx-auto mt-7 mb-2">
                    <Image src='/euro/info-how.png' width={335} height={371} alt='Zirolu' className='w-full' priority />
                </div>
                <div className='relative w-full mt-2 mb-[6rem]'>
                    <Link href='generate' className="relative w-[70%] mx-auto flex justify-center items-center pt-2">
                        <Image src='/btn-retake2.png' width={867} height={163} alt='Zirolu' className='w-full' priority />
                    </Link>
                </div>
            </div>
            <div className={`fixed bottom-0 left-0 w-full bg-[#530910]`} onClick={sharePhoto}>
                <div className="relative w-[full] mx-auto flex justify-center items-center flex-col">
                    <button className={`w-full relative mx-auto flex justify-center items-center`}>
                        <Image src='/euro/btn-share2.png' width={359} height={88} alt='Zirolu' className='w-full' priority />
                    </button>
                </div>
            </div>
        </main>
    );
}
