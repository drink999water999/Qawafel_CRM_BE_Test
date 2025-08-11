
import React, { useState, useEffect } from 'react';
import { Lead } from '../types.ts';

interface SendFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onUpdateLead: (lead: Lead) => void;
}

export const SendFormModal: React.FC<SendFormModalProps> = ({ isOpen, onClose, lead, onUpdateLead }) => {
    const [formLink, setFormLink] = useState('');
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            let token = lead.formToken;
            if (!token) {
                token = crypto.randomUUID();
                // This update call persists the token to the database via App -> LeadsPage
                onUpdateLead({ ...lead, formToken: token });
            }
            const link = `${window.location.origin}/form/lead/${token}`;
            setFormLink(link);
            setIsSent(false); // Reset sent state on open
            setIsLinkCopied(false); // Reset copied state on open
        }
    }, [isOpen, lead, onUpdateLead]);

    const handleCopyLink = () => {
        if (!formLink) return;
        navigator.clipboard.writeText(formLink);
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2000);
    };

    const handleSend = () => {
        // Simulation of sending an email
        setIsSent(true);
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    const emailBody = `Dear ${lead.contactName},

We're in the process of updating our records and would appreciate it if you could provide us with a bit more information about your business. This will help us tailor our offerings to better suit your needs.

Please follow the link below to a short form:
${formLink}

Thank you for your time.

Best regards,
The Qawafel Team`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white border border-[var(--border-color)] rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2 text-[var(--text-dark)]">Send Data Form</h2>
        <p className="text-sm text-gray-500 mb-6">Send a link to {lead.contactName} at {lead.company} to collect more information.</p>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Sharable Form Link</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                        type="text"
                        readOnly
                        value={formLink}
                        className="block w-full rounded-none rounded-l-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 focus:border-[var(--primary)] focus:ring-[var(--primary)] sm:text-sm"
                    />
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <span>{isLinkCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700">Email Preview</label>
                 <textarea 
                    readOnly 
                    rows={8}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-3 font-mono text-xs text-gray-800"
                    value={emailBody}
                />
            </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button onClick={handleSend} className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded-md hover:bg-green-700 w-32">
              {isSent ? 'Sent!' : 'Send Email'}
            </button>
        </div>
      </div>
    </div>
  );
};
