import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getInitialFEN } from './server/initialFEN';
import { ChessBoardProvider } from '../Context';
import Navbar from '@/Components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LJDR-Chess',
  description:
    'Interactive ChessGame with Next.js, TypeScript, and Tailwind CSS.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialFEN = await getInitialFEN();

  return (
    <ChessBoardProvider initialFEN={initialFEN}>
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
