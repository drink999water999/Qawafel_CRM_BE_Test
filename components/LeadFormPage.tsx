
import React, { useState, useEffect } from 'react';
import { Lead } from '../types.ts';

interface LeadFormPageProps {
  token: string;
}

export const LeadFormPage: React.FC<LeadFormPageProps> = ({ token }) => {
    const [lead, setLead] = useState<Lead | null | undefined>(undefined); // undefined: loading, null: not found
    const [formData, setFormData] = useState({ businessSize: '', numberOfBranches: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLead = async () => {
            if (!token) {
                setLead(null);
                return;
            }
            try {
                const response = await fetch(`/api/get-lead-by-token?token=${token}`);
                if (response.status === 404) {
                    setLead(null);
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to fetch lead');
                }
                const foundLead = await response.json();

                setLead(foundLead || null);
                if (foundLead) {
                    setFormData({
                        businessSize: foundLead.businessSize || '',
                        numberOfBranches: foundLead.numberOfBranches?.toString() || ''
                    });
                }
            } catch (e) {
                console.error("Error fetching lead from API", e);
                setError("Could not load form data.");
                setLead(null);
            }
        };
        fetchLead();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (lead) {
            setIsSubmitting(true);
            setError('');
            try {
                 const payload = {
                    token: lead.formToken,
                    businessSize: formData.businessSize,
                    numberOfBranches: formData.numberOfBranches ? parseInt(formData.numberOfBranches, 10) : undefined,
                };

                const response = await fetch('/api/update-lead-from-form', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Failed to update lead');
                }
                
                setIsSubmitted(true);
            } catch (e) {
                console.error("Error updating lead via API", e);
                setError("Could not submit your data. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const renderContent = () => {
        if (lead === undefined) {
             return (
                <div className="text-center text-gray-500">
                    <svg className="animate-spin h-8 w-8 text-[var(--primary)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-3">Loading form...</p>
                </div>
            );
        }

        if (lead === null || error) {
            return (
                 <div className="text-center text-red-500">
                    <h2 className="text-xl font-bold">Invalid Form</h2>
                    <p className="mt-2">{error || "The link you followed is invalid or has expired."}</p>
                </div>
            );
        }

        if (isSubmitted) {
            return (
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                         <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Thank You!</h2>
                    <p className="mt-2 text-gray-600">Your information has been submitted successfully.</p>
                </div>
            );
        }
        
        return (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Company Information</h2>
                    <p className="mt-1 text-gray-600">Please provide a few more details about <span className="font-semibold">{lead.company}</span>.</p>
                </div>
                <div>
                    <label htmlFor="businessSize" className="block text-sm font-medium text-gray-700">Business Size</label>
                    <select id="businessSize" name="businessSize" value={formData.businessSize} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3">
                        <option value="" disabled>Select a size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="500+ employees">500+ employees</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="numberOfBranches" className="block text-sm font-medium text-gray-700">Number of Branches</label>
                    <input type="number" id="numberOfBranches" name="numberOfBranches" value={formData.numberOfBranches} onChange={handleChange} min="0" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-3" placeholder="e.g., 5" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary)] hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                    {isSubmitting ? 'Submitting...' : 'Submit Information'}
                </button>
             </form>
        );
    };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
            <header className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-3xl">Q</span>
                </div>
            </header>
            <main className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                {renderContent()}
            </main>
        </div>
    </div>
  );
};
