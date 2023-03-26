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
 
const WelcomeEmailView = () => {
	return (
    <Layout>
      <Typography mb={12}>Hello there,</Typography>
      <Typography mb={12}>Your SWAG.id page is ready for you to be customised. You just need to sign in! As the main following steps, you could:</Typography>

      <ul>
        <li><Typography>Add your profile details, like your name and your bio.</Typography></li>
        <li><Typography>Make sure your avatar looks fancy.</Typography></li>
        <li><Typography>Start creating some sweet links and arrange them the way you feel like.</Typography></li>
      </ul>

      <Typography mt={12}>Do all that and you&apos;re golden!</Typography>

      <Button
        href="https://swag.id/auth/signin"
        px={32}
        py={12}
        backgroundColor="#ec4899"
        color="#ffffff"
        borderRadius={8}
        fontWeight="bold"
        fontSize={14}
        mt={24}
      >Go get started</Button>
    </Layout>
  )
}

export default b.template
	.meta(z.object({ to: z.string() }))
	.onSend(async (args) => {
		const { meta, html } = args;

    sendGrid.setApiKey(env.SENDGRID_API_KEY)
		const res = await sendGrid.send({
			to: meta.to,
      from: {
        email: 'hola@jeroen.wtf',
        name: 'SWAG.id',
      },
      subject: `⚡ Welcome to SWAG.id`,
      html,
		}).then(data => data);
    return true
		// return { ok: res.status === 200 };
	})
	.view(WelcomeEmailView);
