
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

  const mutateAPI = async (action: string, payload: any) => {
    try {
      const response = await fetch('/api/mutate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API mutation failed');
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to perform action ${action}:`, error);
      throw error;
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/init');
      if (!response.ok) {
        throw new Error('Failed to initialize data from the server');
      }
      const data = await response.json();

      setRetailers(data.retailers);
      setVendors(data.vendors);
      setTickets(data.tickets);
      setProposals(data.proposals);
      setLeads(data.leads);
      setDeals(data.deals);
      setActivities(data.activities.sort((a: Activity, b: Activity) => b.timestamp - a.timestamp));
      if (data.userProfile) setUserProfile(data.userProfile);

    } catch (error) {
        console.error("Failed to load CRM data from backend", error);
    } finally {
        setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMutation = async (action: string, payload: any) => {
    try {
      await mutateAPI(action, payload);
      await loadData();
    } catch (error) {
      // Error is already logged in mutateAPI
    }
  };

  const addRetailer = useCallback((retailer: Omit<Retailer, 'id'>) => handleMutation('ADD_RETAILER', retailer), []);
  const updateRetailer = useCallback((retailer: Retailer) => handleMutation('UPDATE_RETAILER', retailer), []);
  const addVendor = useCallback((vendor: Omit<Vendor, 'id'>) => handleMutation('ADD_VENDOR', vendor), []);
  const updateVendor = useCallback((vendor: Vendor) => handleMutation('UPDATE_VENDOR', vendor), []);
  
  const addLead = useCallback(async (lead: Omit<Lead, 'id'>) => {
    const leadWithToken = { ...lead, formToken: lead.formToken || crypto.randomUUID() };
    await handleMutation('ADD_LEAD', leadWithToken);
  }, []);
  const updateLead = useCallback((lead: Lead) => handleMutation('UPDATE_LEAD', lead), []);
  const deleteLead = useCallback((leadId: number) => handleMutation('DELETE_LEAD', { id: leadId }), []);

  const addTicket = useCallback(async (ticket: Omit<Ticket, 'id' | 'status' | 'createdAt'>) => {
    const newTicket = {
      ...ticket,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    await handleMutation('ADD_TICKET', newTicket);
  }, []);
  const updateTicket = useCallback((ticket: Ticket) => handleMutation('UPDATE_TICKET', ticket), []);

  const addProposal = useCallback((proposal: Omit<Proposal, 'id'>) => handleMutation('ADD_PROPOSAL', proposal), []);
  const updateProposal = useCallback((proposal: Proposal) => handleMutation('UPDATE_PROPOSAL', proposal), []);
  const deleteProposal = useCallback((proposalId: number) => handleMutation('DELETE_PROPOSAL', { id: proposalId }), []);
  
  const addDeal = useCallback((deal: Omit<Deal, 'id'>) => handleMutation('ADD_DEAL', deal), []);
  const updateDeal = useCallback((deal: Deal) => handleMutation('UPDATE_DEAL', deal), []);
  const deleteDeal = useCallback((dealId: number) => handleMutation('DELETE_DEAL', { id: dealId }), []);
  const handleUpdateDealStage = useCallback((dealId: number, newStage: DealStage) => handleMutation('UPDATE_DEAL_STAGE', { id: dealId, stage: newStage }), []);

  const handleUpdateProfile = useCallback(async (profile: UserProfile) => {
    if(!profile.id) return;
    await handleMutation('UPDATE_PROFILE', profile);
  }, []);

  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => handleMutation('ADD_ACTIVITY', activity), []);
  
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
