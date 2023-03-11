import Button from "@/components/Button";
import Input from '@/components/Input';
import Modal from "@/components/Modal";

import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/link/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from 'react';

const validationSchema = z.object({
  text: rules.text,
  href: rules.href,
})

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
  links: object[],
  setLinks: any, // oh no
  modalIsShown: boolean,
  setModalIsShown: any, // oh no
}

export default function AddLinkModal({ links, setLinks, modalIsShown, setModalIsShown }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValidationSchema>({
    defaultValues: {
      text: '',
      href: '',
    },
    resolver: zodResolver(validationSchema),
  });

  const addLinkMutation = api.link.addLink.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onError: () => {
      console.log('error')
    },
    onSuccess: (data) => {
      setLinks([data, ...links])
      setModalIsShown(false)
      reset()
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    const position = links.length + 1
    addLinkMutation.mutateAsync({ ...data, position })
  }

  return (
    <Modal
      open={modalIsShown}
      title="Add a link"
      description="Use the following form to add a new link in your page"
      onClose={() => setModalIsShown(false)}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset disabled={isLoading} className="flex flex-col gap-3">
          <Input
            label="Text"
            type="text"
            placeholder="Title of the link"
            errors={errors.text}
            {...register('text')}
          />
          <Input
            label="URL"
            hint="Where should the link point to?"
            type="text"
            placeholder="http://www.example.com/"
            errors={errors.href}
            {...register('href')}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setModalIsShown(false)}>Cancel</Button>
            <Button color="pink" type="submit" isLoading={isLoading}>Add link</Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  )
}
