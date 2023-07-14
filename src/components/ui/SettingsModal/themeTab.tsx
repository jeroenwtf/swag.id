import Input from '@/components/ds/Input';
import Button from '@/components/ds/Button';

import { api } from '@/utils/api';
import type { ITheme } from '@/validation/theme';
import { themeSchema } from '@/validation/theme';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRef, useState } from 'react';

import { toast } from 'react-hot-toast';
import { useProfileContext } from '@/store/profile-context';

export default function ThemeTab() {
  const [isLoading, setIsLoading] = useState(false)
  const { themeData, setThemeData } = useProfileContext()

  const updateThemeMutation = api.theme.updateTheme.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onSettled: () => {
      setIsLoading(false)
    },
    onSuccess: async (data) => {
      toast.success('Profile updated successfully')
      setThemeData(data)
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITheme>({
    defaultValues: {
      bodyTextColor: themeData?.bodyTextColor,
      bodyBackgroundColor: themeData?.bodyBackgroundColor,
      linkTextColor: themeData?.linkTextColor,
      linkBackgroundColor: themeData?.linkBackgroundColor,
    },
    resolver: zodResolver(themeSchema),
  });

  const onSubmit: SubmitHandler<ITheme> = async (data) => {
    await updateThemeMutation.mutateAsync(data)
  }

  /*

Body
- Background image and color
- Text color
- Hero image (next)
Links
- Shape
- Background color
- Text color
  */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isLoading} className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold mb-1">General</h3>

        <div>
          <h4 className="font-semibold">Body</h4>
          <p>Basically the info above your list of links. Your name, bio, etc.</p>
        </div>

        <Input
          label="Body text color"
          type="text"
          placeholder="#000000"
          errors={errors.bodyTextColor}
          {...register('bodyTextColor')}
        />

        <Input
          label="Body background color"
          type="text"
          placeholder="#000000"
          errors={errors.bodyBackgroundColor}
          {...register('bodyBackgroundColor')}
        />

        <div>
          <h4 className="font-semibold">Links</h4>
          <p>The look of your list of links.</p>
        </div>

        <Input
          label="Link text color"
          type="text"
          placeholder="#c0ffee"
          errors={errors.linkTextColor}
          {...register('linkTextColor')}
        />

        <Input
          label="Link background color"
          type="text"
          placeholder="#ffffff"
          errors={errors.linkBackgroundColor}
          {...register('linkBackgroundColor')}
        />

        <div className="flex gap-2 mt-6">
          <Button color="pink" type="submit" isLoading={isLoading}>Save your theme data</Button>
        </div>
      </fieldset>
    </form>
  )
}
