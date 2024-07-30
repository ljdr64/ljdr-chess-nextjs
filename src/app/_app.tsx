import { AppProps } from 'next/app';
import { ChessBoardProvider } from '../Context';
import Navbar from '../Components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChessBoardProvider>
      <Navbar />
      <Component {...pageProps} />
    </ChessBoardProvider>
  );
}

export default MyApp;
