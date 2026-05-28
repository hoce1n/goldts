import { type Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner';
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { QueryProvider } from './providers/queryProvider'
import AuthProvider from './providers/authProviders';

const doraan = localFont({
  src: [
    {
      path: "./fonts/DoranWeb/woff/Doran-Thin.woff",
      weight: "100",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff2/Doran-Thin.woff2",
      weight: "100",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff/Doran-Light.woff",
      weight: "300",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff2/Doran-Light.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff/Doran-Regular.woff",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff2/Doran-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff/Doran-Medium.woff",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff2/Doran-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff/Doran-Bold.woff",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff2/Doran-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff/Doran-ExtraBold.woff",
      weight: "800",
      style: "normal"
    },
    {
      path: "./fonts/DoranWeb/woff2/Doran-ExtraBold.woff2",
      weight: "800",
      style: "normal"
    },
  ],
  variable: '--font-doraan',
  display: 'swap'
})

const peydaa = localFont({
  src: [
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-Thin.woff",
      weight: "100",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-Thin.woff2",
      weight: "100",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/peydaWeb-extralight.woff",
      weight: "200",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/peydaWeb-extralight.woff2",
      weight: "200",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/peydaWeb-light.woff",
      weight: "300",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/peydaWeb-light.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-Regular.woff",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-Regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-Medium.woff",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-Medium.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-SemiBold.woff",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-SemiBold.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-Bold.woff",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-Bold.woff2",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-ExtraBold.woff",
      weight: "800",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-ExtraBold.woff2",
      weight: "800",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff/PeydaWeb-Black.woff",
      weight: "900",
      style: "normal"
    },
    {
      path: "./fonts/PeydaWeb/woff2/PeydaWeb-Black.woff2",
      weight: "900",
      style: "normal"
    },
  ],
  variable: '--font-peydaa',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    template: '%s - طلای محبی',
    default: 'طلای محبی ',
  },
  description:
    'بهترین مرجع برای خرید طلای آنلاین و فیزیکی',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir='rtl' className={clsx('bg-gray-50 antialiased', doraan.variable, peydaa.variable)}>
      <body>
        <AuthProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
        </AuthProvider>
        <Toaster 
          richColors 
          closeButton
          position="top-right"
          toastOptions={{
            className: 'font-peydaa'
          }}
        />
      </body>
    </html>
  )
}
