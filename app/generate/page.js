'use client';

import * as fal from '@fal-ai/serverless-client';
import ReactPlayer from 'react-player'
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from 'react';
// import { Poppins} from "next/font/google";
// const poppins = Poppins({ subsets: ["latin"], weight: ['400','700', '900'] });
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setTimeout } from 'timers';
// import io from 'socket.io-client';

// @snippet:start(client.config)
fal.config({
    // credentials: 'FAL_KEY_ID:FAL_KEY_SECRET',
    requestMiddleware: fal.withProxy({
      targetUrl: '/api/fal/proxy', // the built-int nextjs proxy
      // targetUrl: 'http://localhost:3333/api/fal/proxy', // or your own external proxy
    }),
});

// DATA BASE AI
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let videoLoadingSelesai = false, videoLoadingSelesai2 = false, generateLoadingSelesai = false, generateLoadingSelesai2 = false;
let URL_RESULT = ''
let FACE_URL_RESULT = ''
export default function GenerateAmero() {
    const router = useRouter();

    const [imageFile, setImageFile] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    const [character, setCharacter] = useState(null);
    const [playVideo, setPlayVideo] = useState(false);

    const [scanQR, setScanQR] = useState(true);
    // const [lokasi, setLokasi] = useState(getCookie('lokasi_GGFIEURO'));
    // if(lokasi != undefined){
    //     setScanQR(true)
    // }
    
    const [numProses, setNumProses] = useState(0);
    const [numProses1, setNumProses1] = useState(null);
    // Result state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [resultFaceSwap, setResultFaceSwap] = useState(null);
    const [logs, setLogs] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    // @snippet:end
    useEffect(() => {
        // Perform localStorage action
        if (typeof localStorage !== 'undefined') {
            const item = localStorage.getItem('faceImage')
            setImageFile(item)
        }

        if(getCookie('lokasi_GGFIEURO') != undefined){
            setScanQR(true)
        }else{
          setScanQR(false)
        }
    }, [imageFile, scanQR])

    const generateAI = () => {
        setNumProses1(true)
        // setPlayVideo(true)
        setTimeout(() => {
            generateImageSwap(styleGender, getRandomInt(1, 4))
        }, 100);

        gtag('event', 'Euro2024', {
            event_category: 'clickButton',
            event_label: 'SelectCountry - '+getCookie('lokasi_GGFIEURO')+' - '+styleGender,
            event_action: 'GenerateAI'
        })

        setTimeout(() => {
            gtag('event', 'Euro2024', {
                event_category: 'pageviewed',
                event_label: 'Loading Result - '+getCookie('lokasi_GGFIEURO'),
                event_action: 'PageOpened'
            })
        }, 20);

    }

    const image = useMemo(() => {
      if (!result) {
        return null;
      }
      if (result.image) {
        return result.image;
      }
      
    }, [result]);
    const imageFaceSwap = useMemo(() => {
      if (!resultFaceSwap) {
        return null;
      }
      if (resultFaceSwap.image) {
        return resultFaceSwap.image;
      }
      return null;
    }, [resultFaceSwap]);
    
    const reset = () => {
      setLoading(false);
      setError(null);
      setResult(null);
      setResultFaceSwap(null);
      setLogs([]);
      setElapsedTime(0);
    };
    const reset2 = () => {
      setLoading(false);
      setError(null);
      // setLogs([]);
      setElapsedTime(0);
    };

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))


    const generateImageSwap = async (gender, number) => {
        // MALAM
        const urlGambar = 'https://ai-gg-malang-git-master-asep-irmans-projects.vercel.app/euro/style/'+gender+'-'+number+'.jpg'

        console.log(urlGambar)
        setNumProses(2)
        reset2();
        // @snippet:start("client.queue.subscribe")
        setLoading(true);
        const start = Date.now();
        try {
        const result = await fal.subscribe(
            'fal-ai/face-swap',
            {
            input: {
                // base_image_url: URL_RESULT,
                // swap_image_url: '/amero/base/'+character
                base_image_url: urlGambar,
                swap_image_url: imageFile
            },
            pollInterval: 5000, // Default is 1000 (every 1s)
            logs: true,
            onQueueUpdate(update) {
                setElapsedTime(Date.now() - start);
                if (
                update.status === 'IN_PROGRESS' ||
                update.status === 'COMPLETED'
                ) {
                setLogs((update.logs || []).map((log) => log.message));
                }
            },
            }
        );
        setResultFaceSwap(result);
        FACE_URL_RESULT = result.image.url;

        // emitStrsing("sendImage", result.image.url);

        toDataURL(FACE_URL_RESULT)
        .then(async dataUrl => {
            // console.log('RESULT:', dataUrl)

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase64", dataUrl)
                localStorage.setItem("faceURLResult", FACE_URL_RESULT)
                localStorage.setItem("styleGender", styleGender)
            }
          
            // const options = {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         name:payload.name+' - '+styleGender,
            //         phone:payload.phone,
            //         type:'ggif',
            //         fromPhone:true,
            //         imgUrl:FACE_URL_RESULT
            //     }),
            //     headers: {
            //         'Authorization': '89d183b7-ce47-4ceb-8676-1c2378f5be19:wZgrzLLKXOIjgACeJWH34iwOGqVZQmVg',
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     }
            // };
            
            // await fetch('https://api.priapunyaselera.ai/v1/photoai/link', options)
            //     .then(response => response.json())
            //     .then(response => {
            //         // console.log(response)
            //         console.log(response.file)
            //         // setLinkQR(response.file)
            //         // setGenerateQR('true')
            //         // setLoadingDownload(null)
            //         setTimeout(() => {
            //             router.push('/result');
            //         }, 10);
            //     })
            //     .catch(err => {
            //         console.log(err)
            //     });
        
            // setTimeout(() => {
                // gtag('event', 'Euro2024', {
                //     event_category: 'pageviewed',
                //     event_label: 'Result - '+getCookie('lokasi_GGFIEURO'),
                //     event_action: 'PageOpened'
                // })
                // router.push('/result');
                nextResultLoading2()
            // }, 10);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };

    const nextResultLoading = () => {
        console.log("video Selessai")
        videoLoadingSelesai = true
        videoLoadingSelesai2 = true

        console.log(videoLoadingSelesai)
        console.log(videoLoadingSelesai2)
        console.log(generateLoadingSelesai)
        console.log(generateLoadingSelesai2)

        setTimeout(() => {
            if(videoLoadingSelesai && generateLoadingSelesai){
                gtag('event', 'Euro2024', {
                    event_category: 'pageviewed',
                    event_label: 'Result - '+getCookie('lokasi_GGFIEURO'),
                    event_action: 'PageOpened'
                })
                router.push('/result');
            }
        }, 100);
    }

    const nextResultLoading2 = () => {
        console.log("Generate Selessai")
        generateLoadingSelesai = true
        generateLoadingSelesai2 = true

        console.log(videoLoadingSelesai)
        console.log(videoLoadingSelesai2)
        console.log(generateLoadingSelesai)
        console.log(generateLoadingSelesai2)

        setTimeout(() => {
            if(videoLoadingSelesai2 && generateLoadingSelesai2){
                gtag('event', 'Euro2024', {
                    event_category: 'pageviewed',
                    event_label: 'Result - '+getCookie('lokasi_GGFIEURO'),
                    event_action: 'PageOpened'
                })
                router.push('/result');
            }
        }, 100);
    }

    return (
        <main className="flex fixed h-full w-full bg-page-euro overflow-auto flex-col py-3 px-3 lg:py-16 lg:px-20" onContextMenu={(e)=> e.preventDefault()}>
            <div className='fixed w-[35px] mx-auto flex justify-center items-center pointer-events-none top-4 right-4'>
                <Image src='/euro/logo-18.png' width={96} height={96} alt='Zirolu' className='w-full' priority />
            </div>
        <div className={`fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center z-50 ${scanQR ? 'hidden' : ''}`}>
          <div className='relative w-[80%] mx-auto flex justify-center items-center pointer-events-none'>
            <Image src='/euro/scan3.png' width={327} height={113} alt='Zirolu' className='w-full' priority />
          </div>
        </div>
            {numProses1 && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col'>
                    {/* <div className='relative w-[60%] overflow-hidden'>
                        <div className='relative w-full'>
                            <Image src='/title-front.png' width={773} height={158} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div> */}
                    <div className='animate-upDownCepet absolute px-4 py-2 w-[80%] text-base border-2 border-[#b1454a] text-center bg-loading text-[#fff] rounded-lg leading-tight z-10 w-auto bottom-2'>
                        <p>{`Please wait`}</p>
                        <p>{`AI process : ${(elapsedTime / 1000).toFixed(2)} seconds (${numProses} of 2)`}</p>
                        {error}
                    </div>

                    {/* <pre className='relative p-5 mt-14 border-2 border-[#b1454a] text-left bg-[#EAC46D] text-[#000000] text-3xl overflow-auto no-scrollbar h-[250px] w-[60%] mx-auto rounded-lg hidden'>
                        <code>
                        {logs.filter(Boolean).join('\n')}
                        </code>
                        AI generate face... <br></br>
                        Loading model..<br></br>
                    </pre> */}
                    <div className='w-full flex items-center justify-center'>
                        <ReactPlayer config={{ file: { attributes: { playsInline: true, }, }, }} url={['/euro/mission1-2.mp4']} light={<img src='https://priapunyaselera.ai/euro/thumb3.jpg' alt='Thumbnail' />} playing className='videoLoading' width={405} height={720} onEnded={nextResultLoading}/>
                        {/* <ReactPlayer config={{ file: { attributes: { playsInline: true, }, }, }} url='https://www.youtube.com/watch?v=Yu3Flnvrin8' playing className='videoLoading' width={405} height={720} onEnded={nextResultLoading}/> */}

                        
                    </div>
                </div>
            }
            {/* LOADING */}
            {/* PILIH STYLE */}
            {/* <div className={`fixed top-[10rem] w-[50%] ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <Image src='/title-select.png' width={686} height={112} alt='Zirolu' className='w-full' priority />
            </div> */}
            <div className={`relative w-full mt-0 ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className='relative mt-0 mb-[5rem] w-full mx-auto'>
                    <div className='relative w-full hiddenx'>
                        <div className='relative w-[50%] mb-[-10px] mx-auto'>
                            <Image src='/euro/title-select.png' width={380} height={76} alt='Zirolu' className='w-full' priority />
                        </div>
                        <div className='w-[90%] mx-auto'>
                            {/* GENDER FIX */}
                            <ul className='choose mod8'>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender1'
                                    type="radio"
                                    name='choose_gender'
                                    value="albania"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender1">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-albania.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender2'
                                    type="radio"
                                    name='choose_gender'
                                    value="austria"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender2">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-austria.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender3'
                                    type="radio"
                                    name='choose_gender'
                                    value="belgium"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender3">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-belgium.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender4'
                                    type="radio"
                                    name='choose_gender'
                                    value="croatia"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender4">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-croatia.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                {/* <li className='mb-0'>
                                    <input
                                    id='choose_gender5'
                                    type="radio"
                                    name='choose_gender'
                                    value="ceko"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender5">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-ceko.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li> */}
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender6'
                                    type="radio"
                                    name='choose_gender'
                                    value="denmark"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender6">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-denmark.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender7'
                                    type="radio"
                                    name='choose_gender'
                                    value="england"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender7">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-england.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender8'
                                    type="radio"
                                    name='choose_gender'
                                    value="france"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender8">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-france.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                {/* <li className='mb-0'>
                                    <input
                                    id='choose_gender9'
                                    type="radio"
                                    name='choose_gender'
                                    value="georgia"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender9">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-georgia.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li> */}
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender10'
                                    type="radio"
                                    name='choose_gender'
                                    value="germany"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender10">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-germany.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender11'
                                    type="radio"
                                    name='choose_gender'
                                    value="hungary"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender11">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-hungary.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender12'
                                    type="radio"
                                    name='choose_gender'
                                    value="italy"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender12">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-italy.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender13'
                                    type="radio"
                                    name='choose_gender'
                                    value="dutch"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender13">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-netherlands.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender14'
                                    type="radio"
                                    name='choose_gender'
                                    value="poland"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender14">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-poland.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender15'
                                    type="radio"
                                    name='choose_gender'
                                    value="portugal"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender15">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-portugal.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender16'
                                    type="radio"
                                    name='choose_gender'
                                    value="romania"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender16">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-romania.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender17'
                                    type="radio"
                                    name='choose_gender'
                                    value="scotland"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender17">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-scotland.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender18'
                                    type="radio"
                                    name='choose_gender'
                                    value="serbia"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender18">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-serbia.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender19'
                                    type="radio"
                                    name='choose_gender'
                                    value="slovakia"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender19">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-slovakia.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender20'
                                    type="radio"
                                    name='choose_gender'
                                    value="slovenia"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender20">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-slovenia.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender21'
                                    type="radio"
                                    name='choose_gender'
                                    value="spain"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender21">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-spain2.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender22'
                                    type="radio"
                                    name='choose_gender'
                                    value="switz"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender22">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-switz.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                                {/* <li className='mb-0'>
                                    <input
                                    id='choose_gender23'
                                    type="radio"
                                    name='choose_gender'
                                    value="turkiye"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender23">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-turkiye.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li> */}
                                <li className='mb-0'>
                                    <input
                                    id='choose_gender24'
                                    type="radio"
                                    name='choose_gender'
                                    value="ukraine"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender24">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/euro/n-ukraine.png"
                                            alt="icon"
                                            width={136}
                                            height={114}
                                            priority
                                        />
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`fixed bottom-0 left-0 mt-6 w-full bg-[#530910] ${!styleGender ? 'hidden' : ''}`} onClick={generateAI}>
                    <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                        <button className={`w-full relative mx-auto flex justify-center items-center`}>
                            <Image src='/euro/btn-generate.png' width={359} height={88} alt='Zirolu' className='w-full' priority />
                        </button>
                        {/* <Link href='/' className="relative w-full mx-auto flex justify-center items-center">
                            <Image src='/btn-back.png' width={772} height={135} alt='Zirolu' className='w-full' priority />
                        </Link> */}
                    </div>
                </div>
            </div>
            {/* !PILIH STYLE */}
        </main>
    );
}
