import { GetServerSideProps } from "next"
import Input from '@/components/ds/Input';
import Button from '@/components/ds/Button';

import { api } from '@/utils/api';
import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from 'react';
import { resetPasswordSchema } from '@/validation/auth';

import { toast } from 'react-hot-toast';
import Link from "next/link";

const validationSchema = resetPasswordSchema
type ValidationSchema = z.infer<typeof validationSchema>

type Props = {
  urlHash: string;
}

export default function ResetPasswordPage({ urlHash }:Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [resetSuccessfully, setResetSuccessfully] = useState(false)
  const updatePasswordMutation = api.user.updatePassword.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
    onSuccess: (data) => {
      console.log('success', data)
      toast.success('Password saved successfully')
      setResetSuccessfully(true)
    },
    onError: (error) => {
      console.log(error)
      toast.error(error.message)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async ({ password }) => {
    await updatePasswordMutation.mutateAsync({
      password,
      resetPasswordToken: urlHash,
    })
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-xs">
        {resetSuccessfully ? (
          <div className="text-center">Go back to <Link href="/" className="text-pink-500 underline">the home page</Link>.</div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-lg font-semibold mb-4">Reset your password</h3>
            <fieldset disabled={isLoading} className="flex flex-col gap-3">
              <Input
                label="New password"
                type="password"
                placeholder="Your new password"
                errors={errors.password}
                {...register('password')}
              />
              <Input
                label="Repeat your new password"
                type="password"
                placeholder="Again, yes"
                errors={errors.confirmPassword}
                {...register('confirmPassword')}
              />

              <div className="flex gap-2 mt-6">
                <Button color="pink" type="submit" isLoading={isLoading}>Save new password</Button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      urlHash: query.urlHash,
    }
  }
}
