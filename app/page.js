import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <Link href='/cam' className="flex fixed w-full h-full bg-euro flex-col items-center justify-center">
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
        <div className="relative w-[40%] flex justify-center items-center ml-auto">
          <div className='animate-upDown relative w-full mx-auto flex justify-center items-center pointer-events-none'>
            <Image src='/euro/jersey.png' width={396} height={452} alt='Zirolu' className='w-full' priority />
          </div>
        </div>
        <div className="relative w-full mx-auto flex justify-center items-center">
          <Image src='/euro/btn-start.png' width={359} height={88} alt='Zirolu' className='w-full' priority />
        </div>
      </div>
    </Link>
  );
}
