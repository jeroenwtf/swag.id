import { useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import clsx from 'clsx'

export default function Modal({ children, title, description, size = 'medium', actions = [], isOpen = false }) {
  let [modalIsOpen, setModalIsOpen] = useState(isOpen)

  useEffect(() => {
    setModalIsOpen(isOpen)
    console.log('modal', isOpen)
  }, [isOpen])

  const modalClasses = clsx(
    'w-full max-w-sm rounded bg-white p-5',
    size === 'small' && 'max-w-md',
    size === 'medium' && 'max-w-xl',
    size === 'large' && 'max-w-2xl',
  )

  return (
    <Dialog open={modalIsOpen} onClose={() => setModalIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-3">
        <Dialog.Panel className={modalClasses}>
          <Dialog.Title className="text-xl font-bold mb-2">{title}</Dialog.Title>
          <Dialog.Description className="text-gray-500 mb-4">{description}</Dialog.Description>

          <div>{children}</div>

          {actions &&
            <div className="flex justify-end gap-4 mt-6">
              {actions.map(action => action)}
            </div>
          }
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
