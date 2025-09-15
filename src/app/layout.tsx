

import type { Metadata, Viewport } from "next";
import { PT_Sans } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { SearchProvider } from "@/context/SearchContext";
import { ClientLayout } from "@/components/client-layout";


const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const ptSansHeadline = PT_Sans({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-headline',
});

export const metadata: Metadata = {
    title: "Kuwait Gorkhali Samaj",
    description: "Community App",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="icon" href="https://firebasestudio.app/Studio-Assistant/API-Playground/g-41c37b83-a417-4a46-bb18-87cfc9388e62/crops/2_300x300.png" type="image/png" />
        <link rel="apple-touch-icon" href="https://firebasestudio.app/Studio-Assistant/API-Playground/g-41c37b83-a417-4a46-bb18-87cfc9388e62/crops/2_300x300.png" />
      </head>
      <body className={`${ptSans.variable} ${ptSansHeadline.variable} font-body antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <ProfileProvider>
            <SearchProvider>
                <ClientLayout>
                  {children}
                </ClientLayout>
            </SearchProvider>
          </ProfileProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
