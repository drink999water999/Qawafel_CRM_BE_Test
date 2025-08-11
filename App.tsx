
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { RetailersPage } from './components/RetailersPage.tsx';
import { VendorsPage } from './components/VendorsPage.tsx';
import { TicketsPage } from './components/TicketsPage.tsx';
import { CreateTicketPage } from './components/CreateTicketPage.tsx';
import { ProposalsPage } from './components/ProposalsPage.tsx';
import { SettingsPage } from './components/SettingsPage.tsx';
import { DealsPage } from './components/DealsPage.tsx';
import { Page, Retailer, Vendor, Ticket, Proposal, Lead, Deal, DealStage, UserProfile, Activity } from './types.ts';
import { LeadsPage } from './components/LeadsPage.tsx';
import { LeadFormPage } from './components/LeadFormPage.tsx';
import { db, populate } from './services/db.ts';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isLoading, setIsLoading] = useState(true);

  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ id: 1, fullName: '', email: '', phone: '' });
  
  const path = window.location.pathname;
  const leadFormMatch = path.match(/^\/form\/lead\/(.+)/);

  if (leadFormMatch) {
      const token = leadFormMatch[1];
      return <LeadFormPage token={token} />;
  }

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      await populate(); // Populates DB on first run

      const [
          retailersData, vendorsData, ticketsData, proposalsData, leadsData, dealsData, activitiesData, userProfileData
      ] = await Promise.all([
          db.retailers.toArray(),
          db.vendors.toArray(),
          db.tickets.toArray(),
          db.proposals.toArray(),
          db.leads.toArray(),
          db.deals.toArray(),
          db.activities.toArray(),
          db.userProfile.get(1)
      ]);

      setRetailers(retailersData);
      setVendors(vendorsData);
      setTickets(ticketsData);
      setProposals(proposalsData);
      setLeads(leadsData);
      setDeals(dealsData);
      setActivities(activitiesData.sort((a,b) => b.timestamp - a.timestamp));
      if (userProfileData) setUserProfile(userProfileData);
    } catch (error) {
        console.error("Failed to load CRM data from Dexie", error);
    } finally {
        setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const addRetailer = useCallback(async (retailer: Omit<Retailer, 'id'>) => {
    await db.retailers.add(retailer as Retailer);
    await loadData();
  }, [loadData]);

  const updateRetailer = useCallback(async (updatedRetailer: Retailer) => {
    await db.retailers.put(updatedRetailer);
    await loadData();
  }, [loadData]);

  const addVendor = useCallback(async (vendor: Omit<Vendor, 'id'>) => {
    await db.vendors.add(vendor as Vendor);
    await loadData();
  }, [loadData]);

  const updateVendor = useCallback(async (updatedVendor: Vendor) => {
    await db.vendors.put(updatedVendor);
    await loadData();
  }, [loadData]);
  
  const addLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
    const leadWithToken = { ...lead, formToken: lead.formToken || crypto.randomUUID() };
    await db.leads.add(leadWithToken as Lead);
    await loadData();
  }, [loadData]);

  const updateLead = useCallback(async (updatedLead: Lead) => {
    await db.leads.put(updatedLead);
    await loadData();
  }, [loadData]);

  const deleteLead = useCallback(async (leadId: number) => {
    await db.leads.delete(leadId);
    await loadData();
  }, [loadData]);

  const addTicket = useCallback(async (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt'>) => {
    const newTicket = {
      ...ticket,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    await db.tickets.add(newTicket as Ticket);
    await loadData();
  }, [loadData]);

  const updateTicket = useCallback(async (updatedTicket: Ticket) => {
    await db.tickets.put(updatedTicket);
    await loadData();
  }, [loadData]);

  const addProposal = useCallback(async (proposal: Omit<Proposal, 'id'>) => {
    await db.proposals.add(proposal as Proposal);
    await loadData();
  }, [loadData]);

  const updateProposal = useCallback(async (updatedProposal: Proposal) => {
    await db.proposals.put(updatedProposal);
    await loadData();
  }, [loadData]);

  const deleteProposal = useCallback(async (proposalId: number) => {
    await db.proposals.delete(proposalId);
    await loadData();
  }, [loadData]);
  
  const addDeal = useCallback(async (deal: Omit<Deal, 'id'>) => {
    await db.deals.add(deal as Deal);
    await loadData();
  }, [loadData]);

  const updateDeal = useCallback(async (updatedDeal: Deal) => {
    await db.deals.put(updatedDeal);
    await loadData();
  }, [loadData]);

  const deleteDeal = useCallback(async (dealId: number) => {
    await db.deals.delete(dealId);
    await loadData();
  }, [loadData]);

  const handleUpdateDealStage = useCallback(async (dealId: number, newStage: DealStage) => {
    await db.deals.update(dealId, { stage: newStage });
    await loadData();
  }, [loadData]);

  const handleUpdateProfile = useCallback(async (profile: UserProfile) => {
    if(!profile.id) return;
    await db.userProfile.put(profile);
    setUserProfile(profile);
  }, []);

  const addActivity = useCallback(async (activity: Omit<Activity, 'id'>) => {
    await db.activities.add(activity as Activity);
    await loadData();
  }, [loadData]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-[var(--primary)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-gray-700">Loading your CRM...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard retailers={retailers} vendors={vendors} activities={activities} leads={leads} deals={deals} />;
      case Page.Leads:
         return <LeadsPage leads={leads} onAddLead={addLead} onUpdateLead={updateLead} onDeleteLead={deleteLead} />;
      case Page.Deals:
        return <DealsPage deals={deals} onUpdateDealStage={handleUpdateDealStage} onAddDeal={addDeal} onUpdateDeal={updateDeal} onDeleteDeal={deleteDeal} />;
      case Page.Vendors:
        return <VendorsPage vendors={vendors} addVendor={addVendor} updateVendor={updateVendor} addActivity={addActivity} onAddProposal={addProposal} onAddDeal={addDeal} />;
      case Page.Retailers:
        return <RetailersPage retailers={retailers} addRetailer={addRetailer} updateRetailer={updateRetailer} addActivity={addActivity} />;
      case Page.Proposals:
        return <ProposalsPage proposals={proposals} onAddProposal={addProposal} onUpdateProposal={updateProposal} onDeleteProposal={deleteProposal} />;
       case Page.Settings:
        return <SettingsPage profile={userProfile} onSaveProfile={handleUpdateProfile} />;
       case Page.Tickets:
        return <TicketsPage tickets={tickets} retailers={retailers} vendors={vendors} onUpdateTicket={updateTicket} />;
      case Page.CreateTicket:
        return <CreateTicketPage retailers={retailers} vendors={vendors} onAddTicket={addTicket} />;
      default:
        return <Dashboard retailers={retailers} vendors={vendors} activities={activities} leads={leads} deals={deals} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userProfile={userProfile} />
        <main className="flex-1 overflow-y-auto bg-[var(--bg-body)] p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;