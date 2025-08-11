import React from 'react';
import { Activity, ActivityIcon as ActivityIconType } from '../types.ts';

const timeAgo = (timestamp: number): string => {
    const now = Date.now();
    const secondsPast = (now - timestamp) / 1000;

    if (secondsPast < 60) {
        const roundedSecs = Math.round(secondsPast);
        return `${roundedSecs}s ago`;
    }
    if (secondsPast < 3600) {
        const roundedMins = Math.round(secondsPast / 60);
        return `${roundedMins}m ago`;
    }
    if (secondsPast <= 86400) {
        const roundedHours = Math.round(secondsPast / 3600);
        return `${roundedHours}h ago`;
    }
    const days = Math.round(secondsPast / 86400);
    if (days < 7) {
        return `${days}d ago`;
    }
    const weeks = Math.round(days / 7);
    if (weeks < 5) {
        return `${weeks}w ago`;
    }
    return new Date(timestamp).toLocaleDateString();
};

const ActivityIcon: React.FC<{ icon: ActivityIconType }> = ({ icon }) => {
    let path = '';
    let color = 'text-gray-400';
    switch(icon) {
        case 'user-plus': path = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"; color="text-green-500"; break;
        case 'clipboard': path = "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"; color="text-yellow-500"; break;
        case 'envelope': path = "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"; color="text-blue-500"; break;
        case 'user-x': path = "M13 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z M20 21l-5-5m0-5l5 5"; color="text-red-500"; break;
        default: path = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"; break;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} /></svg>;
}

export const ActivityFeed: React.FC<{activities: Activity[]}> = ({ activities }) => {
  return (
    <div className="bg-white border border-[var(--border-color)] rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-dark)]">Recent Activity</h2>
      <ul className="space-y-4">
        {activities.slice(0, 5).map((activity) => (
          <li key={activity.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0 pt-1 bg-gray-100 p-2 rounded-full">
              <ActivityIcon icon={activity.icon} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-dark)]">{activity.text}</p>
              <p className="text-xs text-[var(--text-light)]">{timeAgo(activity.timestamp)}</p>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
            <p className="text-sm text-center text-gray-500 py-4">No recent activity.</p>
        )}
      </ul>
    </div>
  );
};
