import db from '../services/db.ts';
import { 
    INITIAL_LEADS, 
    INITIAL_RETAILERS, 
    INITIAL_VENDORS, 
    INITIAL_PROPOSALS, 
    INITIAL_DEALS, 
    INITIAL_TICKETS, 
    INITIAL_USER_PROFILE,
    INITIAL_ACTIVITIES
} from '../constants.ts';

// --- TABLE CREATION ---
export async function createTables() {
    await db.exec([
        `CREATE TABLE IF NOT EXISTS retailers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            account_status TEXT,
            marketplace_status TEXT,
            join_date TEXT,
            company TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS vendors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            account_status TEXT,
            marketplace_status TEXT,
            join_date TEXT,
            business_name TEXT,
            category TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT,
            contact_name TEXT,
            email TEXT,
            phone TEXT,
            status TEXT,
            source TEXT,
            value REAL,
            business_size TEXT,
            number_of_branches INTEGER,
            form_token TEXT UNIQUE
        );`,
        `CREATE TABLE IF NOT EXISTS deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            company TEXT,
            contact_name TEXT,
            value REAL,
            stage TEXT,
            probability INTEGER,
            close_date TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS proposals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            client_name TEXT,
            client_company TEXT,
            value REAL,
            currency TEXT,
            status TEXT,
            valid_until TEXT,
            sent_date TEXT,
            created_at TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            status TEXT,
            type TEXT,
            user_id INTEGER,
            user_type TEXT,
            created_at TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            timestamp INTEGER,
            icon TEXT,
            user_id INTEGER,
            user_type TEXT
        );`,
        `CREATE TABLE IF NOT EXISTS user_profile (
            id INTEGER PRIMARY KEY,
            full_name TEXT,
            email TEXT,
            phone TEXT
        );`
    ]);
}

// --- DATA POPULATION ---
export async function populateInitialData() {
    try {
        await db.exec('BEGIN;');
        
        for (const retailer of INITIAL_RETAILERS) {
            await db.exec(
                `INSERT INTO retailers (name, company, email, phone, account_status, marketplace_status, join_date) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [retailer.name, retailer.company, retailer.email, retailer.phone, retailer.accountStatus, retailer.marketplaceStatus, retailer.joinDate]
            );
        }
        for (const vendor of INITIAL_VENDORS) {
            await db.exec(
                `INSERT INTO vendors (name, business_name, category, email, phone, account_status, marketplace_status, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                [vendor.name, vendor.businessName, vendor.category, vendor.email, vendor.phone, vendor.accountStatus, vendor.marketplaceStatus, vendor.joinDate]
            );
        }
        for (const lead of INITIAL_LEADS) {
            await db.exec(
                `INSERT INTO leads (company, contact_name, email, phone, status, source, value, business_size, number_of_branches, form_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [lead.company, lead.contactName, lead.email, lead.phone, lead.status, lead.source, lead.value, lead.businessSize, lead.numberOfBranches, lead.formToken || null]
            );
        }
        for (const deal of INITIAL_DEALS) {
            await db.exec(
                `INSERT INTO deals (title, company, contact_name, value, stage, probability, close_date) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [deal.title, deal.company, deal.contactName, deal.value, deal.stage, deal.probability, deal.closeDate]
            );
        }
        for (const proposal of INITIAL_PROPOSALS) {
            await db.exec(
                `INSERT INTO proposals (title, client_name, client_company, value, currency, status, valid_until, sent_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [proposal.title, proposal.clientName, proposal.clientCompany, proposal.value, proposal.currency, proposal.status, proposal.validUntil, proposal.sentDate || null, proposal.createdAt]
            );
        }
        for (const ticket of INITIAL_TICKETS) {
            await db.exec(
                `INSERT INTO tickets (title, description, status, type, user_id, user_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [ticket.title, ticket.description, ticket.status, ticket.type, ticket.userId, ticket.userType, ticket.createdAt]
            );
        }
        for (const activity of INITIAL_ACTIVITIES) {
            await db.exec(
                `INSERT INTO activities (text, timestamp, icon, user_id, user_type) VALUES (?, ?, ?, ?, ?);`,
                [activity.text, activity.timestamp, activity.icon, activity.userId || null, activity.userType || null]
            );
        }
        await db.exec(
            `INSERT INTO user_profile (id, full_name, email, phone) VALUES (?, ?, ?, ?);`,
            [INITIAL_USER_PROFILE.id, INITIAL_USER_PROFILE.fullName, INITIAL_USER_PROFILE.email, INITIAL_USER_PROFILE.phone]
        );

        await db.exec('COMMIT;');
        console.log("Database populated successfully.");
    } catch (error) {
        await db.exec('ROLLBACK;');
        console.error("Failed to populate database:", error);
        throw error;
    }
}


// --- CASE CONVERSION ---

function toCamel(s: string): string {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

export function snakeToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => snakeToCamelCase(v));
    } else if (obj !== null && typeof obj === 'object' && !Array.isArray(obj) && !(obj instanceof Date)) {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = toCamel(key);
            (acc as any)[camelKey] = snakeToCamelCase(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}