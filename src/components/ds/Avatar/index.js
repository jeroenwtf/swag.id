import Image from 'next/image'

export default function Avatar({ src, alt }) {
  return (
    <div className="rounded-full w-24 h-24 relative overflow-hidden">
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
    </div> 
  )
}
