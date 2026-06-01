import { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  Database, 
  Activity,
  FlameKindling,
  ChevronRight,
  Home
} from 'lucide-react';

import { 
  INITIAL_CATEGORIES, 
  INITIAL_SUPPLIERS, 
  INITIAL_INVENTORY, 
  INITIAL_PURCHASES, 
  INITIAL_RECIPES, 
  INITIAL_CONSUMPTION, 
  INITIAL_WASTAGE, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Purchases from './components/Purchases';
import Recipes from './components/Recipes';
import Consumption from './components/Consumption';
import Wastage from './components/Wastage';
import Reports from './components/Reports';
import Notifications from './components/Notifications';

import { Category, Supplier, InventoryItem, PurchaseLog, Recipe, ConsumptionLog, WastageLog, AppNotification, UserRole } from './types';

export default function App() {
  
  // 1. Core State Managers (Attempt loading from localStorage first, or fall back to mockData templates)
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('kitchenops_categories');
    if (!saved) return INITIAL_CATEGORIES;
    try {
      const parsed = JSON.parse(saved) as Category[];
      const merged = [...parsed];
      INITIAL_CATEGORIES.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('kitchenops_suppliers');
    if (!saved) return INITIAL_SUPPLIERS;
    try {
      const parsed = JSON.parse(saved) as Supplier[];
      const merged = [...parsed];
      INITIAL_SUPPLIERS.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('kitchenops_inventory');
    if (!saved) return INITIAL_INVENTORY;
    try {
      const parsed = JSON.parse(saved) as InventoryItem[];
      const merged = [...parsed];
      INITIAL_INVENTORY.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [purchases, setPurchases] = useState<PurchaseLog[]>(() => {
    const saved = localStorage.getItem('kitchenops_purchases');
    if (!saved) return INITIAL_PURCHASES;
    try {
      const parsed = JSON.parse(saved) as PurchaseLog[];
      const merged = [...parsed];
      INITIAL_PURCHASES.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_PURCHASES;
    }
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('kitchenops_recipes');
    if (!saved) return INITIAL_RECIPES;
    try {
      const parsed = JSON.parse(saved) as Recipe[];
      const merged = [...parsed];
      INITIAL_RECIPES.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_RECIPES;
    }
  });

  const [consumption, setConsumption] = useState<ConsumptionLog[]>(() => {
    const saved = localStorage.getItem('kitchenops_consumption');
    if (!saved) return INITIAL_CONSUMPTION;
    try {
      const parsed = JSON.parse(saved) as ConsumptionLog[];
      const merged = [...parsed];
      INITIAL_CONSUMPTION.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_CONSUMPTION;
    }
  });

  const [wastage, setWastage] = useState<WastageLog[]>(() => {
    const saved = localStorage.getItem('kitchenops_wastage');
    if (!saved) return INITIAL_WASTAGE;
    try {
      const parsed = JSON.parse(saved) as WastageLog[];
      const merged = [...parsed];
      INITIAL_WASTAGE.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_WASTAGE;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('kitchenops_notifications');
    if (!saved) return INITIAL_NOTIFICATIONS;
    try {
      const parsed = JSON.parse(saved) as AppNotification[];
      const merged = [...parsed];
      INITIAL_NOTIFICATIONS.forEach(item => {
        if (!merged.some(m => m.id === item.id)) {
          merged.push(item);
        }
      });
      return merged;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Theme & Identity configurations
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('kitchenops_darkMode');
    return saved ? saved === 'true' : true; // Default to eye-safe dark mode
  });

  const [userRole, setUserRole] = useState<UserRole>('Owner'); // Default to Enterprise access for full feature exploration
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // 2. Synchronize states with localStorage hooks
  useEffect(() => {
    localStorage.setItem('kitchenops_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kitchenops_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('kitchenops_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('kitchenops_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('kitchenops_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('kitchenops_consumption', JSON.stringify(consumption));
  }, [consumption]);

  useEffect(() => {
    localStorage.setItem('kitchenops_wastage', JSON.stringify(wastage));
  }, [wastage]);

  useEffect(() => {
    localStorage.setItem('kitchenops_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kitchenops_darkMode', String(darkMode));
    // Set document theme helper for transitions
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);


  // 3. Automated check for dynamic low stock warnings
  // If an inventory item stock drops <= reorder level, dynamically spawn notification if it doesn't already exist!
  useEffect(() => {
    inventory.forEach(item => {
      if (item.stockQty <= item.reorderLevel) {
        // Check if there is already an unread, matching alert in notifs to prevent flooding
        const alreadyNotified = notifications.some(
          n => n.type === 'Low Stock' && n.title.includes(item.name) && !n.isRead
        );

        if (!alreadyNotified) {
          const newNotif: AppNotification = {
            id: 'not-auto-' + item.id + '-' + Date.now(),
            type: 'Low Stock',
            title: `Low Stock Safety Deficit: ${item.name}`,
            message: `${item.name} dropped to ${item.stockQty} ${item.unit} (Safety reorder target is ${item.reorderLevel} ${item.unit}). Restock immediately.`,
            timestamp: new Date().toISOString(),
            isRead: false
          };
          setNotifications(prev => [newNotif, ...prev]);
        }
      }
    });
  }, [inventory]);

  const unreadAlertsCount = notifications.filter(n => !n.isRead).length;

  // Render tab mapping
  const renderContentPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            categories={categories}
            inventory={inventory}
            recipes={recipes}
            purchases={purchases}
            consumption={consumption}
            wastage={wastage}
            darkMode={darkMode}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'inventory':
        return (
          <Inventory 
            categories={categories}
            setCategories={setCategories}
            suppliers={suppliers}
            setSuppliers={setSuppliers}
            inventory={inventory}
            setInventory={setInventory}
            userRole={userRole}
            darkMode={darkMode}
          />
        );
      case 'purchases':
        return (
          <Purchases 
            purchases={purchases}
            setPurchases={setPurchases}
            inventory={inventory}
            setInventory={setInventory}
            suppliers={suppliers}
            userRole={userRole}
            darkMode={darkMode}
          />
        );
      case 'recipes':
        return (
          <Recipes 
            recipes={recipes}
            setRecipes={setRecipes}
            inventory={inventory}
            userRole={userRole}
            darkMode={darkMode}
          />
        );
      case 'consumption':
        return (
          <Consumption 
            consumption={consumption}
            setConsumption={setConsumption}
            recipes={recipes}
            inventory={inventory}
            setInventory={setInventory}
            userRole={userRole}
            darkMode={darkMode}
          />
        );
      case 'wastage':
        return (
          <Wastage 
            wastage={wastage}
            setWastage={setWastage}
            inventory={inventory}
            setInventory={setInventory}
            userRole={userRole}
            darkMode={darkMode}
          />
        );
      case 'analytics':
        return (
          <Reports 
            categories={categories}
            inventory={inventory}
            recipes={recipes}
            purchases={purchases}
            consumption={consumption}
            wastage={wastage}
            darkMode={darkMode}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications}
            setNotifications={setNotifications}
            darkMode={darkMode}
          />
        );
      default:
        return <div className="text-sm">Main Tab Not Found</div>;
    }
  };

  // Helper title builder for current view
  const currentTabName = () => {
    switch (currentTab) {
      case 'dashboard': return 'Command Control Center';
      case 'inventory': return 'Inventory Catalog Manager';
      case 'purchases': return 'Wholesale restock accounts';
      case 'recipes': return 'Portions yield costing';
      case 'consumption': return 'Daily Cook Journal logs';
      case 'wastage': return 'Asset write-offs';
      case 'analytics': return 'Reports & API blueprints';
      case 'notifications': return 'Automation Notification Center';
      default: return 'KitchenOps';
    }
  };

  return (
    <div className={`flex w-screen h-screen overflow-hidden text-sans font-sans ${
      darkMode 
        ? 'bg-[#0A0B0D] text-slate-300 dark' 
        : 'bg-neutral-50 text-neutral-800'
    }`}>
      
      {/* Sidebar Core Component navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        unreadCount={unreadAlertsCount}
      />

      {/* Main Workspace Frame container */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Panel bar representing active session data */}
        <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 transition-all ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          {/* Breadcrumb navigator */}
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-[11px] text-neutral-400 font-medium tracking-wide flex items-center gap-1">
              <Home className="h-3 w-3" /> KitchenOps Hub
            </span>
            <ChevronRight className="h-3 w-3 text-neutral-500" />
            <span className="text-xs font-bold text-neutral-800 dark:text-white truncate max-w-xs">{currentTabName()}</span>
          </div>

          {/* Quick Stats overview panel */}
          <div className="flex items-center gap-4">
            
            {/* Quick alert badge locator */}
            <button 
              onClick={() => setCurrentTab('notifications')}
              className={`p-2 rounded-xl relative border transition-all hover:scale-105 cursor-pointer ${
                darkMode 
                  ? 'border-white/5 hover:bg-white/5 text-slate-350' 
                  : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
              }`}
              title="Open Notification Feed"
            >
              <Bell className="h-4 w-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-sans text-[8px] font-bold h-3.5 w-3.5 flex items-center justify-center rounded-full border-2 border-inherit animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Simulated Live Connection index */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono leading-none ${
              darkMode ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400' : 'bg-green-500/10 border-green-500/10 text-green-600'
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Active</span>
            </div>

          </div>
        </header>

        {/* Scrollable Work bench canvas */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          {renderContentPage()}
        </main>

      </div>

    </div>
  );
}
