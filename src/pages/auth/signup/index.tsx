import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/validation/auth";
import { useState } from "react";
import Input from "@/components/ds/Input";
import Button from "@/components/ds/Button";
import { api } from '@/utils/api';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import Providers from '@/components/ui/Providers';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const validationSchema = signupSchema

type ValidationSchema = z.infer<typeof validationSchema>;

export default function SignupPage({ providers }: any) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const signupMutation = api.user.signUp.useMutation({
    onSettled: async (data) => {
      setIsLoading(false)

      if (data?.status === 201) {
        await signIn('credentials', {
          email: data.email,
          password: data.password,
          callbackUrl: '/',
        });
      }
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    console.log(data)
    setIsLoading(true)
    signupMutation.mutate(data)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Providers providers={providers} copy="Sign up with" />
        <hr />
        <div>
          <p className="mb-3">Or use your email and password to sign up.</p>
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
              <Input
                label="Username"
                hint="Will be your URL."
                type="text"
                placeholder="example"
                prefix="https://swag.id/"
                errors={errors.username}
                {...register('username')}
              />
              <Button color="pink" type="submit" isLoading={isLoading}>Create account</Button>
            </fieldset>
          </form>
        </div>
        <hr />
        <div>Already have an account? <Link className='text-pink-500 font-semibold' href="/auth/signin">Sign in!</Link></div>
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
