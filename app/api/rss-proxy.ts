// pages/api/rss-proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://feed.pod.space/filipandfredrik');

    if (!response.ok) {
      throw new Error('Failed to fetch the RSS feed');
    }

    const textData = await response.text(); // Fetch the raw XML data
    res.setHeader('Content-Type', 'application/xml'); // Return the response as XML
    res.status(200).send(textData); // Send the RSS feed back to the client
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS feed' });
  }
}
