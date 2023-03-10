import clsx from "clsx"
import Link from "next/link"

import AddLinkModal from '@/components/ui/AddLinkModal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"

export default function UserLinks({ links, setLinks }) {
  const showAddLinkButton = true
  const [addLinkModalIsShown, setAddLinkModalIsShown] = useState(false)

  const addLinkButtonClass = clsx('flex gap-2 justify-center items-center cursor-pointer rounded-md text-gray-400 border-2 border-dotted border-gray-300 px-4 py-3')
  const linkClass = clsx('rounded-md px-4 py-4 text-center bg-gray-200')

  if (!links) { return <div>Loading links</div> }

  return (
    <div className="flex flex-col w-full max-w-md gap-3">
      {showAddLinkButton &&
        <>
          <div className={addLinkButtonClass} onClick={() => setAddLinkModalIsShown(true)}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Add a new link</span>
          </div>
          <AddLinkModal links={links} setLinks={setLinks} modalIsShown={addLinkModalIsShown} setModalIsShown={setAddLinkModalIsShown}/>
        </>
      }

      {links.map(link => (
        <Link key={link.text} className={linkClass} href={link.href}>{link.text}</Link>
      ))}
    </div>
  )
}
