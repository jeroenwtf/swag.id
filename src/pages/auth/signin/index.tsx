import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, getSession, signIn } from "next-auth/react"

import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/auth";
import { useState } from "react";
import Input from "@/components/ds/Input";
import Button from "@/components/ds/Button";
import Link from "next/link";
import Providers from "@/components/ui/Providers";

const validationSchema = loginSchema

type ValidationSchema = z.infer<typeof validationSchema>;

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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Providers providers={providers} copy="Sign in with" />
        <hr />
        {Object.values(providers).map((provider) => {
          if (provider.id !== 'credentials') return null

          return (
            <div key={provider.id}>
              <p className="mb-3">Or use your email and password to sign in.</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={isLoading} className="flex flex-col gap-3">
                  <Input
                    label="E-mail"
                    type="text"
                    placeholder="your@email.com"
                    errors={errors.email}
                    {...register('email')}
                  />
                  <div>
                    <Input
                      label="Password"
                      type="password"
                      errors={errors.password}
                      {...register('password')}
                    />
                    <div className="text-right"><Link className="text-pink-500 text-sm underline" href="/auth/forgot-password">Forgot your password?</Link></div>
                  </div>
                  <Button color="pink" type="submit" isLoading={isLoading}>Sign in with e-mail</Button>
                </fieldset>
              </form>
            </div>
          )
        })}
        <hr />
        <div>Don&apos;t have an account? <Link className="text-pink-500 font-semibold" href="/auth/signup">Create one!</Link></div>
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
