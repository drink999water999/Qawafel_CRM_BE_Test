import { sql } from '@vercel/postgres';
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
import { Retailer, Vendor, UserType } from '../types.ts';

// --- TABLE CREATION ---
export async function createTables() {
    await sql`
        CREATE TABLE IF NOT EXISTS retailers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(50),
            account_status VARCHAR(50),
            marketplace_status VARCHAR(50),
            join_date DATE,
            company VARCHAR(255)
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS vendors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(50),
            account_status VARCHAR(50),
            marketplace_status VARCHAR(50),
            join_date DATE,
            business_name VARCHAR(255),
            category VARCHAR(255)
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS leads (
            id SERIAL PRIMARY KEY,
            company VARCHAR(255),
            contact_name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50),
            status VARCHAR(50),
            source VARCHAR(100),
            value NUMERIC,
            business_size VARCHAR(100),
            number_of_branches INT,
            form_token VARCHAR(255) UNIQUE
        );
    `;
     await sql`
        CREATE TABLE IF NOT EXISTS deals (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            company VARCHAR(255),
            contact_name VARCHAR(255),
            value NUMERIC,
            stage VARCHAR(50),
            probability INT,
            close_date DATE
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS proposals (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            client_name VARCHAR(255),
            client_company VARCHAR(255),
            value NUMERIC,
            currency VARCHAR(10),
            status VARCHAR(50),
            valid_until DATE,
            sent_date DATE,
            created_at DATE
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS tickets (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            description TEXT,
            status VARCHAR(50),
            type VARCHAR(50),
            user_id INT,
            user_type VARCHAR(50),
            created_at DATE
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS activities (
            id SERIAL PRIMARY KEY,
            text TEXT,
            timestamp BIGINT,
            icon VARCHAR(50),
            user_id INT,
            user_type VARCHAR(50)
        );
    `;
    await sql`
        CREATE TABLE IF NOT EXISTS user_profile (
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(50)
        );
    `;
}

// --- DATA POPULATION ---
export async function populateInitialData() {
    await sql.query('BEGIN');
    try {
        for (const retailer of INITIAL_RETAILERS) {
            await sql`
                INSERT INTO retailers (name, company, email, phone, account_status, marketplace_status, join_date)
                VALUES (${retailer.name}, ${retailer.company}, ${retailer.email}, ${retailer.phone}, ${retailer.accountStatus}, ${retailer.marketplaceStatus}, ${retailer.joinDate});
            `;
        }
        for (const vendor of INITIAL_VENDORS) {
            await sql`
                INSERT INTO vendors (name, business_name, category, email, phone, account_status, marketplace_status, join_date)
                VALUES (${vendor.name}, ${vendor.businessName}, ${vendor.category}, ${vendor.email}, ${vendor.phone}, ${vendor.accountStatus}, ${vendor.marketplaceStatus}, ${vendor.joinDate});
            `;
        }
        for (const lead of INITIAL_LEADS) {
            await sql`
                INSERT INTO leads (company, contact_name, email, phone, status, source, value, business_size, number_of_branches, form_token)
                VALUES (${lead.company}, ${lead.contactName}, ${lead.email}, ${lead.phone}, ${lead.status}, ${lead.source}, ${lead.value}, ${lead.businessSize}, ${lead.numberOfBranches}, ${lead.formToken || null});
            `;
        }
        for (const deal of INITIAL_DEALS) {
            await sql`
                INSERT INTO deals (title, company, contact_name, value, stage, probability, close_date)
                VALUES (${deal.title}, ${deal.company}, ${deal.contactName}, ${deal.value}, ${deal.stage}, ${deal.probability}, ${deal.closeDate});
            `;
        }
        for (const proposal of INITIAL_PROPOSALS) {
            await sql`
                INSERT INTO proposals (title, client_name, client_company, value, currency, status, valid_until, sent_date, created_at)
                VALUES (${proposal.title}, ${proposal.clientName}, ${proposal.clientCompany}, ${proposal.value}, ${proposal.currency}, ${proposal.status}, ${proposal.validUntil}, ${proposal.sentDate || null}, ${proposal.createdAt});
            `;
        }
        for (const ticket of INITIAL_TICKETS) {
            await sql`
                INSERT INTO tickets (title, description, status, type, user_id, user_type, created_at)
                VALUES (${ticket.title}, ${ticket.description}, ${ticket.status}, ${ticket.type}, ${ticket.userId}, ${ticket.userType}, ${ticket.createdAt});
            `;
        }
        for (const activity of INITIAL_ACTIVITIES) {
            await sql`
                INSERT INTO activities (text, timestamp, icon, user_id, user_type)
                VALUES (${activity.text}, ${activity.timestamp}, ${activity.icon}, ${activity.userId || null}, ${activity.userType || null});
            `;
        }
        await sql`
            INSERT INTO user_profile (id, full_name, email, phone)
            VALUES (${INITIAL_USER_PROFILE.id}, ${INITIAL_USER_PROFILE.fullName}, ${INITIAL_USER_PROFILE.email}, ${INITIAL_USER_PROFILE.phone});
        `;
        await sql.query('COMMIT');
        console.log("Database populated successfully.");
    } catch (error) {
        await sql.query('ROLLBACK');
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
