
import { sql } from '@vercel/postgres';
import { createTables, populateInitialData, snakeToCamelCase } from './db-utils.ts';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const parseNumeric = (val: any) => (val ? parseFloat(val) : 0);
const parseIntBigInt = (val: any) => (val ? parseInt(val, 10) : 0);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        await createTables();

        const { rowCount } = await sql`SELECT 1 FROM user_profile WHERE id = 1`;
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
            sql`SELECT * FROM retailers ORDER BY id`,
            sql`SELECT * FROM vendors ORDER BY id`,
            sql`SELECT * FROM tickets ORDER BY created_at DESC`,
            sql`SELECT * FROM proposals ORDER BY created_at DESC`,
            sql`SELECT * FROM leads ORDER BY id DESC`,
            sql`SELECT * FROM deals ORDER BY id DESC`,
            sql`SELECT * FROM activities ORDER BY timestamp DESC`,
            sql`SELECT * FROM user_profile WHERE id = 1`
        ]);

        const data = {
            retailers: snakeToCamelCase(retailersRes.rows),
            vendors: snakeToCamelCase(vendorsRes.rows),
            tickets: snakeToCamelCase(ticketsRes.rows),
            proposals: snakeToCamelCase(proposalsRes.rows).map((p: any) => ({ ...p, value: parseNumeric(p.value) })),
            leads: snakeToCamelCase(leadsRes.rows).map((l: any) => ({ ...l, value: parseNumeric(l.value) })),
            deals: snakeToCamelCase(dealsRes.rows).map((d: any) => ({ ...d, value: parseNumeric(d.value) })),
            activities: snakeToCamelCase(activitiesRes.rows).map((a: any) => ({ ...a, timestamp: parseIntBigInt(a.timestamp) })),
            userProfile: snakeToCamelCase(userProfileRes.rows[0]) || null,
        };

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error during data initialization:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}