import clsx from "clsx"
import Link from "next/link"

export default function UserLinks({ links }) {
  const linkClass = clsx('rounded-md px-4 py-4 text-center bg-gray-200')

  if (!links) { return <div>Loading links</div> }

  return (
    <div className="flex flex-col w-full max-w-md gap-3">{links.map(link => (
      <Link key={link.text} className={linkClass} href={link.href}>{link.text}</Link>
    ))}</div>
  )
}
