import { NextApiRequest, NextApiResponse } from 'next';

const raffles = [
  {
    id: "e002a3da-9412-4d60-8059-b1316fdb0af4",
    creatorId: "29506660-83fd-4846-b4a4-a5f1ec59ad89",
    description: "Sorteo de automóvil deportivo",
    ticketPrice: 10.50,
    prizeValue: 25000.00,
    tickets: Array(100).fill(false),
    status: "active",
  },
  // Agrega más rifas según sea necesario
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    console.log('Received GET request for raffles');
    console.log('Query parameters:', req.query);
    if (req.query.id) {
      const raffle = raffles.find(r => r.id === req.query.id);
      if (raffle) {
        return res.status(200).json(raffle);
      }
      return res.status(404).json({ message: 'Raffle not found' });
    }
    return res.status(200).json(raffles.map(r => ({
      id: r.id,
      description: r.description,
      prizeValue: r.prizeValue,
      status: r.status,
    })));
  }
  res.status(405).json({ message: 'Method not allowed' });
}
