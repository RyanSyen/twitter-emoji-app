import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Twitter Emoji App NextJS Project with T3 Stack",
  description:
    "A step by step tutorial building a Twitter Emoji App using T3 stack by Theo",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(cookies().toString());
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <Toaster />
            {children}
            <Analytics />
            <SpeedInsights />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
