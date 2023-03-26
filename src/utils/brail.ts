import Brail from "@brail/react"
import z from "zod" /** 👈 May need to install this */
 
const b = Brail.init()
 
export const baseTemplate = b.template
	.meta(z.object({ to: z.string(), subject: z.string(), }))
	.onSend((args) => {
		// Add any sending logic here
		// args.meta == the meta object defined above
		// args.html == the rendered html
	})
