import clsx from "clsx";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faGoogle, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faSquareFull } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/auth";
import { Fragment, useState } from "react";
import Input from "@/components/ds/Input";
import Button from "@/components/ds/Button";
import Link from "next/link";

const validationSchema = loginSchema

type ValidationSchema = z.infer<typeof validationSchema>;

const PROVIDER_ICONS: {[key:string]: IconProp} = {
  credentials: faEnvelope,
  facebook: faFacebook,
  github: faGithub,
  google: faGoogle,
  instagram: faInstagram,
}

export default function SignInPage({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setIsLoading(true)

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: '/',
    });

    if (res?.error) {
      setIsLoading(false)
      // setError(res.error);
      console.log('error', res.error)
    } else {
      // setError(null);
    }
  }

  const buttonClasses = clsx('border rounded-md bg-white w-full px-5 py-3 text-gray-800 flex gap-3 items-center justify-start')

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-4">
        {Object.values(providers).map((provider) => (
          <Fragment key={provider.id}>
            {provider.id === 'credentials' && <hr className="my-4" />}
            <div>
              {provider.id === 'credentials' &&
                <div>
                  <p className="mb-3">Use your email and password to sign up.</p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset disabled={isLoading} className="flex flex-col gap-3">
                      <Input
                        label="E-mail"
                        type="text"
                        placeholder="your@email.com"
                        errors={errors.email}
                        {...register('email')}
                      />
                      <Input
                        label="Password"
                        type="password"
                        errors={errors.password}
                        {...register('password')}
                      />
                      <Button color="pink" type="submit" isLoading={isLoading}>Sign in with e-mail</Button>
                    </fieldset>
                  </form>
                </div>
              }
              {provider.id !== 'credentials' &&
                <button className={buttonClasses} onClick={() => signIn(provider.id)}>
                  <FontAwesomeIcon icon={PROVIDER_ICONS[provider.id] || faSquareFull} />
                  <span>Sign in with {provider.name}</span>
                </button>
              }
            </div>
          </Fragment>
        ))}
        <hr className="my-4" />
        <div>Don&apos;t have an account? <Link href="/auth/signup">Create one!</Link></div>
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
