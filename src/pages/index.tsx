import { type NextPage } from "next";
import Head from "next/head";
import Input from "@/components/Input";
import { signIn, signOut, useSession } from "next-auth/react";
import { useUserContext } from '@/store/user-context';

import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/user/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from 'next/link';
import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import clsx from "clsx";

const validationSchema = z.object({
  username: rules.username,
})

type ValidationSchema = z.infer<typeof validationSchema>;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SWAG.id</title>
        <meta name="description" content="TODO: Set the description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center text-white bg-gradient-to-br from-purple-600 to-rose-800">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl sm:text-8xl font-extrabold tracking-tight text-white">SWAG<span className="text-purple-300">.id</span></h1>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const updateUsernameMutation = api.user.updateUsername.useMutation({
    onMutate: () => setIsLoading(true),
    onSettled: () => setIsLoading(false),
    onSuccess: (data) => router.push(`/${data.username}`),
  })
  const { data: sessionData } = useSession();
  const { data: userData, isLoading: userIsLoading } = useUserContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: { username: '' },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    updateUsernameMutation.mutateAsync(data)
  }

  if (userIsLoading) return <FontAwesomeIcon icon={faCircleNotch} className="animate-spin w-7 h-7 opacity-40" />

  const buttonClasses = clsx('rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20')

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData && <>
        <p className="text-center text-2xl text-white">
          Logged in as {userData.name || `@${userData.username}`}
        </p>
        {!userData.username && (
          <div className="bg-black/10 rounded-lg px-6 py-4">
            <h2 className="text-lg font-semibold">Wait, you need a username!</h2>
            <p className="mb-3">It will be used to create your URL. Don&apos;t worry, you can change it any time.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={isLoading} className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="example"
                  prefix="https://swag.id/"
                  errors={errors.username}
                  {...register('username')}
                />

                <Button color="darkPink" type="submit" isLoading={isLoading}>Save username</Button>
              </fieldset>
            </form>
          </div>
        )}
      </>}

      <div className="flex gap-4">
        {sessionData &&
          <>
            {userData.username && <Link className={buttonClasses} href={`/${userData.username}`}>Visit your profile</Link>}
            <button className={buttonClasses} onClick={() => signOut()}>Sign out</button>
          </>
        }

        {!sessionData &&
          <>
            <Link className={buttonClasses} href="/auth/signup">Create account</Link>
            <button className={buttonClasses} onClick={() => signIn()}>Sign in</button>
          </>
        }
      </div>
    </div>
  );
};
