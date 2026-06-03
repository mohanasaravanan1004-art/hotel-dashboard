import React, { useState, useMemo } from 'react';
import { 
  Trash2, 
  Plus, 
  Search, 
  AlertOctagon, 
  IndianRupee, 
  MessageSquare, 
  Activity, 
  Calendar,
  Frown,
  LineChart,
  Grid
} from 'lucide-react';
import { WastageLog, InventoryItem, UserRole } from '../types';

interface WastageProps {
  wastage: WastageLog[];
  setWastage: React.Dispatch<React.SetStateAction<WastageLog[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  userRole: UserRole;
  darkMode: boolean;
}

export default function Wastage({
  wastage,
  setWastage,
  inventory,
  setInventory,
  userRole,
  darkMode
}: WastageProps) {

  // search states
  const [searchTerm, setSearchTerm] = useState('');
  const [reasonFilter, setReasonFilter] = useState('All');

  // New Wastage form State
  const [showAddWastageModal, setShowAddWastageModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [wastageQty, setWastageQty] = useState(1);
  const [wastageReason, setWastageReason] = useState<'Spoilage' | 'Prep Error' | 'Customer Return' | 'Equipment Failure' | 'Other'>('Spoilage');
  const [staffLogger, setStaffLogger] = useState('Sarah J.');
  const [lossNotes, setLossNotes] = useState('');

  const canMutate = userRole === 'Owner' || userRole === 'Manager';

  // Selected item metrics lookup
  const activeItemInModal = useMemo(() => {
    return inventory.find(i => i.id === selectedItemId);
  }, [inventory, selectedItemId]);

  // Handle dynamic dropdown unit cost auto fill
  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
  };

  // Filter List
  const filteredWastage = useMemo(() => {
    return wastage.filter(log => {
      const item = inventory.find(i => i.id === log.itemId);
      const isMatchSearch = item 
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        : log.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const isMatchReason = reasonFilter === 'All' || log.reason === reasonFilter;

      return isMatchSearch && isMatchReason;
    });
  }, [wastage, inventory, searchTerm, reasonFilter]);

  // Aggregate Wastage statistics
  const aggregations = useMemo(() => {
    const sumTotalLoss = wastage.reduce((sum, log) => sum + log.totalLoss, 0);
    const spoilageCount = wastage.filter(w => w.reason === 'Spoilage').length;
    const prepErrCount = wastage.filter(w => w.reason === 'Prep Error').length;

    return {
      sumTotalLoss,
      spoilageCount,
      prepErrCount
    };
  }, [wastage]);

  // Log Form submit handler
  const handleRecordWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;

    if (!selectedItemId) {
      alert('Selected item is required.');
      return;
    }

    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    const qty = Number(wastageQty);
    const pricePerUnit = item.averagePrice;
    const calculatedLossValue = qty * pricePerUnit;

    const newLogItem: WastageLog = {
      id: 'was-' + Date.now(),
      itemId: selectedItemId,
      qty,
      unitPrice: pricePerUnit,
      totalLoss: parseFloat(calculatedLossValue.toFixed(2)),
      reason: wastageReason,
      loggedBy: staffLogger.trim() || 'Staff Auditor',
      loggedAt: new Date().toISOString(),
      notes: lossNotes.trim() || undefined
    };

    // Auto-deduct the wastage quantity from current on-hand holdings!
    setInventory(prevInventory => prevInventory.map(invItem => {
      if (invItem.id === selectedItemId) {
        return {
          ...invItem,
          stockQty: parseFloat(Math.max(0, invItem.stockQty - qty).toFixed(2)), // hard cap at 0 to avoid massive ledger discrepancies on misentries
          lastUpdated: new Date().toISOString()
        };
      }
      return invItem;
    }));

    setWastage(prev => [...prev, newLogItem]);

    // reset fields
    setSelectedItemId('');
    setWastageQty(1);
    setWastageReason('Spoilage');
    setLossNotes('');
    setShowAddWastageModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Statistics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className={`p-5 rounded-xl border flex gap-4 items-center ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <span className="p-3 rounded-lg bg-rose-500/10 text-rose-500">
            <IndianRupee className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-neutral-400 font-sans">Gross Leak Wastage Loss</p>
            <p className="text-xl font-bold font-sans text-rose-500">₹{aggregations.sumTotalLoss.toFixed(2)}</p>
          </div>
        </div>

        <div className={`p-5 rounded-xl border flex gap-4 items-center ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <span className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
            <AlertOctagon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-neutral-400 font-sans">Storage Spoilage Instances</p>
            <p className="text-xl font-bold font-sans text-yellow-500">{aggregations.spoilageCount} Events logged</p>
          </div>
        </div>

        <div className={`p-5 rounded-xl border flex gap-4 items-center ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <span className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <frown className="p-0.5"><Frown className="h-5 w-5" /></frown>
          </span>
          <div>
            <p className="text-xs text-neutral-400 font-sans">Prep Assembly Errors</p>
            <p className="text-sm font-bold font-sans">{aggregations.prepErrCount} Plating instances</p>
          </div>
        </div>

      </div>

      {/* Control row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-450">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search wasted ingredient logs..."
            className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border outline-none font-sans focus:border-emerald-500 transition-colors ${
              darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-white border-neutral-200'
            }`}
          />
        </div>

        {/* Reason filters dropdown */}
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className={`text-xs py-1.5 px-3 rounded-lg border outline-none font-sans focus:border-emerald-500 cursor-pointer ${
            darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-250'
          }`}
        >
            <option value="All">All Reasons</option>
            <option value="Spoilage">Spoilage</option>
            <option value="Prep Error">Prep Error</option>
            <option value="Customer Return">Customer Return</option>
            <option value="Equipment Failure">Equipment Failure</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {canMutate ? (
          <button
            onClick={() => {
              if (inventory.length > 0) {
                handleItemSelect(inventory[0].id);
              }
              setShowAddWastageModal(true);
            }}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-rose-500/10"
          >
            <Plus className="h-4 w-4" /> Record Discard / Wastage
          </button>
        ) : (
          <div className="text-xs text-rose-500 py-1.5 px-3 rounded-md border border-rose-500/10 bg-rose-500/5 font-sans font-medium">
            🔒 View-only permission tier active
          </div>
        )}

      </div>

      {/* Historical logs table */}
      <div className={`border rounded-xl overflow-hidden ${
        darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] uppercase font-bold tracking-wider font-mono border-b ${
                darkMode ? 'bg-[#0a0b0d] border-white/5 text-slate-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
              }`}>
                <th className="py-3.5 px-4">Log Timestamp</th>
                <th className="py-3.5 px-4">Discarded Material</th>
                <th className="py-3.5 px-4">Volume Wasted</th>
                <th className="py-3.5 px-4">Unit Price Factor</th>
                <th className="py-3.5 px-4">Calculated Dollar Loss</th>
                <th className="py-3.5 px-4">Reason Class</th>
                <th className="py-3.5 px-4">Staff auditor</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${darkMode ? 'divide-neutral-850' : 'divide-neutral-100'}`}>
              {filteredWastage.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-sans">
                    No wastage loss cases recorded historically matching these queries.
                  </td>
                </tr>
              ) : (
                [...filteredWastage].reverse().map((log) => {
                  const item = inventory.find(i => i.id === log.itemId);
                  
                  return (
                    <tr key={log.id} className={darkMode ? 'hover:bg-neutral-850' : 'hover:bg-neutral-50'}>
                      
                      {/* DateTime Stamp */}
                      <td className="py-4 px-4 font-mono text-neutral-400">
                        <div className="flex gap-2 items-center">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <div>
                            <span>{new Date(log.loggedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
                            <span className="block text-[10px] font-normal">{new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </td>

                      {/* Discarded Item Details */}
                      <td className="py-4 px-4">
                        <strong className="text-neutral-900 dark:text-neutral-100">{item ? item.name : 'Unknown Food Commodity'}</strong>
                        {log.notes && (
                          <div className="text-[10px] text-neutral-400 bg-neutral-500/5 px-2 py-0.5 rounded border-l border-orange-500/30 mt-1 max-w-sm truncate">
                            ✏️ "{log.notes}"
                          </div>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4 font-bold font-mono text-red-500">
                        -{log.qty} <span className="text-[10px] font-sans font-normal text-neutral-400">{item ? item.unit : ''}</span>
                      </td>

                      {/* Cost margin unit price */}
                      <td className="py-4 px-4 font-mono text-neutral-400">
                        ₹{log.unitPrice.toFixed(2)}/u
                      </td>

                      {/* calculated impact */}
                      <td className="py-4 px-4 font-bold font-mono text-rose-500 text-sm">
                        ₹{log.totalLoss.toFixed(2)}
                      </td>

                      {/* Reason Category badges */}
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                          log.reason === 'Spoilage' 
                            ? 'bg-yellow-500/10 text-yellow-500' 
                            : log.reason === 'Prep Error' 
                              ? 'bg-blue-500/10 text-blue-500' 
                              : log.reason === 'Customer Return' 
                                ? 'bg-purple-500/10 text-purple-500' 
                                : 'bg-neutral-500/10 text-neutral-400'
                        }`}>
                          {log.reason}
                        </span>
                      </td>

                      {/* Auditor initials */}
                      <td className="py-4 px-4 text-neutral-400">
                        {log.loggedBy}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* MODAL WINDOW: DISCARD RECORD LOGGER */}
      {showAddWastageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${
            darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">Log Inventory Discard</h3>
            <p className="text-xs text-neutral-400 mb-4 font-sans">Logs raw food leakage index and reduces stored on-hand holding sizes automatically.</p>

            <form onSubmit={handleRecordWastageSubmit} className="space-y-4 text-xs font-sans">
              
              {/* Select raw material */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-450 mb-1">Target Ingredient</label>
                <select
                  required
                  value={selectedItemId}
                  onChange={(e) => handleItemSelect(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none focus:border-red-500 cursor-pointer ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.stockQty} {item.unit} remaining)
                    </option>
                  ))}
                </select>
                {activeItemInModal && (
                  <p className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>Base Unit Cost:</span>
                    <strong>₹{activeItemInModal.averagePrice.toFixed(2)} / {activeItemInModal.unit}</strong>
                  </p>
                )}
              </div>

