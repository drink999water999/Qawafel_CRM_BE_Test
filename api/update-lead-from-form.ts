import db from '../services/db.ts';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    
    const { token, businessSize, numberOfBranches } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        await db.exec(
            `UPDATE leads SET business_size = ?, number_of_branches = ? WHERE form_token = ?`,
            [businessSize, numberOfBranches, token]
        );
        
        if (db.changes === 0) {
            return res.status(404).json({ error: 'Lead not found for the given token.' });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error updating lead from form:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
