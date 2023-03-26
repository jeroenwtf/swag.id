import Brail from "@brail/react";
import z from "zod";
import {
    Typography,
    Button,
} from "@brail/react";
import sendGrid from "@sendgrid/mail";
import { env } from "@/env/server.mjs";
import Layout from "./layout";
 
const b = Brail.init();
 
const ResetPasswordView = ({ urlHash }:any) => {
	return (
    <Layout>
      <Typography mb={12}>Hello there,</Typography>
      <Typography mb={12}>Looks like you want to reset your password. We got you.</Typography>

      <Button
        href={`${process.env.NEXT_PUBLIC_URL}/auth/reset-password/${urlHash}`}
        px={32}
        py={12}
        backgroundColor="#ec4899"
        color="#ffffff"
        borderRadius={8}
        fontWeight="bold"
        fontSize={14}
        mt={24}
      >Reset password</Button>

      <Typography mt={12}>This link will work for 24 hours.</Typography>
    </Layout>
  )
}

export default b.template
	.meta(z.object({ to: z.string() }))
  .props(z.object({ urlHash: z.string() }))
	.onSend(async (args) => {
		const { meta, html } = args;

    sendGrid.setApiKey(env.SENDGRID_API_KEY)
		const res = await sendGrid.send({
			to: meta.to,
      from: {
        email: 'hola@jeroen.wtf',
        name: 'SWAG.id',
      },
      subject: `Reset password`,
      html,
		}).then(data => data);
    return true
		// return { ok: res.status === 200 };
	})
	.view(ResetPasswordView);
