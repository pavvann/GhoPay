// In your Next.js component
import Image from 'next/image';
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <ConnectKitButton />
      </div>
      <div className="absolute top-1 left-4">
        {/* Apply the font directly to GhoPay text */}
        <p style={{ fontFamily: "'Moirai One', sans-serif", fontSize: "3rem", fontWeight:"bolder" }}>GhoPay</p>
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