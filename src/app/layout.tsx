import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EsGenesis.Career — AI Career Intelligence',
  description: 'Discover your future. Backed by intelligence. AI-powered career discovery using personality insights and strategic career mapping.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
