import React, { useState, useMemo } from 'react';
import { 
  UtensilsCrossed, 
  Plus, 
  ChefHat, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Hash, 
  MessageSquare,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Recipe, InventoryItem, ConsumptionLog, UserRole } from '../types';

interface ConsumptionProps {
  consumption: ConsumptionLog[];
  setConsumption: React.Dispatch<React.SetStateAction<ConsumptionLog[]>>;
  recipes: Recipe[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  userRole: UserRole;
  darkMode: boolean;
}

export default function Consumption({
  consumption,
  setConsumption,
  recipes,
  inventory,
  setInventory,
  userRole,
  darkMode
}: ConsumptionProps) {

  // Form State
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [servingsMultiplier, setServingsMultiplier] = useState(5);
  const [staffLogger, setStaffLogger] = useState('Chef Marcus');
  const [sessionNotes, setSessionNotes] = useState('');

  // Dropdown list
  const activeRecipe = useMemo(() => {
    return recipes.find(r => r.id === selectedRecipeId);
  }, [recipes, selectedRecipeId]);

  // Portions checklist of raw inventory that WILL be reduced
  const requiredMaterialsPreview = useMemo(() => {
    if (!activeRecipe) return [];
    
    return activeRecipe.ingredients.map(ing => {
      const dbItem = inventory.find(i => i.id === ing.itemId);
      const totalQtyRequired = Number((ing.requiredQty * servingsMultiplier).toFixed(3));
      
      const isShortage = dbItem ? dbItem.stockQty < totalQtyRequired : true;
      const marginDeficit = dbItem ? Math.max(0, totalQtyRequired - dbItem.stockQty) : totalQtyRequired;

      return {
        itemId: ing.itemId,
        name: dbItem ? dbItem.name : 'Unknown Food asset',
        currentBalance: dbItem ? dbItem.stockQty : 0,
        unit: dbItem ? dbItem.unit : 'units',
        requiredQty: totalQtyRequired,
        isShortage,
        shortageVal: Number(marginDeficit.toFixed(2))
      };
    });
  }, [activeRecipe, servingsMultiplier, inventory]);

  // Overall check of stock levels before cook
  const hasShortageAlert = requiredMaterialsPreview.some(mat => mat.isShortage);

  // Submit Logger
  const handleLogConsumption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipeId || !activeRecipe) {
      alert('Must select a standard menu dish recipe formulation.');
      return;
    }

    if (hasShortageAlert) {
      if (!confirm('Warning: Selected crop values exceed current stored vault balance! Log this prep output anyway? (Stock levels will dip below zero)')) {
        return;
      }
    }

    // Capture reducing specs for history ledger
    const reducedItemsList = requiredMaterialsPreview.map(mat => ({
      itemId: mat.itemId,
      itemName: mat.name,
      qtyReduced: mat.requiredQty,
      unit: mat.unit
    }));

    // Generate log item
    const newLog: ConsumptionLog = {
      id: 'con-' + Date.now(),
      recipeId: selectedRecipeId,
      multiplier: Number(servingsMultiplier),
      loggedBy: staffLogger.trim() || 'Kitchen Chef',
      loggedAt: new Date().toISOString(),
      notes: sessionNotes.trim() || undefined,
      reducedItems: reducedItemsList
    };

