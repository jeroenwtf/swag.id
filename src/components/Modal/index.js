import { Dialog } from '@headlessui/react'
import clsx from 'clsx'

export default function Modal({ children, className = null, open = false, title = '', description = '', size = 'medium', withSidebar = false, onClose }) {
  const modalClasses = clsx(
    className,
    'w-full max-w-sm rounded-lg overflow-hidden bg-white',
    size === 'small' && 'max-w-md p-5',
    size === 'medium' && 'max-w-xl p-5',
    size === 'large' && 'max-w-3xl h-[80vh] max-h-[800px] relative',
    size === 'large' && !withSidebar && 'py-7 px-9', 
  )

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-3">
        <Dialog.Panel className={modalClasses}>
          {title && <Dialog.Title className="text-xl font-bold mb-2">{title}</Dialog.Title>}
          {description && <Dialog.Description className="text-gray-500 mb-4">{description}</Dialog.Description>}

          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
