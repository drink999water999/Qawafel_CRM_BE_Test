
import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { action, payload } = req.body;

    try {
        switch (action) {
            // Retailer
            case 'ADD_RETAILER':
                await sql`INSERT INTO retailers (name, email, phone, account_status, marketplace_status, join_date, company) VALUES (${payload.name}, ${payload.email}, ${payload.phone}, ${payload.accountStatus}, ${payload.marketplaceStatus}, ${payload.joinDate}, ${payload.company})`;
                break;
            case 'UPDATE_RETAILER':
                await sql`UPDATE retailers SET name = ${payload.name}, email = ${payload.email}, phone = ${payload.phone}, account_status = ${payload.accountStatus}, marketplace_status = ${payload.marketplaceStatus}, company = ${payload.company} WHERE id = ${payload.id}`;
                break;

            // Vendor
            case 'ADD_VENDOR':
                 await sql`INSERT INTO vendors (name, email, phone, account_status, marketplace_status, join_date, business_name, category) VALUES (${payload.name}, ${payload.email}, ${payload.phone}, ${payload.accountStatus}, ${payload.marketplaceStatus}, ${payload.joinDate}, ${payload.businessName}, ${payload.category})`;
                break;
            case 'UPDATE_VENDOR':
                 await sql`UPDATE vendors SET name = ${payload.name}, email = ${payload.email}, phone = ${payload.phone}, account_status = ${payload.accountStatus}, marketplace_status = ${payload.marketplaceStatus}, business_name = ${payload.businessName}, category = ${payload.category} WHERE id = ${payload.id}`;
                break;

            // Lead
            case 'ADD_LEAD':
                await sql`INSERT INTO leads (company, contact_name, email, phone, status, source, value, form_token) VALUES (${payload.company}, ${payload.contactName}, ${payload.email}, ${payload.phone}, ${payload.status}, ${payload.source}, ${payload.value}, ${payload.formToken})`;
                break;
            case 'UPDATE_LEAD':
                await sql`UPDATE leads SET company = ${payload.company}, contact_name = ${payload.contactName}, email = ${payload.email}, phone = ${payload.phone}, status = ${payload.status}, source = ${payload.source}, value = ${payload.value}, form_token = ${payload.formToken} WHERE id = ${payload.id}`;
                break;
            case 'DELETE_LEAD':
                await sql`DELETE FROM leads WHERE id = ${payload.id}`;
                break;
            
            // Ticket
            case 'ADD_TICKET':
                 await sql`INSERT INTO tickets (title, description, status, type, user_id, user_type, created_at) VALUES (${payload.title}, ${payload.description}, ${payload.status}, ${payload.type}, ${payload.userId}, ${payload.userType}, ${payload.createdAt})`;
                break;
            case 'UPDATE_TICKET':
                await sql`UPDATE tickets SET status = ${payload.status}, title = ${payload.title}, description = ${payload.description}, type = ${payload.type} WHERE id = ${payload.id}`;
                break;

            // Proposal
            case 'ADD_PROPOSAL':
                await sql`INSERT INTO proposals (title, client_name, client_company, value, currency, status, valid_until, sent_date, created_at) VALUES (${payload.title}, ${payload.clientName}, ${payload.clientCompany}, ${payload.value}, ${payload.currency}, ${payload.status}, ${payload.validUntil}, ${payload.sentDate}, ${payload.createdAt})`;
                break;
            case 'UPDATE_PROPOSAL':
                await sql`UPDATE proposals SET title = ${payload.title}, client_name = ${payload.clientName}, client_company = ${payload.clientCompany}, value = ${payload.value}, currency = ${payload.currency}, status = ${payload.status}, valid_until = ${payload.validUntil}, sent_date = ${payload.sentDate} WHERE id = ${payload.id}`;
                break;
            case 'DELETE_PROPOSAL':
                await sql`DELETE FROM proposals WHERE id = ${payload.id}`;
                break;

            // Deal
            case 'ADD_DEAL':
                await sql`INSERT INTO deals (title, company, contact_name, value, stage, probability, close_date) VALUES (${payload.title}, ${payload.company}, ${payload.contactName}, ${payload.value}, ${payload.stage}, ${payload.probability}, ${payload.closeDate})`;
                break;
            case 'UPDATE_DEAL':
                await sql`UPDATE deals SET title = ${payload.title}, company = ${payload.company}, contact_name = ${payload.contactName}, value = ${payload.value}, stage = ${payload.stage}, probability = ${payload.probability}, close_date = ${payload.closeDate} WHERE id = ${payload.id}`;
                break;
            case 'DELETE_DEAL':
                await sql`DELETE FROM deals WHERE id = ${payload.id}`;
                break;
            case 'UPDATE_DEAL_STAGE':
                 await sql`UPDATE deals SET stage = ${payload.stage} WHERE id = ${payload.id}`;
                break;

            // Profile
            case 'UPDATE_PROFILE':
                await sql`UPDATE user_profile SET full_name = ${payload.fullName}, email = ${payload.email}, phone = ${payload.phone} WHERE id = ${payload.id}`;
                break;
            
            // Activity
            case 'ADD_ACTIVITY':
                 await sql`INSERT INTO activities (text, timestamp, icon, user_id, user_type) VALUES (${payload.text}, ${payload.timestamp}, ${payload.icon}, ${payload.userId}, ${payload.userType})`;
                break;

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(`Error processing action "${action}":`, error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
