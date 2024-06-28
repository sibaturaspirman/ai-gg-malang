import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <Link href='/ggfi/register' className="flex fixed w-full h-full bg flex-col items-center justify-center pt-12 p-0 lg:p-20">
      <div className='fixed w-full mx-auto flex justify-center items-center pointer-events-none top-0 left-0'>
        <Image src='/top-logo.png' width={1179} height={246} alt='Zirolu' className='w-full' priority />
      </div>
      <div className="relative w-full flex justify-center items-center flex-col bottom-[-5rem] lg:bottom-[-20rem]">
        <div className="relative w-full flex justify-center items-center mt-20 mb-5 lg:mb-20">
          <div className='animate-upDown relative w-full mx-auto flex justify-center items-center pointer-events-none'>
            <Image src='/logo.png' width={1174} height={253} alt='Zirolu' className='w-full' priority />
          </div>
        </div>
        <div className="relative w-[30%] flex justify-center items-center">
          <div className="relative mx-auto flex justify-center items-center">
            <Image src='/tap-to-start.png' width={249} height={50} alt='Zirolu' className='w-full' priority />
          </div>
        </div>
      </div>
    </Link>
  );
}
