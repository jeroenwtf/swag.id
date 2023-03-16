import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { UserContextProvider } from '@/store/user-context'
import { ProfileContextProvider } from '@/store/profile-context'

import { api } from "../utils/api";

import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserContextProvider>
        <ProfileContextProvider>
          <div><Toaster /></div>
          <Component {...pageProps} />
        </ProfileContextProvider>
      </UserContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
