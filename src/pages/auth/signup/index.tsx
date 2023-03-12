import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/validation/auth";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { api } from '@/utils/api';

const validationSchema = signupSchema

type ValidationSchema = z.infer<typeof validationSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const signupMutation = api.user.signUp.useMutation({
    onSettled: (data) => {
      setIsLoading(false)

      if (data?.status === 201) {
        reset()
        // TODO: Add a nice message
        alert(`Account created! Validate the email (${data?.result})`)
      }
    }
  })

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    console.log(data)
    setIsLoading(true)
    signupMutation.mutate(data)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
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
  )
}
