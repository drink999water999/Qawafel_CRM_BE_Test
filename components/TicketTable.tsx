
import React, { useMemo } from 'react';
import { Ticket, TicketStatus, Retailer, Vendor, UserType } from '../types.ts';

interface TicketTableProps {
  tickets: Ticket[];
  retailers: Retailer[];
  vendors: Vendor[];
  onViewDetails: (ticket: Ticket) => void;
  onStatusChange: (ticket: Ticket, newStatus: TicketStatus) => void;
}

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.Open: return 'bg-blue-500/10 text-blue-400';
    case TicketStatus.InProgress: return 'bg-yellow-500/10 text-yellow-400';
    case TicketStatus.Closed: return 'bg-slate-500/10 text-slate-400';
    default: return 'bg-gray-500/10 text-gray-400';
  }
};

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, retailers, vendors, onViewDetails, onStatusChange }) => {
  const userMap = useMemo(() => {
    const map = new Map<string, { name: string }>();
    retailers.forEach(r => map.set(`${UserType.Retailer}-${r.id}`, { name: r.name }));
    vendors.forEach(v => map.set(`${UserType.Vendor}-${v.id}`, { name: v.name }));
    return map;
  }, [retailers, vendors]);

  return (
    <div className="bg-[--bg-dark-secondary] border border-[--border-dark] shadow-lg rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-[--border-dark]">
        <thead className="bg-black/20">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">Submitted By</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">Created</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--text-secondary] uppercase tracking-wider">Status</th>
            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[--border-dark]">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-white/5 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[--text-primary]">{ticket.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[--text-secondary]">{userMap.get(`${ticket.userType}-${ticket.userId}`)?.name || 'Unknown User'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[--text-secondary]">{ticket.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[--text-secondary]">{ticket.createdAt}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                 <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => onViewDetails(ticket)} className="text-[--accent-primary] hover:text-teal-300 font-bold">
                  View
                </button>
                <select
                    value={ticket.status}
                    onChange={(e) => onStatusChange(ticket, e.target.value as TicketStatus)}
                    className="text-sm rounded border-[--border-dark] bg-[--bg-dark-secondary] focus:ring-[--accent-primary] focus:border-[--accent-primary]"
                >
                    <option value={TicketStatus.Open}>Open</option>
                    <option value={TicketStatus.InProgress}>In Progress</option>
                    <option value={TicketStatus.Closed}>Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};