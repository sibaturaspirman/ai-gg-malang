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

let URL_RESULT = ''
let FACE_URL_RESULT = ''
export default function GenerateAmero() {
    const router = useRouter();

    const [imageFile, setImageFile] = useState(null);
    const [styleGender, setStyleGender] = useState(null);
    const [character, setCharacter] = useState(null);
    
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
    }, [imageFile])

    const generateAI = () => {
        setNumProses1(true)
        
        if(styleGender =='male'){
            setTimeout(() => {
                generateImageSwap(styleGender, getRandomInt(1, 2))
            }, 500);
        }else if(styleGender =='female'){
            setTimeout(() => {
                generateImageSwap(styleGender, getRandomInt(1, 2))
            }, 500);
        }else if(styleGender =='hijab'){
            setTimeout(() => {
                generateImageSwap(styleGender, getRandomInt(1, 2))
            }, 500);
        }

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
        const urlGambar = 'https://ai-gg-malang-git-master-asep-irmans-projects.vercel.app/style/ggik-'+gender+'-'+number+'.jpeg'
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
        .then(dataUrl => {
            // console.log('RESULT:', dataUrl)

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem("resulAIBase64", dataUrl)
                localStorage.setItem("faceURLResult", FACE_URL_RESULT)
                localStorage.setItem("styleGender", styleGender)
            }
        
            setTimeout(() => {
                router.push('/ggik/result');
            }, 500);
        })
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
            setElapsedTime(Date.now() - start);
        }
        // @snippet:end
    };

    return (
        <main className="flex fixed h-full w-full bg-page-ggik overflow-auto flex-col justify-center items-center py-5 px-5 lg:py-16 lg:px-20" onContextMenu={(e)=> e.preventDefault()}>
            <div className='fixed w-[25%] mx-auto flex justify-center items-center pointer-events-none top-0 left-0 right-0'>
                <Image src='/logo-ggik.png' width={350} height={333} alt='Zirolu' className='w-full' priority />
            </div>
            {numProses1 && 
                <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col'>
                    {/* <div className='relative w-[60%] overflow-hidden'>
                        <div className='relative w-full'>
                            <Image src='/title-front.png' width={773} height={158} alt='Zirolu' className='w-full' priority />
                        </div>
                    </div> */}
                    <div className='animate-upDownCepet relative p-3 py-5 w-[80%] text-base border-2 border-[#b1454a] text-center bg-[#EAC46D] text-[#760000] rounded-lg leading-tight'>
                        <p className='font-bold'>{`Please wait, loading...`}</p>
                        <p className='font-bold'>{`Process : ${(elapsedTime / 1000).toFixed(2)} seconds (${numProses} of 2)`}</p>
                        {error}
                        <p className='mt-4'>REMINDER <br></br> Mohon untuk TIDAK MENYEBARKAN dulu hasil foto ini ke publik/via social media sebelum GGIK launching</p>
                    </div>

                    <pre className='relative p-5 mt-14 border-2 border-[#b1454a] text-left bg-[#EAC46D] text-[#000000] text-3xl overflow-auto no-scrollbar h-[250px] w-[60%] mx-auto rounded-lg hidden'>
                        <code>
                        {logs.filter(Boolean).join('\n')}
                        </code>
                        AI generate face... <br></br>
                        Loading model..<br></br>
                    </pre>
                </div>
            }
            {/* LOADING */}
            {/* PILIH STYLE */}
            {/* <div className={`fixed top-[10rem] w-[50%] ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <Image src='/title-select.png' width={686} height={112} alt='Zirolu' className='w-full' priority />
            </div> */}
            <div className={`relative w-full mt-6 ${numProses1 ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className='relative mt-0 w-[80%] mx-auto'>
                    <div className='relative w-full hiddenx'>
                        <div className='relative w-[80%] mb-2 mx-auto'>
                            <Image src='/title-identity.png' width={542} height={119} alt='Zirolu' className='w-full' priority />
                        </div>
                        <div className='w-[80%] mx-auto'>
                            {/* GENDER FIX */}
                            <ul className='choose mod7'>
                                <li className='mb-2'>
                                    <input
                                    id='choose_gender1'
                                    type="radio"
                                    name='choose_gender'
                                    value="male"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender1">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/gender-male.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li className='mb-2'>
                                    <input
                                    id='choose_gender2'
                                    type="radio"
                                    name='choose_gender'
                                    value="female"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender2">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/gender-female.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                                <li>
                                    <input
                                    id='choose_gender3'
                                    type="radio"
                                    name='choose_gender'
                                    value="hijab"
                                    onChange={(e) => setStyleGender(e.target.value)}
                                    />
                                    <label htmlFor="choose_gender3">
                                        <Image
                                            className="relative h-auto w-full"
                                            src="/gender-hijab.png"
                                            alt="icon"
                                            width={541}
                                            height={178}
                                            priority
                                        />
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={`relative left-0 mt-4 w-full`}>
                    <div className="relative w-[80%] mx-auto flex justify-center items-center flex-col">
                        <button className={`w-full relative mx-auto flex justify-center items-center ${!styleGender ? 'hidden' : ''}`} onClick={generateAI}>
                            <Image src='/btn-generate-ggik.png' width={867} height={146} alt='Zirolu' className='w-full' priority />
                        </button>
                        <Link href='/ggik' className="relative w-full mx-auto flex justify-center items-center pt-4">
                            <Image src='/btn-back-ggik.png' width={867} height={146} alt='Zirolu' className='w-full' priority />
                        </Link>
                    </div>
                </div>
            </div>
            {/* !PILIH STYLE */}
        </main>
    );
}
