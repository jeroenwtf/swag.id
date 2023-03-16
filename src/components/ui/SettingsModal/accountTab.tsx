import Input from '@/components/ds/Input';
import Button from '@/components/ds/Button';

import { api } from '@/utils/api';
import { z } from 'zod';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from 'react';
import { useUserContext } from '@/store/user-context';
import { accountSettingsSchema } from '@/validation/auth';

import { useProfileContext } from '@/store/profile-context';
import { toast } from 'react-hot-toast';

const validationSchema = accountSettingsSchema

type ValidationSchema = z.infer<typeof validationSchema>;

export default function AccountTab() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: userData } = useUserContext()

  const updateAccountMutation = api.user.updateAccount.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
    onSuccess: (data) => {
      console.log('success', data)
      toast.success('Account info updated successfully')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    defaultValues: {
      email: userData.email,
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    await updateAccountMutation.mutateAsync(data)
  }

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset disabled={isLoading} className="flex flex-col gap-3">
          <Input
            label="E-mail"
            type="text"
            placeholder="Your email"
            errors={errors.email}
            {...register('email')}
          />

          <div className="mt-4">
            <p>If you want to change your password, type it twice. If you don&apos;t, leave it blank.</p>
          </div>
          <Input
            label="Password"
            placeholder="Your new password"
            type="password"
            errors={errors.password}
            {...register('password')}
          />
          <Input
            label="Repeat your password"
            placeholder="Yes, again"
            type="password"
            errors={errors.confirmPassword}
            {...register('confirmPassword')}
          />

          <div className="flex gap-2 mt-6">
            <Button color="pink" type="submit" isLoading={isLoading}>Save account settings</Button>
          </div>
        </fieldset>
      </form>

      <hr />
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Account providers</h3>
        <p>Coming soon.</p>
      </div>

      <hr />

      <div>
        <h3 className="text-lg font-semibold text-red-500 mb-2">Delete account</h3>
        <p>
          Type your password in order to delete your account. <strong>This action
          can&apos;t be undone</strong>. Let&apos;s not rush things, amigo.
        </p>
        <div className="flex gap-3 mt-4">
          <Input type="password" placeholder="Your password" />
          <Button color="red" size="small">Kill it with fire</Button> 
        </div>
      </div>
    </div>
  )
}
