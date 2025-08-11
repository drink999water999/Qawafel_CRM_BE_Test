
import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types.ts';
import { LeadModal } from './LeadModal.tsx';
import { ConfirmationModal } from './ConfirmationModal.tsx';
import { SendFormModal } from './SendFormModal.tsx';

interface LeadsPageProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (id: number) => void;
}

const statusColors: Record<LeadStatus, string> = {
    [LeadStatus.New]: 'bg-blue-400',
    [LeadStatus.Contacted]: 'bg-yellow-400',
    [LeadStatus.Proposal]: 'bg-orange-400',
    [LeadStatus.Qualified]: 'bg-green-500',
    [LeadStatus.Lost]: 'bg-red-500',
};

const LeadRow: React.FC<{ 
    lead: Lead; 
    onUpdate: (lead: Lead) => void; 
    onEdit: (lead: Lead) => void; 
    onDeleteClick: (id: number) => void;
    onSendFormClick: (lead: Lead) => void;
}> = ({ lead, onUpdate, onEdit, onDeleteClick, onSendFormClick }) => {
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdate({ ...lead, status: e.target.value as LeadStatus });
    };

    return (
        <div className="grid grid-cols-12 gap-x-4 items-center py-4 px-5 border-t border-gray-100 hover:bg-gray-50/50">
            {/* Company */}
            <div className="col-span-3">
                <p className="font-bold text-gray-800 truncate">{lead.company}</p>
                <p className="text-sm text-gray-500 truncate">{lead.contactName}</p>
            </div>
            {/* Status */}
            <div className="col-span-2">
                <div className="relative inline-block">
                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full ${statusColors[lead.status]}`}></span>
                    <select
                        value={lead.status}
                        onChange={handleStatusChange}
                        className="pl-7 pr-8 py-1.5 text-sm rounded-md border-gray-200 bg-gray-50 hover:bg-gray-100 focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] appearance-none transition-colors"
                    >
                        {Object.values(LeadStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Source */}
            <div className="col-span-1">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                    {lead.source}
                </span>
            </div>
            {/* Value */}
            <div className="col-span-1 font-semibold text-green-600">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(lead.value)}
            </div>
            {/* Biz Size */}
            <div className="col-span-1 text-sm text-gray-600 truncate">{lead.businessSize || 'N/A'}</div>
            {/* Branches */}
            <div className="col-span-1 text-sm text-gray-600">{lead.numberOfBranches ?? 'N/A'}</div>
            {/* Actions */}
            <div className="col-span-3 flex justify-start items-center space-x-1">
                 <button onClick={() => onSendFormClick(lead)} title="Send data collection form" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
                <button onClick={() => onEdit(lead)} title="Edit Lead" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => onDeleteClick(lead.id)} title="Delete Lead" className="p-2 rounded-md transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    );
}

export const LeadsPage: React.FC<LeadsPageProps> = ({ leads, onAddLead, onUpdateLead, onDeleteLead }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
    const [deletingLeadId, setDeletingLeadId] = useState<number | null>(null);
    const [isSendFormModalOpen, setIsSendFormModalOpen] = useState(false);
    const [formLead, setFormLead] = useState<Lead | undefined>(undefined);

    const handleOpenModal = (lead?: Lead) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingLead(undefined);
        setIsModalOpen(false);
    };

    const handleSave = (leadData: Omit<Lead, 'id'> | Lead) => {
        if ('id' in leadData) {
            onUpdateLead(leadData);
        } else {
            onAddLead(leadData);
        }
        handleCloseModal();
    };
    
    const handleConfirmDelete = () => {
        if (deletingLeadId) {
            onDeleteLead(deletingLeadId);
            setDeletingLeadId(null);
        }
    };
    
    const leadToDelete = deletingLeadId ? leads.find(l => l.id === deletingLeadId) : null;

    const handleSendFormClick = (lead: Lead) => {
        setFormLead(lead);
        setIsSendFormModalOpen(true);
    };

    const handleSendFormModalClose = () => {
        setIsSendFormModalOpen(false);
        setFormLead(undefined);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Leads</h1>
                    <p className="mt-1 text-gray-500">Manage your sales prospects and opportunities</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded-md hover:bg-green-700 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                    Add Lead
                </button>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800">All Leads</h2>
                    <p className="text-sm text-gray-500">Total: {leads.length} leads</p>
                </div>
                
                {/* Header */}
                <div className="grid grid-cols-12 gap-x-4 px-5 pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <div className="col-span-3">Company</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Source</div>
                    <div className="col-span-1">Value</div>
                    <div className="col-span-1">Biz Size</div>
                    <div className="col-span-1">Branches</div>
                    <div className="col-span-3">Actions</div>
                </div>

                {/* Body */}
                <div className="divide-y divide-gray-100">
                    {leads.map(lead => (
                        <LeadRow 
                            key={lead.id} 
                            lead={lead} 
                            onUpdate={onUpdateLead} 
                            onEdit={handleOpenModal} 
                            onDeleteClick={setDeletingLeadId}
                            onSendFormClick={handleSendFormClick} 
                        />
                    ))}
                     {leads.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No leads found. Add one to get started!</p>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <LeadModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    lead={editingLead}
                />
            )}
            {isSendFormModalOpen && formLead && (
                <SendFormModal
                    isOpen={isSendFormModalOpen}
                    onClose={handleSendFormModalClose}
                    lead={formLead}
                    onUpdateLead={onUpdateLead}
                />
            )}
            <ConfirmationModal
                isOpen={deletingLeadId !== null}
                onClose={() => setDeletingLeadId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Lead"
                message={
                    <p>Are you sure you want to delete the lead for <strong>{leadToDelete?.company}</strong>? This action cannot be undone.</p>
                }
            />
        </div>
    );
};
