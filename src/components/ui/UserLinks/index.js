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

export default function UserLinks({ links, setLinks, isOwner, modalIsShown, setModalIsShown }) {
  const [addLinkModalIsShown, setAddLinkModalIsShown] = useState(false)
  const [editLinkModalIsShown, setEditLinkModalIsShown] = useState(false)
  const [editLinkId, setEditLinkId] = useState()
  const [editLinkText, setEditLinkText] = useState()
  const [editLinkHref, setEditLinkHref] = useState()

  const removeLinkMutation = api.link.removeLink.useMutation({
    onError: () => {
      console.log('error')
    },
    onSuccess: (data) => {
      const linkId = data.id
      setLinks(links.filter((link) => link.id !== linkId))
    },
  })

  const addLinkButtonClass = clsx('flex gap-2 justify-center items-center cursor-pointer rounded-md text-gray-400 border-2 border-dotted border-gray-300 px-4 py-3')
  const linkClass = clsx('block rounded-md px-4 py-4 relative text-center bg-gray-200')
  const editButtonClasses = clsx('absolute left-3 top-3 bg-black/70 text-white cursor-pointer px-2.5 py-1.5 rounded text-sm opacity-60 hover:opacity-100 hidden group-hover:block')
  const deleteButtonClasses = clsx('absolute right-3 top-3 bg-black/70 text-white cursor-pointer px-2.5 py-1.5 rounded text-sm opacity-60 hover:opacity-100 hidden group-hover:block')

  if (!links) { return <div>Loading links</div> }

  function handleDeleteButtonClick(linkId, element) {
    setModalIsShown(true)

    deleteSubmittedHandle = () => {
      element.parentNode.classList.add('opacity-50')
      removeLinkMutation.mutate({ id: linkId })
      
      setModalIsShown(false)
    }
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
      {modalIsShown &&
        <Modal
          open={modalIsShown}
          title="Confirmation for deleting the link"
          description="Confirmation dialog when you want delete one of your amazing links..."
          onClose={() => setModalIsShown(false)}>
          {/* <p>Confirmation dialog when you want delete one of your amazing links...</p> */}
          <Button onClick={() => setModalIsShown(false)}>Cancel</Button>
          <Button color="pink" onClick={deleteSubmittedHandle}>Confirm</Button>
        </Modal>}
    <div className="flex flex-col w-full max-w-md gap-3">
      {isOwner &&
        <>
          <div className={addLinkButtonClass} onClick={() => setAddLinkModalIsShown(true)}>
            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
            <span>Add a new link</span>
          </div>
          <AddLinkModal links={links} setLinks={setLinks} modalIsShown={addLinkModalIsShown} setModalIsShown={setAddLinkModalIsShown}/>
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
          <Link className={linkClass} href={link.href}>
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
