import clsx from "clsx";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faGoogle, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faSquareFull } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const PROVIDER_ICONS: {[key:string]: IconProp} = {
  email: faEnvelope,
  facebook: faFacebook,
  github: faGithub,
  google: faGoogle,
  instagram: faInstagram,
}

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const buttonClasses = clsx('border rounded-md bg-white px-5 py-3 text-gray-800 flex gap-3 items-center justify-start')
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-4">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button className={buttonClasses} onClick={() => signIn(provider.id)}>
              <FontAwesomeIcon icon={PROVIDER_ICONS[provider.id] || faSquareFull} />
              <span>Sign in with {provider.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  
  return {
    props: { providers: providers ?? [] },
  }
}
