import { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  ShoppingBag, 
  BookOpen, 
  Utensils, 
  Trash2, 
  BarChart3, 
  Bell, 
  User, 
  Sun, 
  Moon, 
  Sparkles,
  ShieldAlert,
  ClipboardList,
  FlameKindling
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  unreadCount: number;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  darkMode,
  setDarkMode,
  unreadCount
}: SidebarProps) {
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['Owner', 'Manager', 'Staff'] },
    { id: 'inventory', name: 'Inventory Management', icon: Layers, roles: ['Owner', 'Manager', 'Staff'] },
    { id: 'purchases', name: 'Purchase Logs', icon: ShoppingBag, roles: ['Owner', 'Manager'] },
    { id: 'recipes', name: 'Recipe Costing', icon: BookOpen, roles: ['Owner', 'Manager', 'Staff'] },
    { id: 'consumption', name: 'Kitchen Journal', icon: Utensils, roles: ['Owner', 'Manager', 'Staff'] },
    { id: 'wastage', name: 'Wastage Control', icon: Trash2, roles: ['Owner', 'Manager'] },
    { id: 'analytics', name: 'Reports & Audits', icon: BarChart3, roles: ['Owner'] },
  ];

  return (
    <aside className={`w-64 h-screen border-r shrink-0 flex flex-col transition-colors duration-300 ${
      darkMode 
        ? 'bg-charcoal-panel border-white/[0.04] text-slate-300' 
        : 'bg-white border-[#f3ebde] text-neutral-800'
    }`}>
      {/* Brand Header */}
      <div className="p-5 border-b border-inherit flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-saffron-500 to-terracotta-600 text-white flex items-center justify-center shadow-md shadow-saffron-500/15">
            <FlameKindling className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-[14px] leading-tight flex items-center gap-1">
              HotelDashboard <span className="text-[9px] font-mono font-medium px-1 py-0.5 rounded bg-saffron-500/10 text-saffron-500 leading-none">v1.1</span>
            </h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-sans tracking-wide">Tamil Nadu Kitchen Suite</p>
          </div>
        </div>
        
        {/* Dark Mode toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-1.5 rounded-lg transition-colors border ${
            darkMode 
              ? 'border-white/5 hover:bg-white/5 text-[#f59e0b]' 
              : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500'
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Role Profile Box */}
      <div className={`px-4 py-3 mx-4 my-4 rounded-xl border border-dashed text-xs flex flex-col gap-2 relative ${
        darkMode ? 'border-white/10 bg-white/5' : 'border-[#e8dfd5] bg-[#faf8f4]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <User className="h-3.5 w-3.5" />
            <span>Active Role:</span>
          </div>
          <button 
            onClick={() => setShowRoleSelect(!showRoleSelect)}
            className="text-[11px] font-semibold text-saffron-500 hover:text-saffron-600 hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
            userRole === 'Owner' 
              ? 'bg-terracotta-500/10 text-terracotta-650' 
              : userRole === 'Manager' 
                ? 'bg-brass-gold/10 text-saffron-600' 
                : 'bg-cardamom-500/10 text-cardamom-650'
          }`}>
            ✦ {userRole}
          </span>
          <div className="text-[10px] text-slate-400 font-mono">
            {userRole === 'Owner' && 'Enterprise Access'}
            {userRole === 'Manager' && 'Supervisor View'}
            {userRole === 'Staff' && 'Limited Editor'}
          </div>
        </div>

        {/* Change Role overlay popover */}
        {showRoleSelect && (
          <div className={`absolute top-full left-0 right-0 mt-1 p-2 rounded-lg shadow-xl border z-20 transition-all ${
            darkMode ? 'bg-charcoal-panel border-white/[0.04]' : 'bg-white border-[#f3ebde]'
          }`}>
            <p className="font-semibold text-[10px] text-neutral-400 mb-1.5 uppercase tracking-wider px-1">Select Permission Level</p>
            {(['Owner', 'Manager', 'Staff'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setUserRole(role);
                  setShowRoleSelect(false);
                }}
                className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors mb-0.5 cursor-pointer ${
                  userRole === role 
                    ? 'bg-saffron-600 text-white font-bold' 
                    : darkMode 
                      ? 'hover:bg-white/5 text-slate-300' 
                      : 'hover:bg-neutral-100 text-neutral-800'
                }`}
              >
                {role} Panel
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isAllowed = item.roles.includes(userRole);
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAllowed) {
                  setCurrentTab(item.id);
                }
              }}
              disabled={!isAllowed}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-sans font-medium transition-all ${
                !isAllowed 
                  ? 'opacity-35 cursor-not-allowed text-neutral-500' 
                  : isActive
                    ? 'bg-saffron-500/10 text-[#f59e0b] dark:text-saffron-500 font-semibold border-l-2 border-saffron-600 pl-2 rounded-r-lg rounded-l-none'
                    : darkMode 
                      ? 'text-slate-300 hover:bg-white/5 hover:text-white' 
                      : 'text-neutral-650 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#f59e0b] dark:text-saffron-500' : 'text-inherit opacity-85'}`} />
                <span>{item.name}</span>
              </div>
              
              {/* Optional badges/locked symbols */}
              {!isAllowed ? (
                <ShieldAlert className="h-3.5 w-3.5 text-neutral-500" />
              ) : item.id === 'dashboard' && unreadCount > 0 ? (
                <span className="bg-red-500 text-white rounded-full text-[10px] font-bold px-1.5 py-0.5 leading-none shrink-0 border border-neutral-900/5">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Footer information */}
      <div className="p-4 border-t border-inherit">
        <div className={`p-3 rounded-lg border flex flex-col gap-1 ${
          darkMode 
            ? 'bg-[#1b1915] border-saffron-500/10 text-slate-300' 
            : 'bg-[#faf6ef] border-saffron-500/10 text-neutral-600'
        }`}>
          <p className="font-mono text-xs text-saffron-600 dark:text-saffron-500 font-semibold uppercase tracking-wider mb-0.5">Heritage Account</p>
          <p className="text-[11px] leading-relaxed opacity-90">Manage up to 5 locations with your current plan.</p>
        </div>
      </div>
    </aside>
  );
}
