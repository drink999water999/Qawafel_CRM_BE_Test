
import { sql } from '@vercel/postgres';
import { snakeToCamelCase } from './db-utils.ts';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const { rows } = await sql`SELECT * FROM leads WHERE form_token = ${token}`;

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        
        const lead = snakeToCamelCase(rows[0]);
        return res.status(200).json(lead);

    } catch (error) {
        console.error('Error fetching lead by token:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
