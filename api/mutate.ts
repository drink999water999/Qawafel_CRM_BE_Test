import db from '../services/db.ts';
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
                await db.exec(`INSERT INTO retailers (name, email, phone, account_status, marketplace_status, join_date, company) VALUES (?, ?, ?, ?, ?, ?, ?)`, [payload.name, payload.email, payload.phone, payload.accountStatus, payload.marketplaceStatus, payload.joinDate, payload.company]);
                break;
            case 'UPDATE_RETAILER':
                await db.exec(`UPDATE retailers SET name = ?, email = ?, phone = ?, account_status = ?, marketplace_status = ?, company = ? WHERE id = ?`, [payload.name, payload.email, payload.phone, payload.accountStatus, payload.marketplaceStatus, payload.company, payload.id]);
                break;

            // Vendor
            case 'ADD_VENDOR':
                 await db.exec(`INSERT INTO vendors (name, email, phone, account_status, marketplace_status, join_date, business_name, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [payload.name, payload.email, payload.phone, payload.accountStatus, payload.marketplaceStatus, payload.joinDate, payload.businessName, payload.category]);
                break;
            case 'UPDATE_VENDOR':
                 await db.exec(`UPDATE vendors SET name = ?, email = ?, phone = ?, account_status = ?, marketplace_status = ?, business_name = ?, category = ? WHERE id = ?`, [payload.name, payload.email, payload.phone, payload.accountStatus, payload.marketplaceStatus, payload.businessName, payload.category, payload.id]);
                break;

            // Lead
            case 'ADD_LEAD':
                await db.exec(`INSERT INTO leads (company, contact_name, email, phone, status, source, value, form_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [payload.company, payload.contactName, payload.email, payload.phone, payload.status, payload.source, payload.value, payload.formToken]);
                break;
            case 'UPDATE_LEAD':
                await db.exec(`UPDATE leads SET company = ?, contact_name = ?, email = ?, phone = ?, status = ?, source = ?, value = ?, form_token = ? WHERE id = ?`, [payload.company, payload.contactName, payload.email, payload.phone, payload.status, payload.source, payload.value, payload.formToken, payload.id]);
                break;
            case 'DELETE_LEAD':
                await db.exec(`DELETE FROM leads WHERE id = ?`, [payload.id]);
                break;
            
            // Ticket
            case 'ADD_TICKET':
                 await db.exec(`INSERT INTO tickets (title, description, status, type, user_id, user_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [payload.title, payload.description, payload.status, payload.type, payload.userId, payload.userType, payload.createdAt]);
                break;
            case 'UPDATE_TICKET':
                await db.exec(`UPDATE tickets SET status = ?, title = ?, description = ?, type = ? WHERE id = ?`, [payload.status, payload.title, payload.description, payload.type, payload.id]);
                break;

            // Proposal
            case 'ADD_PROPOSAL':
                await db.exec(`INSERT INTO proposals (title, client_name, client_company, value, currency, status, valid_until, sent_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [payload.title, payload.clientName, payload.clientCompany, payload.value, payload.currency, payload.status, payload.validUntil, payload.sentDate, payload.createdAt]);
                break;
            case 'UPDATE_PROPOSAL':
                await db.exec(`UPDATE proposals SET title = ?, client_name = ?, client_company = ?, value = ?, currency = ?, status = ?, valid_until = ?, sent_date = ? WHERE id = ?`, [payload.title, payload.clientName, payload.clientCompany, payload.value, payload.currency, payload.status, payload.validUntil, payload.sentDate, payload.id]);
                break;
            case 'DELETE_PROPOSAL':
                await db.exec(`DELETE FROM proposals WHERE id = ?`, [payload.id]);
                break;

            // Deal
            case 'ADD_DEAL':
                await db.exec(`INSERT INTO deals (title, company, contact_name, value, stage, probability, close_date) VALUES (?, ?, ?, ?, ?, ?, ?)`, [payload.title, payload.company, payload.contactName, payload.value, payload.stage, payload.probability, payload.closeDate]);
                break;
            case 'UPDATE_DEAL':
                await db.exec(`UPDATE deals SET title = ?, company = ?, contact_name = ?, value = ?, stage = ?, probability = ?, close_date = ? WHERE id = ?`, [payload.title, payload.company, payload.contactName, payload.value, payload.stage, payload.probability, payload.closeDate, payload.id]);
                break;
            case 'DELETE_DEAL':
                await db.exec(`DELETE FROM deals WHERE id = ?`, [payload.id]);
                break;
            case 'UPDATE_DEAL_STAGE':
                 await db.exec(`UPDATE deals SET stage = ? WHERE id = ?`, [payload.stage, payload.id]);
                break;

            // Profile
            case 'UPDATE_PROFILE':
                await db.exec(`UPDATE user_profile SET full_name = ?, email = ?, phone = ? WHERE id = ?`, [payload.fullName, payload.email, payload.phone, payload.id]);
                break;
            
            // Activity
            case 'ADD_ACTIVITY':
                 await db.exec(`INSERT INTO activities (text, timestamp, icon, user_id, user_type) VALUES (?, ?, ?, ?, ?)`, [payload.text, payload.timestamp, payload.icon, payload.userId, payload.userType]);
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