    // Auto reduce inventory holdings!
    setInventory(prevInventory => prevInventory.map(item => {
      const recipeRequirement = activeRecipe.ingredients.find(ing => ing.itemId === item.id);
      if (recipeRequirement) {
        const totalDeducted = recipeRequirement.requiredQty * servingsMultiplier;
        const finalQty = Math.max(0, item.stockQty - totalDeducted); // do not dip below zero if hard capped, or let go to negative depending on client preferences. Restricting to >=0 is safer, let's stick to 0 or allow direct drop. Let's do a safe max of (0, remainder) or actual negative subtraction indicating deficit. A real saas allows negative stock to show inventory audit leakage!
        return {
          ...item,
          stockQty: parseFloat((item.stockQty - totalDeducted).toFixed(2)), // allow actual relative value drop for audits
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    }));

    setConsumption(prev => [...prev, newLog]);

    // reset Form
    setSelectedRecipeId('');
    setServingsMultiplier(5);
    setSessionNotes('');
    setShowAddLogModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Control Title Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <div className="flex gap-2 items-center text-xs">
          <ChefHat className="h-5 w-5 text-emerald-450" />
          <p className="text-neutral-450">Log prep outputs during food assembly line shifts to trace ingredient drainage indices.</p>
        </div>

        <button
          onClick={() => {
            if (recipes.length > 0) {
              setSelectedRecipeId(recipes[0].id);
            }
            setShowAddLogModal(true);
          }}
          className="flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-saffron-500/15"
        >
          <Plus className="h-4 w-4" /> Log Daily Consumption
        </button>

      </div>

      {/* History timeline log list */}
      <div className="grid grid-cols-1 gap-4">
        {consumption.length === 0 ? (
          <div className={`p-12 text-center text-gray-500 border border-dashed rounded-xl ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <ChefHat className="h-10 w-10 mx-auto opacity-20 mb-2" />
            <p className="text-xs font-sans">No kitchen journal consumption entries historically drafted.</p>
          </div>
        ) : (
          [...consumption].reverse().map((log) => {
            const matchedRecipe = recipes.find(r => r.id === log.recipeId);
            
            return (
              <div 
                key={log.id}
                className={`p-5 rounded-xl border flex flex-col justify-between hover:shadow-md transition-all ${
                  darkMode ? 'bg-charcoal-panel border-white/[0.04]' : 'bg-white border-[#f3ebde]'
                }`}
              >
                {/* Metas overview */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-dashed border-[#f3ebde] dark:border-white/[0.04]">
                  <div className="flex gap-2 items-center">
                    <span className="p-2 rounded bg-cardamom-500/10 text-cardamom-500">
                      <ChefHat className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                        {matchedRecipe ? matchedRecipe.name : 'Unknown Recipe formulation'} 
                        <span className="text-cardamom-650 text-xs ml-1 bg-cardamom-500/10 px-2 py-0.5 rounded font-mono font-extrabold uppercase border border-cardamom-500/10">
                          x{log.multiplier} portions cooked
                        </span>
                      </h4>
                      <p className="text-[10px] text-neutral-450 font-sans mt-0.5">By <strong>{log.loggedBy}</strong> • ID: {log.id}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-neutral-450 flex items-center gap-1.5 self-start md:self-auto">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(log.loggedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} • {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* notes */}
                {log.notes && (
                  <p className="text-xs italic text-neutral-450 mt-3 p-2.5 rounded bg-neutral-500/5 border-l-2 border-emerald-500/45 font-mono">
                     "{log.notes}"
                  </p>
                )}

                {/* Stock reductions list */}
                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase font-bold text-neutral-400 mb-2 tracking-wide flex items-center gap-1"><FileSpreadsheet className="h-3.5 w-3.5" /> Auto-Reduced Stock Deductions index:</p>
                  <div className="flex flex-wrap gap-2">
                    {log.reducedItems.map((item) => (
                      <span 
                        key={item.itemId}
                        className={`px-3 py-1.5 rounded-lg text-[11px] border font-sans hover:shadow-xs transition-shadow ${
                          darkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-600'
                        }`}
                      >
                        {item.itemName}: <strong className="text-red-500">-{item.qtyReduced} {item.unit}</strong>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>


      {/* MODAL WINDOW: RECORD THE CONSUMPTION BATCH EXPORT */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl transition-all ${
            darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">Record Production Output</h3>
            <p className="text-xs text-neutral-450 mb-4 font-sans">Submit portions count below to auto-reduce related ingredient holdings catalog balances instantly.</p>

            <form onSubmit={handleLogConsumption} className="space-y-4 text-xs font-sans">
              
              {/* Select recipe */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Target Dish Formulation</label>
                <select
                  required
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none focus:border-emerald-500 cursor-pointer ${
                    darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  {recipes.map(recipe => (
                    <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                  ))}
                </select>
              </div>

              {/* multiplier portion count */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-450 mb-1">Portions cooked / Prep Multiplier</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={servingsMultiplier}
                    onChange={(e) => setSelectedRecipeId && setServingsMultiplier(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className={`w-16 text-center py-1.5 rounded-md font-mono font-bold border text-sm ${darkMode ? 'bg-black/20 border-white/5 text-emerald-450' : 'bg-neutral-50 border-neutral-200 text-orange-500'}`}>
                    x {servingsMultiplier}
                  </span>
                </div>
              </div>

              {/* Staff Logger select */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Plating Log Author (Staff)</label>
                <input
                  type="text"
                  required
                  value={staffLogger}
                  onChange={(e) => setStaffLogger(e.target.value)}
                  placeholder="e.g. Head Cook Marcus"
                  className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                    darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              {/* Session notes */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Production notes (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 pt-2.5 text-neutral-500"><MessageSquare className="h-3.5 w-3.5" /></span>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="e.g. Plated dinner rush table reservations."
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              {/* Reduced checklist preview */}
              <div className="mt-4 border-t border-dashed border-neutral-700/50 pt-4">
                <h4 className="font-mono text-[10px] uppercase font-bold text-neutral-400 mb-2">Projected Stock Impact checklist:</h4>
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {requiredMaterialsPreview.map(mat => (
                    <div 
                      key={mat.itemId}
                      className={`p-2 rounded border flex justify-between items-center text-[11px] ${
                        mat.isShortage 
                          ? 'border-red-500/30 bg-red-500/5 text-red-500' 
                          : darkMode 
                            ? 'border-white/5 bg-black/20 text-neutral-400' 
                            : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                      }`}
                    >
                      <div>
                        <strong className="block font-sans">{mat.name}</strong>
                        <span className="block text-[9px] font-mono opacity-80">Remaining Balance: {mat.currentBalance} {mat.unit}</span>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-mono font-bold block">-{mat.requiredQty} {mat.unit}</span>
                        {mat.isShortage && (
                          <span className="text-[9px] font-sans font-semibold tracking-wide bg-red-500/10 px-1 py-0.5 rounded uppercase">
                            Deficit Alert: {mat.shortageVal} {mat.unit} short
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insufficient Stock Prompt banner */}
              {hasShortageAlert && (
                <div className="p-3 text-[11px] bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
                  <p>Caution: Storage contains insufficient balance to fulfill this portions target. Outflow will log negative counts.</p>
                </div>
              )}

              {/* Modal triggers */}
              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 rounded-lg text-neutral-450 hover:bg-white/5 cursor-pointer"
                >
                  Discard Log
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-bold cursor-pointer shadow-xl shadow-saffron-500/15 transition-colors"
                >
                  Confirm production batch
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
