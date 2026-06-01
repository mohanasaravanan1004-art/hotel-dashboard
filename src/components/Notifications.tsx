import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Mail, 
  Sparkles,
  RefreshCw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  darkMode: boolean;
}

export default function Notifications({
  notifications,
  setNotifications,
  darkMode
}: NotificationsProps) {

  const [activeFilter, setActiveFilter] = useState<'All' | 'Unread'>('All');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeFilter === 'Unread') return !n.isRead;
      return true;
    });
  }, [notifications, activeFilter]);

  // Mark single as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id) return { ...n, isRead: true };
      return n;
    }));
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Clear single
  const handleClearNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Generate simulated Daily Summary notification
  const triggerDailySummarySim = () => {
    const newNotif: AppNotification = {
      id: 'not-' + Date.now(),
      type: 'Report',
      title: 'Daily General Operations Summary',
      message: 'Summary calculated: Gastronomy outflow $940 | Spoilage written off $14.68 | Margin healthy at 71.5%. Plating operations finished smoothly.',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Generate simulated Weekly summary notification
  const triggerWeeklySummarySim = () => {
    const newNotif: AppNotification = {
      id: 'not-' + Date.now(),
      type: 'Report',
      title: 'Weekly Performance Audit',
      message: 'Weekly recap: Plated 48 dishes | Procured $1,452.00 raw stocks | Wastage reduced by 8% overall. Excellent yield optimizations registered.',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <div className="space-y-6">

      {/* Control row with trigger helpers */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
      }`}>
        <div>
          <h3 className="font-sans font-bold text-base mb-1 flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-400 animate-swing" /> Operations Automation Alert Core
          </h3>
          <p className="text-xs text-neutral-450">Simulates automatic systems scheduling summaries for easy monitoring.</p>
        </div>

        {/* Trigger buttons simulating daily/weekly updates */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={triggerDailySummarySim}
            className="flex items-center gap-1 bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-350 border border-neutral-700/50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-sans"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" /> Trigger Daily Summary
          </button>
          
          <button
            onClick={triggerWeeklySummarySim}
            className="flex items-center gap-1 bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-350 border border-neutral-700/50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-sans"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400" /> Trigger Weekly Digest
          </button>
        </div>
      </div>

      {/* Sub Filter Navigator */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-3 py-1.5 rounded-lg border cursor-pointer font-bold transition-all ${
              activeFilter === 'All'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                : darkMode ? 'bg-[#111318] border-white/5 text-slate-450 hover:bg-white/5' : 'bg-white border-neutral-200 text-neutral-600'
            }`}
          >
            All Messages ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('Unread')}
            className={`px-3 py-1.5 rounded-lg border cursor-pointer font-bold transition-all ${
              activeFilter === 'Unread'
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                : darkMode ? 'bg-[#111318] border-white/5 text-slate-455 hover:bg-white/5' : 'bg-white border-neutral-200 text-neutral-600'
            }`}
          >
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>

        {notifications.some(n => !n.isRead) ? (
          <button
            onClick={handleMarkAllRead}
            className="text-emerald-450 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <Check className="h-4 w-4" /> Mark all as read
          </button>
        ) : (
          <span className="text-neutral-500 font-mono text-[10px]">All alarms verified.</span>
        )}
      </div>

      {/* Main notifications log listing */}
      <div className="space-y-3 font-sans">
        {filteredNotifications.length === 0 ? (
          <div className={`p-16 text-center text-neutral-500 border border-dashed rounded-xl ${darkMode ? 'border-white/5' : 'border-neutral-250'}`}>
            <Bell className="h-10 w-10 mx-auto opacity-15 mb-2" />
            <p className="text-xs">Congratulations! No outstanding alarms catalogged inside the kitchen loop.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.isRead;
            
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border flex justify-between items-start gap-4 hover:shadow-md transition-all ${
                  isUnread 
                    ? darkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-500/5 border-emerald-500/10'
                    : darkMode ? 'bg-[#111318] border-white/5 text-slate-400' : 'bg-white border-neutral-200'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  {/* Category icon */}
                  <span className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                    notif.type === 'Low Stock' 
                      ? 'bg-rose-500/10 text-rose-500' 
                      : notif.type === 'Wastage Warning' 
                        ? 'bg-purple-500/10 text-purple-500' 
                        : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {notif.type === 'Low Stock' ? <AlertTriangle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </span>

                  <div>
                    <h4 className={`text-sm font-sans font-bold flex items-center gap-2 ${
                      isUnread 
                        ? darkMode ? 'text-white' : 'text-neutral-900'
                        : 'text-neutral-450'
                    }`}>
                      {notif.title}
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{notif.message}</p>
                    
                    <span className="block text-[10px] text-neutral-500 font-mono mt-2">
                      {new Date(notif.timestamp).toLocaleDateString()} {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • System Automated
                    </span>
                  </div>
                </div>

                {/* Operations tools */}
                <div className="flex items-center gap-1">
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1 px-2 text-[10px] bg-emerald-500 text-white rounded font-bold hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm animate-pulse"
                      title="Mark as read"
                    >
                      Verify Alert
                    </button>
                  )}
                  <button
                    onClick={() => handleClearNotif(notif.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-neutral-450 hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove alert entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
