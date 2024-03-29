import clsx from "clsx"
import Link from "next/link"

import AddLinkModal from '@/components/ui/AddLinkModal'
import EditLinkModal from '@/components/ui/EditLinkModal'
import Modal from '@/components/ds/Modal'
import Button from '@/components/ds/Button'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import { api } from "@/utils/api"
import { toast } from "react-hot-toast"
import { supportsTouchEvents } from "detect-it"
import { useProfileContext } from "@/store/profile-context"

export default function UserLinks({ links, setLinks, isOwner }) {
  const { themeData } = useProfileContext()
  const [addLinkModalIsShown, setAddLinkModalIsShown] = useState(false)
  const [editLinkModalIsShown, setEditLinkModalIsShown] = useState(false)
  const [editLinkId, setEditLinkId] = useState()
  const [editLinkElement, setEditLinkElement] = useState()
  const [editLinkText, setEditLinkText] = useState()
  const [editLinkHref, setEditLinkHref] = useState()
  const [deleteConfirmModalIsShown, setDeleteConfirmModalIsShown] = useState(false)

  const removeLinkMutation = api.link.removeLink.useMutation({
    onError: () => {
      console.log('error')
    },
    onSuccess: (data) => {
      const linkId = data.id
      setLinks(links.filter((link) => link.id !== linkId))
      setDeleteConfirmModalIsShown(false)
      toast.success('Link deleted successfully')
    },
  })

  const addLinkButtonClass = clsx('flex gap-2 justify-center items-center cursor-pointer rounded-md text-gray-700 border-2 border-dotted border-gray-700 opacity-40 px-4 py-3')
  const linkClass = clsx('block rounded-md px-4 py-4 relative text-center bg-gray-200')
  const linkButtonClasses = 'absolute top-3 bg-black/70 text-white cursor-pointer px-2.5 py-1.5 rounded text-sm'
  const noHoverButtonClasses = !supportsTouchEvents && 'opacity-60 hover:opacity-100 hidden group-hover:block'
  const editButtonClasses = clsx('left-3', linkButtonClasses, noHoverButtonClasses)
  const deleteButtonClasses = clsx('right-3', linkButtonClasses, noHoverButtonClasses)

  if (!links) { return <div>Loading links</div> }

  function handleDeleteButtonClick(linkId, element) {
    setEditLinkElement(element)
    setEditLinkId(linkId)
    setDeleteConfirmModalIsShown(true)
  }

  function handleDeleteConfirmationButtonClick() {
    editLinkElement.parentNode.classList.add('opacity-50')
    removeLinkMutation.mutate({ id: editLinkId })
  }

  function handleEditButtonClick(linkId) {
    const editLink = links.find(link => link.id === linkId)
    setEditLinkText(editLink.text)
    setEditLinkHref(editLink.href)
    setEditLinkId(linkId)
    setEditLinkModalIsShown(true)
  }

  return (
    <>
      <Modal
        open={deleteConfirmModalIsShown}
        title="Are you sure you want to delete the link?"
        description="This action can&apos;t be undone."
        onClose={() => setDeleteConfirmModalIsShown(false)}
        size="small"
      >
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={() => setDeleteConfirmModalIsShown(false)}>Cancel</Button>
          <Button color="pink" onClick={handleDeleteConfirmationButtonClick}>Delete link</Button>
        </div>
      </Modal>
      <div className="flex flex-col w-full max-w-md gap-3">
        {isOwner &&
          <>
            <div
              className={addLinkButtonClass}
              onClick={() => setAddLinkModalIsShown(true)}
              style={{
                color: themeData?.bodyTextColor,
                borderColor: themeData?.bodyTextColor,
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
              <span>Add a new link</span>
            </div>
            <AddLinkModal links={links} setLinks={setLinks} modalIsShown={addLinkModalIsShown} setModalIsShown={setAddLinkModalIsShown} />
          </>
        }

        {isOwner &&
          <EditLinkModal
            text={editLinkText}
            href={editLinkHref}
            linkId={editLinkId}
            links={links}
            setLinks={setLinks}
            modalIsShown={editLinkModalIsShown}
            setModalIsShown={setEditLinkModalIsShown}
          />
        }
        {links.map(link => (
          <div key={link.id} className="relative group transition-opacity">
            <Link
              className={linkClass}
              href={link.href}
              style={{
                color: themeData?.linkTextColor || '#000000',
                backgroundColor: themeData?.linkBackgroundColor || '#dcdcdc',
              }}
            >
              {link.text}
            </Link>
            {isOwner && <div className={editButtonClasses} onClick={(event) => handleEditButtonClick(link.id, event.currentTarget)}><FontAwesomeIcon icon={faPencil} /></div>}
            {isOwner && <div className={deleteButtonClasses} onClick={(event) => handleDeleteButtonClick(link.id, event.currentTarget)}><FontAwesomeIcon icon={faTrashAlt} /></div>}
          </div>
        ))}
      </div>
    </>
  )
}
