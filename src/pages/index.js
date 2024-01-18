import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div className="relative">
      <div className="absolute top-4 right-4"> 
        <ConnectKitButton />
      </div>
      <div>
      </div>
    </div>
  );
}
