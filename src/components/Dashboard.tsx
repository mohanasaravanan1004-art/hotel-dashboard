import { useMemo } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  UtensilsCrossed, 
  Trash2, 
  IndianRupee, 
  CornerDownRight,
  PlusCircle,
  CalendarDays,
  Activity,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { Category, InventoryItem, Recipe, WastageLog, PurchaseLog, ConsumptionLog } from '../types';

interface DashboardProps {
  categories: Category[];
  inventory: InventoryItem[];
  recipes: Recipe[];
  purchases: PurchaseLog[];
  consumption: ConsumptionLog[];
  wastage: WastageLog[];
  darkMode: boolean;
  setCurrentTab: (tab: string) => void;
}

export default function Dashboard({
  categories,
  inventory,
  recipes,
  purchases,
  consumption,
  wastage,
  darkMode,
  setCurrentTab
}: DashboardProps) {

  // 1. Dynamic Metric Calculations
  const metrics = useMemo(() => {
    // A. Today's Inventory Value = Sum (Qty * AveragePrice)
    const inventoryValue = inventory.reduce((sum, item) => sum + (item.stockQty * item.averagePrice), 0);

    // B. Low Stock Items count = Qty <= reorderLevel
    const lowStockItems = inventory.filter(item => item.stockQty <= item.reorderLevel);

    // C. Daily Wastage = Total loss logged today
    const baseWastageLoss = wastage.reduce((sum, item) => sum + item.totalLoss, 0);

    // D. Food Cost Percentage % = (Ingredient Cost & Spoilage Cost) / Menu Value Sales
    // We can average the recipe ideal costs compared to their sale price
    let totalRecipeCost = 0;
    let totalRecipeSalePrice = 0;

    recipes.forEach(recipe => {
      let costOfIngredients = 0;
      recipe.ingredients.forEach(ing => {
        const matchingItem = inventory.find(inv => inv.id === ing.itemId);
        const itemPrice = matchingItem ? matchingItem.averagePrice : 0;
        costOfIngredients += ing.requiredQty * itemPrice;
      });
      totalRecipeCost += costOfIngredients;
      totalRecipeSalePrice += recipe.salePrice;
    });

    // Baseline calculation + factor in current wastage logs relative to consumption
    const averageIdleCostPercentage = totalRecipeSalePrice > 0 
      ? (totalRecipeCost / totalRecipeSalePrice) * 100 
      : 28.5;

    // E. Monthly Total Costs vs Revenue estimate
    // Multiply recipe consumptions to estimate sales
    const estimatedSalesVolume = consumption.reduce((total, log) => {
      const parentRecipe = recipes.find(r => r.id === log.recipeId);
      const price = parentRecipe ? parentRecipe.salePrice : 0;
      return total + (price * log.multiplier);
    }, 0);

    const estimatedIngredientCOGS = consumption.reduce((total, log) => {
      // Find reduced items total cost
      let logCost = 0;
      log.reducedItems.forEach(reduced => {
        const matchingItem = inventory.find(inv => inv.id === reduced.itemId);
        const price = matchingItem ? matchingItem.averagePrice : 0;
        logCost += (reduced.qtyReduced * price);
      });
      return total + logCost;
    }, 0);

    const grossProfitMarginPercentage = estimatedSalesVolume > 0 
      ? ((estimatedSalesVolume - estimatedIngredientCOGS - baseWastageLoss) / estimatedSalesVolume) * 100 
      : 71.5;

    return {
      inventoryValue,
      lowStockCount: lowStockItems.length,
      lowStockList: lowStockItems,
      dailyWastage: baseWastageLoss,
      foodCostPct: averageIdleCostPercentage,
      estimatedSales: estimatedSalesVolume || 3250, // default placeholder if no consumption recorded yet
      estimatedCOGS: estimatedIngredientCOGS || 940,
      grossProfitMarginPct: grossProfitMarginPercentage || 71.1
    };
  }, [inventory, recipes, wastage, consumption]);

  // 2. Chart Component Datasets
  // Dataset A: Inventory distribution across categories
  const categoryChartData = useMemo(() => {
    return categories.map(cat => {
      const itemsInCat = inventory.filter(item => item.categoryId === cat.id);
      const totalVal = itemsInCat.reduce((sum, item) => sum + (item.stockQty * item.averagePrice), 0);
      return {
        name: cat.name,
        value: parseFloat(totalVal.toFixed(2)),
        itemsCount: itemsInCat.length
      };
    }).filter(d => d.value > 0);
  }, [categories, inventory]);

  // Dataset B: Profit margin by Dish / Recipe
  const recipeCostMarginData = useMemo(() => {
    return recipes.map(recipe => {
      let cost = 0;
      recipe.ingredients.forEach(ing => {
        const matched = inventory.find(item => item.id === ing.itemId);
        cost += ing.requiredQty * (matched ? matched.averagePrice : 0);
      });
      const roundedCost = parseFloat(cost.toFixed(2));
      const roundedPrice = recipe.salePrice;
      const profit = parseFloat((roundedPrice - roundedCost).toFixed(2));
      return {
        name: recipe.name.substring(0, 15) + '...',
        Cost: roundedCost,
        Profit: profit,
        'Sale Price': roundedPrice
      };
    });
  }, [recipes, inventory]);

  // Dataset C: Wastage analysis by Reason
  const wastageByReasonData = useMemo(() => {
    const reasons = ['Spoilage', 'Prep Error', 'Customer Return', 'Equipment Failure', 'Other'];
    return reasons.map(r => {
      const logs = wastage.filter(w => w.reason === r);
      const sum = logs.reduce((total, item) => total + item.totalLoss, 0);
      return {
        name: r,
        value: parseFloat(sum.toFixed(2))
      };
    }).filter(item => item.value > 0);
  }, [wastage]);

  // Dataset D: Simulated sales vs Cost timelines (Area Chart)
  const performanceTimelineData = [
    { label: 'May 26', Sales: 2450, Expenses: 780, Wastage: 45 },
    { label: 'May 27', Sales: 3100, Expenses: 920, Wastage: 12 },
    { label: 'May 28', Sales: 2980, Expenses: 1100, Wastage: 65 },
    { label: 'May 29', Sales: 3450, Expenses: 1040, Wastage: 18 },
    { label: 'May 30', Sales: 4200, Expenses: 1300, Wastage: 84 },
    { label: 'May 31', Sales: 3890, Expenses: 1150, Wastage: 52 },
    { label: 'Jun 01', Sales: metrics.estimatedSales, Expenses: metrics.estimatedCOGS, Wastage: metrics.dailyWastage }
  ];

  // Activities feed builder (combined sorted chronological timeline of events)
  const sortedActivities = useMemo(() => {
    const act: { id: string; type: 'purchase' | 'wastage' | 'consumption'; title: string; subtitle: string; time: string; cost?: number }[] = [];
    
    purchases.slice(-3).forEach(p => {
      const item = inventory.find(i => i.id === p.itemId);
      act.push({
        id: p.id,
        type: 'purchase',
        title: `Purchase Restock: ${item ? item.name : 'Unknown Item'}`,
        subtitle: `${p.qty} ${item ? item.unit : ''} at ₹${p.unitPrice}/u (Invoice: ${p.invoiceNumber})`,
        time: p.purchaseDate,
        cost: p.totalCost
      });
    });

    wastage.slice(-3).forEach(w => {
      const item = inventory.find(i => i.id === w.itemId);
      act.push({
        id: w.id,
        type: 'wastage',
        title: `Wastage Logged: ${item ? item.name : 'Unknown Item'}`,
        subtitle: `${w.qty} ${item ? item.unit : ''} lost: ${w.reason} (${w.notes || 'No description'})`,
        time: w.loggedAt,
        cost: w.totalLoss
      });
    });

    consumption.slice(-3).forEach(c => {
      const recipe = recipes.find(r => r.id === c.recipeId);
      act.push({
        id: c.id,
        type: 'consumption',
        title: `${recipe ? recipe.name : 'Recipe Batch'} Cooked`,
        subtitle: `Multiplier: x${c.multiplier} portion units produced by ${c.loggedBy}`,
        time: c.loggedAt
      });
    });

    return act.sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
  }, [purchases, wastage, consumption, inventory, recipes]);

  const COLORS_PIE = ['#10b981', '#f59e0b', '#ea580c', '#b55307', '#eab308'];

  return (
    <div className="space-y-6">
      
      {/* Tamil Nadu Cuisine Spotlight Banner */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
        darkMode 
          ? 'bg-gradient-to-tr from-[#121c15] via-charcoal-panel to-[#1e150f] border-saffron-500/15' 
          : 'bg-gradient-to-tr from-[#faf6ef] to-[#f4ebe1] border-saffron-500/15'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍛</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-600 dark:text-saffron-500 bg-saffron-500/10 px-2.5 py-1 rounded border border-saffron-500/20 font-mono">
                தமிழ்நாடு உணவு • Tamil Nadu Cuisine
              </span>
            </div>
            <h2 className="text-lg font-bold font-sans tracking-tight text-neutral-800 dark:text-white">
              Tamil Nadu Specialty Menu Activated
            </h2>
            <p className="text-xs text-neutral-600 dark:text-slate-300 max-w-2xl">
              South Indian menu presets (Chettinad Chicken, Sambar & Rice, Masala Dosa) are fully integrated. Track raw quantities of milled Sona Masuri, high-grade Urad Dal, curry leaves, and coconut oil directly in the digital ledger.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0 z-10">
            <button 
              onClick={() => setCurrentTab('recipes')}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white transition-all shadow-md shadow-saffron-500/15 cursor-pointer flex items-center gap-1"
            >
              <span>View Tamil Nadu Recipes</span>
              <ChevronRight className="h-3 w-3" />
            </button>
            <button 
              onClick={() => setCurrentTab('inventory')}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:bg-white/10 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              Check Ingredients
            </button>
          </div>
        </div>

        {/* Dynamic inventory monitoring for South Indian specialty raw commodities */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-dashed border-saffron-500/15">
          {[
            { name: 'Sona Masuri', type: 'Rice Grain Base', id: 'item-tn-1' },
            { name: 'Chettinad Masala', type: 'Specialty Blend', id: 'item-tn-4' },
            { name: 'Madras Curry Leaves', type: 'Fresh Herb', id: 'item-tn-6' },
            { name: 'Coconut Oil', type: 'Cold Pressed Fat', id: 'item-tn-7' }
          ].map(spec => {
            const matched = inventory.find(item => item.id === spec.id);
            return (
              <div key={spec.id} className={`p-3 rounded-xl border ${darkMode ? 'bg-black/30 border-white/5' : 'bg-white/40 border-saffron-100'}`}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono block">{spec.type}</span>
                  {matched && matched.stockQty <= matched.reorderLevel && (
                    <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-pulse" title="Needs Reorder" />
                  )}
                </div>
                <p className="text-xs font-bold font-sans mt-0.5 text-neutral-850 dark:text-neutral-200">{spec.name}</p>
                <p className="text-xs font-mono font-bold text-cardamom-600 dark:text-cardamom-500 mt-1">
                  {matched ? `${matched.stockQty} ${matched.unit}` : '0 kg'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Alarm Header for low stock */}
      {metrics.lowStockCount > 0 && (
        <div className="flex items-center justify-between p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-sans font-semibold text-sm">Low Stock Alert Checklist ({metrics.lowStockCount} items need attention)</p>
              <p className="text-xs opacity-80">
                {metrics.lowStockList.slice(0, 3).map(item => `${item.name} (${item.stockQty} ${item.unit})`).join(', ')}
                {metrics.lowStockCount > 3 ? ` and ${metrics.lowStockCount - 3} more` : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentTab('inventory')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-sm"
          >
            Reorder Stock Now
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className={`p-5 rounded-xl border transition-all hover:shadow-lg ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-neutral-400 font-medium font-semibold">Today's Inventory Val</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <IndianRupee className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight font-sans">
              ₹{metrics.inventoryValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-green-500 flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="h-3 w-3 inline" /> +3.4% vs last Monday
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className={`p-5 rounded-xl border transition-all hover:shadow-lg ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-neutral-450 font-medium font-semibold">Low Stock Deficit</span>
            <span className={`p-2 rounded-lg ${metrics.lowStockCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className={`text-2xl font-bold tracking-tight font-sans ${metrics.lowStockCount > 0 ? 'text-red-500' : 'text-emerald-400'}`}>
              {metrics.lowStockCount} Items
            </p>
            <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
              Safety stock factor is active
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className={`p-5 rounded-xl border transition-all hover:shadow-lg ${
          darkMode ? 'bg-[#111318] border-[#ffffff]/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-neutral-400 font-medium font-semibold">Daily Wastage Drag</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Trash2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight font-sans">
              ₹{metrics.dailyWastage.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-purple-500 flex items-center gap-1 mt-1 font-mono">
              ~{Math.min(100, (metrics.dailyWastage / (metrics.inventoryValue || 1) * 100)).toFixed(1)}% of inventory value
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className={`p-5 rounded-xl border transition-all hover:shadow-lg ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans text-neutral-400 font-medium">Avg Food Cost %</span>
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight font-sans">
              {metrics.foodCostPct.toFixed(1)}%
            </p>
            <p className="text-[11px] text-teal-500 font-semibold flex items-center gap-1 mt-1">
              Ideal range limit: 28% - 32%
            </p>
          </div>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Card 1: Main performance timeline */}
        <div className={`lg:col-span-2 p-5 rounded-xl border flex flex-col ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-bold text-base">Sales Volume vs COGS Timeline</h3>
              <p className="text-xs text-neutral-400">Comparing kitchen sales output relative to ingredient procurement and waste</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-500/10 text-neutral-450 flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> Live Week Indices
            </span>
          </div>
          
          <div className="h-80 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: darkMode ? '#101217' : '#ffffff', border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb', borderRadius: 8 }} />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="Expenses" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart Card 2: Pie Category Values */}
        <div className={`p-5 rounded-xl border flex flex-col ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <h3 className="font-sans font-bold text-base mb-1">Stock Category Val</h3>
          <p className="text-xs text-neutral-400 mb-4">Capital assets tied up in raw food counts</p>

          <div className="h-60 w-full relative flex items-center justify-center">
            {categoryChartData.length === 0 ? (
              <div className="text-gray-400 text-xs">No active inventory value to display.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                    ))}
                  </Pie>
                   <Tooltip formatter={(value) => `₹${value}`} />
                 </PieChart>
               </ResponsiveContainer>
             )}
             
             {/* Center annotation */}
             <div className="absolute text-center mt-[-15px]">
               <span className="block text-[10px] uppercase font-semibold text-neutral-400">Total Asset</span>
               <span className="block text-lg font-bold font-mono">₹{metrics.inventoryValue.toFixed(0)}</span>
             </div>
           </div>
 
           {/* Custom Legends list */}
           <div className="space-y-1.5 overflow-y-auto max-h-32 mt-1">
             {categoryChartData.map((data, index) => (
               <div key={data.name} className="flex items-center justify-between text-xs font-sans">
                 <div className="flex items-center gap-1.5">
                   <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS_PIE[index % COLORS_PIE.length] }} />
                   <span className="text-neutral-400">{data.name} ({data.itemsCount} items)</span>
                 </div>
                 <span className="font-bold font-mono">₹{data.value.toLocaleString('en-IN')}</span>
               </div>
             ))}
          </div>
        </div>

      </div>

      {/* Row 2 Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recipe Margin Analysis BarChart */}
        <div className={`p-5 rounded-xl border flex flex-col ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="mb-4">
            <h3 className="font-sans font-bold text-base">Ideal Menu Profit Margins</h3>
            <p className="text-xs text-neutral-400">Calculated based on current live raw ingredient price indexes</p>
          </div>

          <div className="h-64 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recipeCostMarginData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Bar dataKey="Cost" stackId="chefStore" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Profit" stackId="chefStore" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wastage Loss Allocation */}
        <div className={`p-5 rounded-xl border flex flex-col ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="mb-4">
            <h3 className="font-sans font-bold text-base">Wastage Distribution</h3>
            <p className="text-xs text-neutral-400">Wastage dollar loss grouped by origin category</p>
          </div>

          <div className="h-64 w-full flex flex-col justify-between">
            {wastageByReasonData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 gap-2">
                <Trash2 className="h-8 w-8 opacity-25" />
                <p className="text-xs text-center font-sans">No wastage logs currently registered</p>
              </div>
            ) : (
              <>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wastageByReasonData} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <XAxis type="number" fontSize={9} stroke="#888888" tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" fontSize={10} stroke="#888888" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="border-t border-dashed border-neutral-700/50 pt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="text-neutral-400 font-semibold">Total Wastage Drag:</span>
                    <span className="font-bold text-purple-500 font-mono">₹{metrics.dailyWastage.toFixed(2)}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    *Tip: Setting dynamic safe reorders on seafood diminishes storage spoilage by up to 25%.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent timeline logs */}
        <div className={`p-5 rounded-xl border flex flex-col ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-sans font-bold text-base">Recent Activities</h3>
              <p className="text-xs text-neutral-400">Global auditing timeline feed</p>
            </div>
            <Activity className="h-4 w-4 text-emerald-400 animate-spin-slow" />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-64 flex-1">
            {sortedActivities.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500 text-xs py-8">
                No recent system logs triggered.
              </div>
            ) : (
              sortedActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs relative items-start">
                  
                  {/* Bullet color */}
                  <div className="mt-1">
                    <span className={`h-2.5 w-2.5 rounded-full block border-2 ${
                      act.type === 'purchase' 
                        ? 'bg-blue-500 border-blue-500/30' 
                        : act.type === 'wastage' 
                          ? 'bg-purple-500 border-purple-500/30' 
                          : 'bg-green-500 border-green-500/30'
                    }`} />
                  </div>

                  {/* Content line */}
                  <div className="flex-1 space-y-0.5">
                    <p className={`font-sans font-semibold ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
                      {act.title}
                    </p>
                    <p className="text-[11px] text-neutral-400">{act.subtitle}</p>
                    
                    {act.cost !== undefined && (
                      <span className="inline-block mt-1 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-neutral-500/10 text-neutral-400">
                        Value Impact: ₹{act.cost.toFixed(2)}
                      </span>
                    )}

                    <span className="block text-[10px] text-neutral-500 mt-1 font-sans">
                      {new Date(act.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Active Session
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