              {/* quantity wasted */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Deficit Volume / Quantity Discarded</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    required
                    min="0.01"
                    value={wastageQty}
                    onChange={(e) => setWastageQty(Number(e.target.value))}
                    className={`flex-1 p-2 rounded-lg border outline-none focus:border-red-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                  <span className={`px-2.5 py-2.5 rounded-lg border text-neutral-450 font-mono text-[10px] ${darkMode ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-neutral-50'}`}>
                    {activeItemInModal?.unit || 'u'}
                  </span>
                </div>
              </div>

              {/* Reason list selector options */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Primary Waste Categorization Reason</label>
                <select
                  value={wastageReason}
                  onChange={(e) => setWastageReason(e.target.value as any)}
                  className={`w-full p-2.5 rounded-lg border outline-none focus:border-red-500 cursor-pointer ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <option value="Spoilage">Spoilage/Expiration</option>
                  <option value="Prep Error">Prep / Pruning / Burning error</option>
                  <option value="Customer Return">Customer Plating Return</option>
                  <option value="Equipment Failure">Cold Fridge / Storage leak</option>
                  <option value="Other">Other / Spills</option>
                </select>
              </div>

              {/* Auditor user */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Logging Staff Auditor</label>
                <input
                  type="text"
                  required
                  value={staffLogger}
                  onChange={(e) => setStaffLogger(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border outline-none focus:border-red-500 ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-450 mb-1">Audit description (What happened?)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 pt-2.5 text-neutral-500"><MessageSquare className="h-3.5 w-3.5" /></span>
                  <textarea
                    rows={2}
                    value={lossNotes}
                    onChange={(e) => setLossNotes(e.target.value)}
                    placeholder="e.g. Tomato boxes crushed under raw grain sacks."
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border outline-none focus:border-red-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              {/* Cost math subtotal warning */}
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-between font-mono">
                <span className="text-[10px] text-neutral-410 uppercase font-semibold">Projected Spoilage Asset loss:</span>
                <span className="text-sm font-bold text-red-500">
                  ₹{(Number(wastageQty) * (activeItemInModal?.averagePrice || 0)).toFixed(2)}
                </span>
              </div>

              {/* Triggers */}
              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddWastageModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-neutral-450 hover:bg-neutral-850 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-650 text-white font-bold cursor-pointer hover:bg-opacity-90 shadow-xl"
                >
                  Write off inventory loss
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
