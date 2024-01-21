// In your Next.js component
import Image from 'next/image';
import { useAccount } from "wagmi";
import { useState } from 'react';
import { ethers } from 'ethers';
import { ConnectKitButton } from "connectkit";
import { QRCodeCanvas } from 'qrcode.react';

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('GHO');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false); // State for showing QR code
  const [qrData, setQrData] = useState('');


  const toggleCurrency = async () => {
    setCurrency(currency === 'GHO' ? 'INR' : 'GHO');
    console.log("curremcy changed")

  }
  const handleSubmit = async () => {
    setLoading(true);
    console.log(currency)
    const paymentURl = 'https://gho-pay.vercel.app/api/payments' + '?from=' + '0x21e98C4e14F49B225d3208e530ECdf387c5A8670' + '&to=' + address + '&amount=' + amount + '&currency=' + currency;
    console.log(paymentURl)
    setQrData(paymentURl);
    setShowQR(true); // Show QR code
  }
  const closeQR = () => {
    setShowQR(false); // Hide QR code when you need to
  };

  return (

    <div className="relative bg-[#85787A]">
      <div className="absolute top-1 left-4">
        <p style={{ fontFamily: "'Moirai One', sans-serif", fontSize: "3rem", fontWeight: "bolder", color: 'black' }}>GhoPay</p>
      </div>
      <div className="absolute top-4 right-4">
        <ConnectKitButton />
      </div>


      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">
        <div className="w-full max-w-md">
          <Image src="/gho.png" alt="Gho" width={1000} height={1000} />
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input w-full text-lg py-2 px-4 bg-white bg-opacity-90 rounded shadow text-black"
          />
        </div>
        <div className="flex items-center justify-center w-full max-w-md">
          <p className="text-lg text-white">$GHO</p>
          <input type="checkbox" className="toggle toggle-accent mx-2" onClick={toggleCurrency} />
          <p className="text-lg text-white">₹INR</p>
        </div>
        <div className="w-full max-w-md">
          <button onClick={handleSubmit} className="btn w-full text-lg py-2 px-4 bg-gradient-to-r from-[#3eadc0] to-[#a75ca4] hover:bg-[#a75ca4] rounded shadow text-white transition-colors duration-300">
            {loading ? <span className="loading loading-spinner"></span> : "Let's GhoPay"}
          </button>
          {showQR && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeCanvas value={qrData} size={256} />
                <br />
                <button onClick={closeQR} className="btn w-full text-lg py-2 px-4 bg-gradient-to-r from-[#3eadc0] to-[#a75ca4] hover:bg-[#a75ca4] rounded shadow text-white transition-colors duration-300">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>



    </div>
  );
}

async function signPermit() {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(provider)
  const signer = provider.getSigner();
  console.log(signer)
  console.log(await signer.getAddress())

  const ghoTokenAddress = '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60';
  const ghoTokenAbi = ghoABI;
  const ghoTokenContract = new ethers.Contract(ghoTokenAddress, ghoTokenAbi, signer);
  console.log(ghoTokenContract)

  // Permit parameters
  const owner = address;
  const spender = '0x21e98C4e14F49B225d3208e530ECdf387c5A8670';
  const value = ethers.utils.parseUnits('10', 18); // The amount of GHO tokens to permit
  const nonce = await ghoTokenContract.nonces(owner);
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  console.log("1")

  // DOMAIN_SEPARATOR can be a constant or fetched from the contract
  const DOMAIN_SEPARATOR = await ghoTokenContract.DOMAIN_SEPARATOR();
  console.log("2")
  console.log(await signer.getChainId())
  // EIP-712 Typed Data for signing
  const permitData = {
    types: {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Permit',
    domain: {
      name: 'GHO Token',
      version: '1',
      chainId: await signer.getChainId(),
      verifyingContract: ghoTokenAddress,
    },
    message: {
      owner,
      spender,
      value,
      nonce,
      deadline,
    },
  };
  console.log("3")

  // Sign the permit message
  const signature = await signer._signTypedData(
    permitData.domain,
    permitData.types,
    permitData.message
  );
  console.log("4")

  console.log(signature);

  // Split the signature into its components
  const { v, r, s } = ethers.utils.splitSignature(signature);
  // console.log("1235: " + v, r, s);
  console.log(owner, spender, Number(value), deadline, v, r, s)
  // Submit the permit transaction
  const tx = await ghoTokenContract.permit(
    owner,
    spender,
    value,
    deadline,
    v,
    r,
    s
  );

  // // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // // Check the transaction receipt for success
  console.log(receipt);
}



