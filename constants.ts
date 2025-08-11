import { Lead, Retailer, Vendor, Proposal, Deal, Ticket, UserProfile, Activity, AccountStatus, MarketplaceStatus, ProposalStatus, TicketStatus, UserType, TicketType, LeadStatus, DealStage } from './types.ts';

export const MESSAGE_TEMPLATES = {
    [UserType.Retailer]: ['Welcome a new retailer', 'Follow up on pending application', 'Special promotion announcement', 'Acknowledge support ticket'],
    [UserType.Vendor]: ['Onboard a new vendor', 'Request updated product catalog', 'Follow up on an order', 'Acknowledge feature request']
};

export const INITIAL_RETAILERS: Omit<Retailer, 'id'>[] = [
    { name: 'Ahmed Al-Farsi', company: 'Farsi Supermarket', email: 'ahmed@farsimarket.com', phone: '555-0101', accountStatus: AccountStatus.Active, marketplaceStatus: MarketplaceStatus.Activated, joinDate: '2023-01-15' },
    { name: 'Fatima Al-Zahrani', company: 'Zahrani Corner Shop', email: 'fatima@zahranishop.com', phone: '555-0102', accountStatus: AccountStatus.Active, marketplaceStatus: MarketplaceStatus.Retained, joinDate: '2023-02-20' },
];

export const INITIAL_VENDORS: Omit<Vendor, 'id'>[] = [
    { name: 'Mohammed Khan', businessName: 'Khan Dates', category: 'Dates', email: 'mohammed@khandates.com', phone: '555-0201', accountStatus: AccountStatus.Active, marketplaceStatus: MarketplaceStatus.Activated, joinDate: '2023-03-10' },
    { name: 'Aisha Abdullah', businessName: 'Abdullah Spices', category: 'Spices', email: 'aisha@abdullahspices.com', phone: '555-0202', accountStatus: AccountStatus.Deactivated, marketplaceStatus: MarketplaceStatus.Churned, joinDate: '2023-04-05' },
];

export const INITIAL_LEADS: Omit<Lead, 'id'>[] = [
    { company: 'Modern Grocers', contactName: 'Yusuf Ahmed', email: 'yusuf@moderngrocers.sa', phone: '555-0301', status: LeadStatus.New, source: 'Website', value: 50000, businessSize: '11-50 employees', numberOfBranches: 3, formToken: 'token-123-abc' },
    { company: 'Fresh Foods Co.', contactName: 'Layla Ibrahim', email: 'layla@freshfoods.co', phone: '555-0302', status: LeadStatus.Contacted, source: 'Referral', value: 75000, businessSize: '51-200 employees', numberOfBranches: 12 },
    { company: 'City Mart', contactName: 'Khalid Hasan', email: 'khalid@citymart.sa', phone: '555-0303', status: LeadStatus.Proposal, source: 'Cold Call', value: 30000, formToken: 'token-456-def' },
];

export const INITIAL_DEALS: Omit<Deal, 'id'>[] = [
    { title: 'Expansion Deal with Fresh Foods Co.', company: 'Fresh Foods Co.', contactName: 'Layla Ibrahim', value: 75000, stage: DealStage.Discovery, probability: 30, closeDate: '2024-08-30' },
    { title: 'Initial Supply for City Mart', company: 'City Mart', contactName: 'Khalid Hasan', value: 30000, stage: DealStage.Proposal, probability: 50, closeDate: '2024-07-25' },
    { title: 'Q3 Dates Supply', company: 'Farsi Supermarket', contactName: 'Ahmed Al-Farsi', value: 25000, stage: DealStage.ClosedWon, probability: 100, closeDate: '2024-06-15' },
];

export const INITIAL_PROPOSALS: Omit<Proposal, 'id'>[] = [
    { title: 'Q3 Wholesale Package', clientName: 'Khalid Hasan', clientCompany: 'City Mart', value: 30000, currency: 'SAR', status: ProposalStatus.Sent, validUntil: '2024-07-20', sentDate: '2024-06-20', createdAt: '2024-06-19' },
    { title: 'Draft for Regional Supplier', clientName: 'Noura Saad', clientCompany: 'Saad Trading', value: 120000, currency: 'SAR', status: ProposalStatus.Draft, validUntil: '2024-08-15', sentDate: '', createdAt: '2024-06-25' },
];

export const INITIAL_TICKETS: Omit<Ticket, 'id'>[] = [
    { title: 'Late delivery inquiry', description: 'Our last order #12345 was delayed. Can we get an update?', status: TicketStatus.Open, type: TicketType.Support, userId: 1, userType: UserType.Retailer, createdAt: '2024-06-28' },
    { title: 'API for inventory management', description: 'It would be great if vendors could integrate their inventory system via an API.', status: TicketStatus.InProgress, type: TicketType.FeatureRequest, userId: 1, userType: UserType.Vendor, createdAt: '2024-06-25' },
];

export const INITIAL_USER_PROFILE: UserProfile = {
    id: 1,
    fullName: 'Sales Manager',
    email: 'manager@qawafel.com',
    phone: '555-0000'
};

export const INITIAL_ACTIVITIES: Omit<Activity, 'id'>[] = [
    { text: "New lead 'Modern Grocers' was added.", timestamp: Date.now() - 1000 * 60 * 5, icon: 'user-plus' },
    { text: "Proposal sent to 'City Mart'.", timestamp: Date.now() - 1000 * 60 * 60 * 2, icon: 'proposal-sent' },
    { text: "Deal 'Q3 Dates Supply' was won!", timestamp: Date.now() - 1000 * 60 * 60 * 24, icon: 'deal-won' },
];