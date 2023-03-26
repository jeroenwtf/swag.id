import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faGoogle, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faSquareFull } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import clsx from 'clsx';
import { signIn } from 'next-auth/react';

const PROVIDER_ICONS: {[key:string]: IconProp} = {
  credentials: faEnvelope,
  facebook: faFacebook,
  github: faGithub,
  google: faGoogle,
  instagram: faInstagram,
}

export default function Providers({ providers, copy }: any) {
  const buttonClasses = clsx('border rounded-md bg-white w-full px-5 py-3 text-gray-800 flex gap-3 items-center justify-start')

  return (
    <div className="flex flex-col gap-3">
      {Object.values(providers).map((provider: any) => {
        if (provider.id === 'credentials') return null
        
        return (
          <div key={provider.id}>
            <button className={buttonClasses} onClick={() => signIn(provider.id, { callbackUrl: `${window.location.origin}/` })}>
              <FontAwesomeIcon className='shrink-0 w-5' icon={PROVIDER_ICONS[provider.id] || faSquareFull} />
              <span className="whitespace-nowrap">{copy} {provider.name}</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
