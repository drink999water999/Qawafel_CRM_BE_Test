import Dexie from 'dexie';
import type { Table } from 'dexie';
import { 
    Retailer, 
    Vendor, 
    Ticket, 
    Proposal, 
    Lead, 
    Deal, 
    Activity, 
    UserProfile,
} from '../types.ts';
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


export class QawafelDexie extends Dexie {
    retailers!: Table<Retailer>;
    vendors!: Table<Vendor>;
    tickets!: Table<Ticket>;
    proposals!: Table<Proposal>;
    leads!: Table<Lead>;
    deals!: Table<Deal>;
    activities!: Table<Activity>;
    userProfile!: Table<UserProfile>;

    constructor() {
        super('qawafelCrmDb');
        this.version(2).stores({
            retailers: '++id, name, company, email',
            vendors: '++id, name, businessName, email',
            tickets: '++id, title, status, type, userId, userType',
            proposals: '++id, title, status, clientName',
            leads: '++id, company, contactName, status, &formToken',
            deals: '++id, title, stage, company',
            activities: '++id, timestamp',
            userProfile: 'id',
        });
    }
}

export const db = new QawafelDexie();

export async function populate() {
    const profileCount = await db.userProfile.count();
    if (profileCount === 0) {
        console.log("Database is empty, populating with initial data...");
        try {
            await db.transaction('rw', db.retailers, db.vendors, db.tickets, db.proposals, db.leads, db.deals, db.activities, db.userProfile, async () => {
                await db.retailers.bulkAdd(INITIAL_RETAILERS as Retailer[]);
                await db.vendors.bulkAdd(INITIAL_VENDORS as Vendor[]);
                await db.tickets.bulkAdd(INITIAL_TICKETS as Ticket[]);
                await db.proposals.bulkAdd(INITIAL_PROPOSALS as Proposal[]);
                await db.leads.bulkAdd(INITIAL_LEADS as Lead[]);
                await db.deals.bulkAdd(INITIAL_DEALS as Deal[]);
                await db.activities.bulkAdd(INITIAL_ACTIVITIES as Activity[]);
                await db.userProfile.put(INITIAL_USER_PROFILE);
            });
            console.log("Database populated.");
        } catch (error) {
            console.error('Failed to populate database:', error);
        }
    } else {
        console.log("Database already exists.");
    }
}

populate().catch(err => {
    console.error("Failed to populate database during initial load:", err);
});