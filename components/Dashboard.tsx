
import React from 'react';
import { Retailer, Vendor, Activity, Lead, Deal, DealStage, LeadStatus } from '../types.ts';
import { StatCard } from './StatCard.tsx';
import { ActivityFeed } from './ActivityFeed.tsx';

const statusDisplay: Record<LeadStatus, { text: string; className: string; }> = {
    [LeadStatus.New]: { text: 'New', className: 'bg-blue-100 text-blue-800' },
    [LeadStatus.Contacted]: { text: 'Contacted', className: 'bg-yellow-100 text-yellow-800' },
    [LeadStatus.Proposal]: { text: 'Proposal', className: 'bg-orange-100 text-orange-800' },
    [LeadStatus.Qualified]: { text: 'Qualified', className: 'bg-green-100 text-green-800' },
    [LeadStatus.Lost]: { text: 'Lost', className: 'bg-red-100 text-red-800' },
};

const RecentLeads: React.FC<{ leads: Lead[] }> = ({ leads }) => (
    <div className="bg-white border border-[var(--border-color)] rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
        <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                        <p className="font-semibold text-[var(--text-dark)]">{lead.contactName}</p>
                        <p className="text-sm text-[var(--text-light)]">{lead.company}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusDisplay[lead.status].className}`}>
                        {statusDisplay[lead.status].text}
                    </span>
                </div>
            ))}
             {leads.length === 0 && (
                <p className="text-sm text-center text-gray-500 py-4">No recent leads found.</p>
            )}
        </div>
    </div>
);

interface DashboardProps {
  retailers: Retailer[];
  vendors: Vendor[];
  activities: Activity[];
  leads: Lead[];
  deals: Deal[];
}

export const Dashboard: React.FC<DashboardProps> = ({ retailers, vendors, activities, leads, deals }) => {
  const totalLeads = leads.length;
  const totalVendors = vendors.length;
  const totalRetailers = retailers.length;
  const activeDeals = deals.filter(deal => deal.stage !== DealStage.ClosedWon && deal.stage !== DealStage.Lost).length;
  const totalRevenue = deals.filter(deal => deal.stage === DealStage.ClosedWon).reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-dark)]">Dashboard</h1>
        <p className="mt-1 text-[var(--text-light)]">Welcome to your CRM dashboard</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Leads" value={totalLeads.toString()} change="+20.1% from last month" icon="users" color="blue" />
        <StatCard title="Active Deals" value={activeDeals.toString()} change="+12.5% from last month" icon="target" color="green" />
        <StatCard title="Vendors" value={totalVendors.toString()} change="+5.2% from last month" icon="store" color="purple" />
        <StatCard title="Retailers" value={totalRetailers.toString()} change="+8.7% from last month" icon="building" color="orange" />
        <StatCard title="Revenue" value={`$${new Intl.NumberFormat('en-US').format(totalRevenue)}`} change="+15.3% from last month" icon="dollar" color="teal" />
        <StatCard title="Growth Rate" value="24.8%" change="+2.1% from last month" icon="chart" color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <RecentLeads leads={leads} />
        </div>
        <div>
            <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};
