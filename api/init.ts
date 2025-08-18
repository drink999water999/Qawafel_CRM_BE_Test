import db from '../services/db.ts';
import { createTables, populateInitialData, snakeToCamelCase } from './db-utils.ts';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        await createTables();

        const result = await db.execO<{ 'COUNT(*)': number }>(`SELECT COUNT(*) FROM user_profile`);
        const rowCount = result[0]?.['COUNT(*)'] ?? 0;
        
        if (rowCount === 0) {
            console.log("Database is empty, populating with initial data...");
            await populateInitialData();
        }

        const [
            retailersRes,
            vendorsRes,
            ticketsRes,
            proposalsRes,
            leadsRes,
            dealsRes,
            activitiesRes,
            userProfileRes
        ] = await Promise.all([
            db.execO(`SELECT * FROM retailers ORDER BY id`),
            db.execO(`SELECT * FROM vendors ORDER BY id`),
            db.execO(`SELECT * FROM tickets ORDER BY created_at DESC`),
            db.execO(`SELECT * FROM proposals ORDER BY created_at DESC`),
            db.execO(`SELECT * FROM leads ORDER BY id DESC`),
            db.execO(`SELECT * FROM deals ORDER BY id DESC`),
            db.execO(`SELECT * FROM activities ORDER BY timestamp DESC`),
            db.execO(`SELECT * FROM user_profile WHERE id = 1`)
        ]);

        const data = {
            retailers: snakeToCamelCase(retailersRes),
            vendors: snakeToCamelCase(vendorsRes),
            tickets: snakeToCamelCase(ticketsRes),
            proposals: snakeToCamelCase(proposalsRes),
            leads: snakeToCamelCase(leadsRes),
            deals: snakeToCamelCase(dealsRes),
            activities: snakeToCamelCase(activitiesRes),
            userProfile: snakeToCamelCase(userProfileRes[0]) || null,
        };

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error during data initialization:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
