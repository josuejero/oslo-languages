// src/pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactEmail } from '../../utils/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
      await sendContactEmail({ name, email, message });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}
