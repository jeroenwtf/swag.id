import Input from '@/components/ds/Input';
import Button from '@/components/ds/Button';

import { api } from '@/utils/api';
import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from 'react';
import { forgotPasswordSchema } from '@/validation/auth';

import { toast } from 'react-hot-toast';
import Link from "next/link";

const validationSchema = forgotPasswordSchema
type ValidationSchema = z.infer<typeof validationSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sentSuccessfully, setSentSuccessfully] = useState(false)
  const resetPasswordEmailMutation = api.email.resetPassword.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
    onSuccess: () => {
      setSentSuccessfully(true)
      toast.success('Password reset requested successfully')
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = ({ email }) => {
    console.log('sent for ', email)
    resetPasswordEmailMutation.mutate({
      email,
    })
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col gap-6 w-full max-w-xs">
        {sentSuccessfully ? (
          <div className="text-center">Go back to <Link href="/" className="text-pink-500 underline">the home page</Link>.</div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-lg font-semibold mb-4">Forgot password?</h3>
            <fieldset disabled={isLoading} className="flex flex-col gap-3">
              <p>We will send an email to reset your password.</p>
              <Input
                label="Your email"
                type="text"
                placeholder="email@example.com"
                errors={errors.email}
                {...register('email')}
              />

              <div className="flex gap-2 mt-6">
                <Button color="pink" type="submit" isLoading={isLoading}>Reset your password</Button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  )
}
