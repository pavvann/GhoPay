import { ghoPayABI, ghoPayAddress } from "@/constants";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { from, to, amount, currency } = req.query;
    const _from = from.replace(/['"]+/g, '');
    const _to = to.replace(/['"]+/g, '');
    const _currency = currency.replace(/['"]+/g, '');



    if (_currency === 'GHO') {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider)
    console.log(wallet.address)
    const ghoPayContract = new ethers.Contract(ghoPayAddress, ghoPayABI, wallet)
    
    const payment = await ghoPayContract.sendGho(_from, _to, ethers.utils.parseEther(amount))
    await payment.wait()
    console.log(payment)
    res.status(200).json({ message: 'Payment successful' });

    }

    else {
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
      const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider)
      console.log(wallet.address)
      const ghoPayContract = new ethers.Contract(ghoPayAddress, ghoPayABI, wallet)
      const upiId = await ghoPayContract.getUpi(_to);
      const payment = await ghoPayContract.sendSelf(_from, ethers.utils.parseEther(amount))
      console.log(payment)
      res.status(200).json({ message: 'Payment successful to ' + upiId });

    }

    console.log('QR Code Scanned!')

    // Send a response to the client
  } else {
    // Handle any other HTTP methods, or return a method not allowed error.
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
