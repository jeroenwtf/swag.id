import Button from "@/components/ds/Button";
import Input from '@/components/ds/Input';
import Modal from "@/components/ds/Modal";

import { api } from '@/utils/api';
import { z } from 'zod';
import { rules } from '@/server/api/routers/link/validation';

import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";

const validationSchema = z.object({
  text: rules.text,
  href: rules.href,
})

type ValidationSchema = z.infer<typeof validationSchema>;

type Props = {
  text: string,
  href: string,
  linkId: string,
  links: {
    id: string,
    text: string,
    href: string,
    position: number,
    userId: string,
  }[],
  setLinks: any, // oh no
  modalIsShown: boolean,
  setModalIsShown: any, // oh no
}

export default function EditLinkModal({ text, href, linkId, links, setLinks, modalIsShown, setModalIsShown }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    setValue('text', text)
    setValue('href', href)
  }, [text, href])

  const updateLinkMutation = api.link.updateLink.useMutation({
    onMutate: () => {
      setIsLoading(true)
    },
    onError: () => {
      console.log('error')
    },
    onSuccess: (data) => {
      setLinks(links.map(link => {
        if (link.id === data.id) {
          return data
        } else {
          return link
        }
      }))
      setModalIsShown(false)
      toast.success('Link updated successfully')
    },
    onSettled: () => {
      setIsLoading(false)
    }
  })

  const onSubmit: SubmitHandler<ValidationSchema> = (data) => {
    updateLinkMutation.mutate({ ...data, id: linkId })
  }

  return (
    <Modal
      open={modalIsShown}
      title="Edit link"
      description="Use the following form to edit the selected link"
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
            <Button color="pink" type="submit" isLoading={isLoading}>Update link</Button>
          </div>
        </fieldset>
      </form>
    </Modal>
  )
}
