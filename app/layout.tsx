import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Birthday Message Board',
  description: 'Write messages for your colleagues on their birthdays',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
