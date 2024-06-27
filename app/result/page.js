'use client';

import Link from 'next/link';
import Image from "next/image";
import { getCookie } from 'cookies-next';
import React,{ useEffect, useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
// import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { Poppins} from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
// import BtnHexagon2 from "../components/BtnHexagon2";
// import ReactToPrint from "react-to-print";

export default function Result() {
    const router = useRouter();
    const [imageResultAI, setImageResultAI] = useState(null);
    const [generateQR, setGenerateQR] = useState(null);
    const [linkQR, setLinkQR] = useState('https://zirolu.id/');
    const [loadingDownload, setLoadingDownload] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    const [isNativeShare, setNativeShare] = useState(false);
    let componentRef = useRef();

    const [scanQR, setScanQR] = useState(true);
    const [trouble, setTrouble] = useState(true);

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

        if(getCookie('lokasi_GGFIEURO') != undefined){
            setScanQR(true)

            if(getCookie('lokasi_GGFIEURO') == 'ig'){
                setTrouble(false)
            }else{
                setTrouble(true)
            }
        }else{
        setScanQR(false)
        }
    }, [imageResultAI, styleGender, linkQR, scanQR, trouble])

    const sharePhoto = async () => {
        gtag('event', 'Euro2024', {
            event_category: 'pageviewed',
            event_label: 'Result - '+getCookie('lokasi_GGFIEURO')+' - '+styleGender,
            event_action: 'SharePhoto'
        })

        if(isNativeShare){
            // NEW WAY v2
            const blob = await fetch(linkQR).then(r=>r.blob())
            const data = {
                files: [
                  new File([blob], 'Pria Punya Selera.png', {
                    type: blob.type,
                  }),
                ]
              };
            //   console.log(data)
              try {
                if (!(navigator.canShare(data))) {
                  throw new Error('Can\'t share data.', data);
                };
                await navigator.share(data);
              } catch (err) {
                // console.error(err.name, err.message);
              }
            // NEW WAY
            // import('html2canvas').then(html2canvas => {
            //     html2canvas.default(document.querySelector("#capture"), {scale:4}).then(async canvas => {
            //         const dataUrl = canvas.toDataURL();
            //         const blob = await (await fetch(dataUrl)).blob();
            //         console.log(blob)
            //         const filesArray = [
            //             new File(
            //                 [blob],
            //                 "Pria Punya Selera.png",
            //                 {
            //                     type: blob.type,
            //                     lastModified: new Date().getTime()
            //                 }
            //             )
            //         ];
            //         const shareData = {
            //             files: filesArray,
            //         };
            //         if (navigator.canShare(shareData)) {
            //             await navigator.share(shareData);
            //             try {
            //             await navigator.share(shareData);
            //             } catch (error) {
            //             console.log(error.message)
            //             }
            //         }
            //     })
            // }).catch(e => {console("load failed")})

        }else{
            window.open(
                linkQR,
                '_blank'
            );
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText('https://priapunyaselera.ai/?lokasi=ig&qr=yes');
        alert("Copied the link!");
    }

    

    return (
        <main className="fixed h-full w-full bg-page-euro overflow-auto py-3 px-3" onContextMenu={(e)=> e.preventDefault()}>
            <div className='fixed w-[35px] mx-auto flex justify-center items-center pointer-events-none top-4 right-4 z-10'>
                <Image src='/euro/logo-18.png' width={96} height={96} alt='Zirolu' className='w-full' priority />
            </div>
        <div className={`fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-50 ${scanQR ? 'hidden' : ''}`}>
          <div className='relative w-[80%] mx-auto flex justify-center items-center pointer-events-none'>
            <Image src='/euro/scan3.png' width={327} height={113} alt='Zirolu' className='w-full' priority />
          </div>
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
                <div className='relative w-[65%] mx-auto flex justify-center items-center rounded-sm flex-col' id='capture'>
                    <div className='relative w-full'>
                        <Image src={imageResultAI}  width={544} height={892} alt='Zirolu' className='relative block w-full'></Image>
                    </div>
                </div>
                }
                <p className={`block text-center text-sm mt-1 mb-3 text-white ${trouble ? 'hidden' : ''}`}>*<i>Hold</i> pada gambar untuk <i>save</i> hasil AI</p> 

                <p className={`relative block text-center text-sm mb-3 text-white z-10 ${trouble ? 'hidden' : ''}`}>Ada kendala ketika <i>Share Photo / Save?</i> <br></br> Buka link di browser smartphone kamu</p>
                <div className={`relative bottom-0 left-0 w-full flex items-end justify-center content-end z-10 ${trouble ? 'hidden' : ''}`} onClick={copyLink}>
                    <div className='relative w-[85%] mx-auto mb-1 flex justify-center items-center pointer-events-none'>
                    <Image src='/euro/trouble.png' width={654} height={131} alt='Zirolu' className='w-full' priority />
                    </div>
                </div>
                {/* {loadingDownload && 
                    <div className='rrelative p-3 mt-5 border-2 border-[#b1454a] text-center bg-[#CF1F29] text-[#fff] text-base overflow-auto no-scrollbar w-[70%] mx-auto rounded-lg'>
                        <p>Please wait, loading...</p>
                    </div>
                } */}
                <div className={`relative w-[90%] mx-auto mt-4 mb-2`}>
                    <Image src='/euro/info-giveaway.png' width={327} height={220} alt='Zirolu' className='w-full' priority />
                </div>
                {/* <div className={`relative w-[90%] mx-auto mt-4 mb-2 ${trouble ? '' : 'hidden'}`}>
                    <Image src='/euro/info-giveaway.png' width={327} height={220} alt='Zirolu' className='w-full' priority />
                </div>
                <div className={`relative w-[90%] mx-auto mt-4 mb-2 ${trouble ? 'hidden' : ''}`} onClick={copyLink}>
                    <Image src='/euro/info-giveaway2.png' width={327} height={220} alt='Zirolu' className='w-full' priority />
                </div> */}
                <div className="relative w-[90%] mx-auto mt-7 mb-2">
                    <Image src='/euro/info-how.png' width={335} height={371} alt='Zirolu' className='w-full' priority />
                </div>
                <div className={`relative w-full mt-2  ${trouble ? ' mb-[9rem]' : ' mb-[9rem]'}`}>
                    <Link href='/' className="relative w-[90%] mx-auto flex justify-center items-center pt-2">
                        <Image src='/btn-retake3.png' width={433} height={81} alt='Zirolu' className='w-full' priority />
                    </Link>
                </div>
            </div>
            <div className={`fixed bottom-0 left-0 w-full bg-[#530910] z-10`}>
                <div className="relative w-[full] mx-auto flex justify-center items-center flex-col">
                    <button className={`w-full relative mx-auto flex justify-center items-center p-4 px-6`} onClick={sharePhoto}>
                        <Image src='/euro/btn-share3.png' width={654} height={88} alt='Zirolu' className='w-full' priority />
                    </button>
                    <Link href={linkQR} target="_blank" className={`w-full relative mx-auto flex justify-center items-center p-4 pt-0 px-6`}>
                        <Image src='/euro/btn-download.png' width={654} height={88} alt='Zirolu' className='w-full' priority />
                    </Link>
                </div>
                {/* <p className={`relative block text-center text-xs mt-[-.5rem] mb-3 text-white z-10 ${trouble ? 'hiddenx' : ''}`}>Ada kendala ketika <i>Share Photo?</i> <br></br> <i>Hold</i> pada gambar untuk <i>save</i> hasil AI</p>  */}
            </div>
        </main>
    );
}
