
import React, { useState } from 'react';
import { Vendor, UserType, Activity, Proposal, Deal, ProposalStatus, DealStage } from '../types.ts';
import { UserTable } from './UserTable.tsx';
import { UserModal } from './UserModal.tsx';
import { GroupCommunicationModal } from './GroupCommunicationModal.tsx';
import { SingleCommunicationModal } from './SingleCommunicationModal.tsx';
import { ProposalModal } from './ProposalModal.tsx';


type Channel = 'WhatsApp' | 'Email' | 'SMS' | 'Push';

interface VendorsPageProps {
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (vendor: Vendor) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  onAddProposal: (proposal: Omit<Proposal, 'id'>) => void;
  onAddDeal: (deal: Omit<Deal, 'id'>) => void;
}

export const VendorsPage: React.FC<VendorsPageProps> = ({ vendors, addVendor, updateVendor, addActivity, onAddProposal, onAddDeal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isSingleCommModalOpen, setIsSingleCommModalOpen] = useState(false);
  const [contactUser, setContactUser] = useState<Vendor | undefined>(undefined);
  const [contactChannel, setContactChannel] = useState<Channel>('Email');

  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalTargetVendor, setProposalTargetVendor] = useState<Vendor | undefined>(undefined);


  const handleOpenModal = (vendor?: Vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingVendor(undefined);
    setIsModalOpen(false);
  };

  const handleContact = (vendor: Vendor, channel: Channel) => {
    setContactUser(vendor);
    setContactChannel(channel);
    setIsSingleCommModalOpen(true);
  };

  const handleSelectionChange = (id: number) => {
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
        setSelectedIds(new Set(vendors.map(v => v.id)));
    } else {
        setSelectedIds(new Set());
    }
  };

  const handleSave = (user: Omit<Vendor, 'id'> | Vendor) => {
    if ('id' in user) {
      updateVendor(user);
    } else {
      addVendor(user);
    }
    handleCloseModal();
  };

  const handleSendProposalClick = (vendor: Vendor) => {
    setProposalTargetVendor(vendor);
    setIsProposalModalOpen(true);
  };

  const handleCloseProposalModal = () => {
      setProposalTargetVendor(undefined);
      setIsProposalModalOpen(false);
  }

  const handleSaveProposal = (proposalData: Omit<Proposal, 'id'> | Proposal) => {
      if ('id' in proposalData) {
          // This component only handles creating new proposals for vendors.
          // Editing is handled in the main ProposalsPage.
          return;
      }
      
      onAddProposal(proposalData);

      if (proposalData.status !== ProposalStatus.Draft && proposalTargetVendor) {
          const newDeal: Omit<Deal, 'id'> = {
              title: `Deal for ${proposalTargetVendor.businessName}`,
              company: proposalTargetVendor.businessName,
              contactName: proposalTargetVendor.name,
              value: proposalData.value,
              stage: DealStage.Proposal,
              probability: 25, 
              closeDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
          };
          onAddDeal(newDeal);
          addActivity({
            text: `New deal created for vendor "${proposalTargetVendor.businessName}" from proposal.`,
            timestamp: Date.now(),
            icon: 'deal-won' // using deal-won icon for visibility
          });
      }
      
      if (proposalTargetVendor) {
          addActivity({
              text: `Proposal "${proposalData.title}" sent to vendor "${proposalTargetVendor.businessName}".`,
              timestamp: Date.now(),
              icon: 'proposal-sent'
          });
      }

      handleCloseProposalModal();
  };


  const columns: { header: string; accessor: keyof Vendor }[] = [
    { header: 'Contact Name', accessor: 'name' },
    { header: 'Business Name', accessor: 'businessName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Join Date', accessor: 'joinDate' },
    { header: 'Account Status', accessor: 'accountStatus' },
    { header: 'Marketplace Status', accessor: 'marketplaceStatus' },
  ];
  
  const selectedVendors = vendors.filter(v => selectedIds.has(v.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--text-dark)]">Vendors</h1>
        <div className="flex items-center space-x-2">
           {selectedIds.size > 0 && (
                <button
                  onClick={() => setIsCommModalOpen(true)}
                  className="px-4 py-2 bg-rose-500 text-white font-bold rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Message Selected ({selectedIds.size})
                </button>
            )}
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Vendor
            </button>
        </div>
      </div>
      <UserTable<Vendor>
        columns={columns}
        data={vendors}
        onEdit={handleOpenModal}
        onAccountStatusChange={(user, status) => updateVendor({ ...user, accountStatus: status })}
        onMarketplaceStatusChange={(user, status) => updateVendor({ ...user, marketplaceStatus: status })}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onSelectAll={handleSelectAll}
        onContact={handleContact}
        onSendProposal={handleSendProposalClick}
      />
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          user={editingVendor}
          userType={UserType.Vendor}
        />
      )}
       {isCommModalOpen && (
        <GroupCommunicationModal
            isOpen={isCommModalOpen}
            onClose={() => setIsCommModalOpen(false)}
            users={selectedVendors}
            userType={UserType.Vendor}
            onSend={addActivity}
        />
      )}
      {isSingleCommModalOpen && contactUser && (
        <SingleCommunicationModal
            isOpen={isSingleCommModalOpen}
            onClose={() => setIsSingleCommModalOpen(false)}
            user={contactUser}
            userType={UserType.Vendor}
            initialChannel={contactChannel}
            onSend={addActivity}
        />
      )}
      {isProposalModalOpen && proposalTargetVendor && (
          <ProposalModal
              isOpen={isProposalModalOpen}
              onClose={handleCloseProposalModal}
              onSave={handleSaveProposal}
              prefilledClient={{
                  clientName: proposalTargetVendor.name,
                  clientCompany: proposalTargetVendor.businessName,
              }}
          />
      )}
    </div>
  );
};
