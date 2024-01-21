// pages/api/trigger.js

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Perform the action you want to occur when the QR code is scanned.
    // This could be logging the event, starting a process, etc.

    // Send a response to the client
    res.status(200).json({ message: 'QR Code Scanned. Action triggered!' });
  } else {
    // Handle any other HTTP methods, or return a method not allowed error.
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
