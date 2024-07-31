import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ChessBoardProvider } from '../Context';
import Navbar from '@/Components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LJDR-Chess',
  description:
    'Interactive ChessGame with Next.js, TypeScript, and Tailwind CSS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChessBoardProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/logo.svg" />
        </head>
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </html>
    </ChessBoardProvider>
  );
}
