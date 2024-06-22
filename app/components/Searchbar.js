'use client'
 
import { useSearchParams } from 'next/navigation'
import { setCookie, getCookie } from 'cookies-next';
 
export default function SearchBar() {
  const searchParams = useSearchParams()
  const lokasiParam = searchParams.get("lokasi");
  const qrParam = searchParams.get("qr");
 
  // This will not be logged on the server when using static rendering
  // console.log(lokasiParam)

  if(qrParam == null || lokasiParam == null){
    // setScanQR(false)
  }else{
    if(qrParam == 'yes'){
      // setScanQR(true)

      var date = new Date();
      date.setTime(date.getTime() + (14400 * 1000)); //3600 = 1 jam | set 14400 = 4 jam
      setCookie('lokasi_GGFIEURO', lokasiParam, { expires: date });
    }
  }
 
  // return <>Search: {lokasiParam}</>
}