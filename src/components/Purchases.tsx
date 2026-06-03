import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Calendar, 
  Check, 
  Clock, 
  FileText, 
  TrendingUp, 
  IndianRupee, 
  Hash, 
  Trash2,
  ListOrdered
} from 'lucide-react';
import { PurchaseLog, InventoryItem, Supplier, UserRole } from '../types';

interface PurchasesProps {
  purchases: PurchaseLog[];
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseLog[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  suppliers: Supplier[];
  userRole: UserRole;
  darkMode: boolean;
}

export default function Purchases({
  purchases,
  setPurchases,
  inventory,
  setInventory,
  suppliers,
  userRole,
  darkMode
}: PurchasesProps) {

  // Purchase Listing Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('All');

  // New Purchase state
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [purchaseUnitPrice, setPurchaseUnitPrice] = useState(1.0);
  const [purchaseInvoice, setPurchaseInvoice] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState<'Received' | 'Pending'>('Received');

  const canMutate = userRole === 'Owner' || userRole === 'Manager';

  // Filtered History
  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const item = inventory.find(i => i.id === p.itemId);
      const isMatchSearch = item 
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        : p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const isMatchSupplier = supplierFilter === 'All' || p.supplierId === supplierFilter;

      return isMatchSearch && isMatchSupplier;
    });
  }, [purchases, inventory, searchTerm, supplierFilter]);

  // Selected item information for Modal preview
  const activeItemInModal = useMemo(() => {
    return inventory.find(i => i.id === selectedItemId);
  }, [inventory, selectedItemId]);

  // Dynamically set default price from current average cost when ingredient is switched
  const handleItemSelectInModal = (id: string) => {
    setSelectedItemId(id);
    const item = inventory.find(i => i.id === id);
    if (item) {
      setPurchaseUnitPrice(item.averagePrice);
    }
  };

  // Triggered when a new purchase ticket is submitted
  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;

    if (!selectedItemId) {
      alert('Must select a specific ingredient item first.');
      return;
    }

    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    const matchedSupplierId = item.supplierId;
    const qty = Number(purchaseQty);
    const unitPrice = Number(purchaseUnitPrice);
    const totalCost = qty * unitPrice;
    
    const invoiceNum = purchaseInvoice.trim() || 'INV-' + Math.floor(1000 + Math.random() * 9000);

    const newPurchase: PurchaseLog = {
      id: 'pur-' + Date.now(),
      itemId: selectedItemId,
      supplierId: matchedSupplierId,
      qty,
      unitPrice,
      totalCost,
      purchaseDate: new Date().toISOString(),
      invoiceNumber: invoiceNum,
      status: purchaseStatus
    };

    // Dynamic state adjustments if received immediately
    if (purchaseStatus === 'Received') {
      setInventory(prevInventory => prevInventory.map(invItem => {
        if (invItem.id === selectedItemId) {
          // Weighted Average Price Algorithm
          // New Avg Price = (Current total holding value + Incoming value) / (Current holding qty + Incoming qty)
          const currentTotalHoldingVal = invItem.stockQty * invItem.averagePrice;
          const incomingVal = qty * unitPrice;
          const newQty = invItem.stockQty + qty;
          const calculatedAvgPrice = newQty > 0 
            ? (currentTotalHoldingVal + incomingVal) / newQty 
            : unitPrice;

          return {
            ...invItem,
            stockQty: parseFloat(newQty.toFixed(2)),
            averagePrice: parseFloat(calculatedAvgPrice.toFixed(2)),
            lastUpdated: new Date().toISOString()
          };
        }
        return invItem;
      }));
    }

    setPurchases(prev => [...prev, newPurchase]);

    // Reset settings
    setSelectedItemId('');
    setPurchaseQty(1);
    setPurchaseUnitPrice(1.0);
    setPurchaseInvoice('');
    setPurchaseStatus('Received');
    setShowAddPurchaseModal(false);
  };

  // Toggle Pending to Received (and update stock level)
  const handleMarkAsReceived = (purchase: PurchaseLog) => {
    if (!canMutate) return;
    if (purchase.status !== 'Pending') return;

    if (confirm(`Accept and receive ${purchase.qty} units of restock invoice: ${purchase.invoiceNumber}?`)) {
      setPurchases(prev => prev.map(p => {
        if (p.id === purchase.id) {
          return { ...p, status: 'Received' as const };
        }
        return p;
      }));

      setInventory(prevInventory => prevInventory.map(invItem => {
        if (invItem.id === purchase.itemId) {
          const currentTotalHoldingVal = invItem.stockQty * invItem.averagePrice;
          const incomingVal = purchase.qty * purchase.unitPrice;
          const newQty = invItem.stockQty + purchase.qty;
          const calculatedAvgPrice = newQty > 0 
            ? (currentTotalHoldingVal + incomingVal) / newQty 
            : purchase.unitPrice;

          return {
            ...invItem,
            stockQty: parseFloat(newQty.toFixed(2)),
            averagePrice: parseFloat(calculatedAvgPrice.toFixed(2)),
            lastUpdated: new Date().toISOString()
          };
        }
        return invItem;
      }));
    }
  };

  // Analytics for statistics header
  const purchaseAnalytics = useMemo(() => {
    const recieved = purchases.filter(p => p.status === 'Received');
    const totalOutflowCost = recieved.reduce((sum, p) => sum + p.totalCost, 0);
    
    // Find biggest supplier outlay
    const supplierSpending: Record<string, number> = {};
    recieved.forEach(p => {
      supplierSpending[p.supplierId] = (supplierSpending[p.supplierId] || 0) + p.totalCost;
    });

    let topSupplierName = 'None';
    let maxSpending = 0;
    Object.entries(supplierSpending).forEach(([supId, spent]) => {
      if (spent > maxSpending) {
         maxSpending = spent;
         const match = suppliers.find(s => s.id === supId);
         if (match) topSupplierName = match.name;
      }
    });

    return {
      totalOutflow: totalOutflowCost,
      pendingCount: purchases.filter(p => p.status === 'Pending').length,
      topSupplier: topSupplierName,
      maxOutflowSupplier: maxSpending
    };
  }, [purchases, suppliers]);

  return (
    <div className="space-y-6">
      
      {/* Top Analytics Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className={`p-5 rounded-xl border flex gap-4 items-center ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <span className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <IndianRupee className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-neutral-400 font-sans">Total Procurement Outflow</p>
            <p className="text-xl font-bold font-sans text-emerald-400">₹{purchaseAnalytics.totalOutflow.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className={`p-5 rounded-xl border flex gap-4 items-center ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <span className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
            <Clock className="h-5 w-5 animate-pulse" />
          </span>
          <div>
            <p className="text-xs text-neutral-400 font-sans">Awaiting Procurement Transit</p>
            <p className="text-xl font-bold text-yellow-500 font-sans">{purchaseAnalytics.pendingCount} Shipments</p>
          </div>
        </div>

        <div className={`p-5 rounded-xl border flex gap-4 items-center ${
          darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
        }`}>
          <span className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-neutral-400 font-sans">Primary Outflow Supplier Source</p>
            <p className="text-sm font-bold font-sans truncate w-40">{purchaseAnalytics.topSupplier}</p>
            <span className="text-[10px] text-neutral-450 font-mono">₹{purchaseAnalytics.maxOutflowSupplier.toFixed(0)} spent</span>
          </div>
        </div>

      </div>

      {/* Control filters & Add record button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search via ingredient or invoice..."
              className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border outline-none font-sans focus:border-emerald-500 transition-colors ${
                darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-white border-neutral-200'
              }`}
            />
          </div>

          {/* Supplier select */}
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className={`text-xs py-1.5 px-3 rounded-lg border outline-none font-sans focus:border-emerald-500 cursor-pointer ${
              darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-neutral-50 border-neutral-200'
            }`}
          >
            <option value="All">All Suppliers</option>
            {suppliers.map(sup => (
              <option key={sup.id} value={sup.id}>{sup.name}</option>
            ))}
          </select>
        </div>

        {canMutate ? (
          <button
            onClick={() => {
              // Preload first available item
              if (inventory.length > 0) {
                handleItemSelectInModal(inventory[0].id);
              }
              setShowAddPurchaseModal(true);
            }}
            className="flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-saffron-500/15"
          >
            <Plus className="h-4 w-4" /> Record Purchase Receipt
          </button>
        ) : (
          <div className="text-xs text-rose-500 py-1 px-3 rounded-md border border-rose-500/10 bg-rose-500/5 font-sans font-medium">
            🔒 View-only permission active
          </div>
        )}

      </div>

      {/* Main invoices timeline list */}
      <div className={`border rounded-xl overflow-hidden ${
        darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] uppercase font-bold tracking-wider font-mono border-b ${
                darkMode ? 'bg-[#0a0b0d] border-white/5 text-slate-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
              }`}>
                <th className="py-3.5 px-4">Invoice Ledger</th>
                <th className="py-3.5 px-4">Ingredient Restocked</th>
                <th className="py-3.5 px-4">Procurement Vendor</th>
                <th className="py-3.5 px-4">Volume Traded</th>
                <th className="py-3.5 px-4">Unit Purchase Price</th>
                <th className="py-3.5 px-4">Gross Outflow</th>
                <th className="py-3.5 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs ${darkMode ? 'divide-neutral-850' : 'divide-neutral-100'}`}>
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-sans">
                    No matching purchase invoices historically logged here.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => {
                  const item = inventory.find(i => i.id === purchase.itemId);
                  const supplier = suppliers.find(s => s.id === purchase.supplierId);
                  const isPending = purchase.status === 'Pending';

                  return (
                    <tr key={purchase.id} className={darkMode ? 'hover:bg-neutral-850' : 'hover:bg-neutral-50'}>
                      
                      {/* Invoice Code and Date */}
                      <td className="py-4 px-4 font-mono font-bold flex gap-2 items-center text-neutral-900 dark:text-neutral-100">
                        <FileText className="h-3.5 w-3.5 text-neutral-400" />
                        <div>
                          <span>{purchase.invoiceNumber}</span>
                          <span className="block text-[10px] font-normal text-neutral-400 font-sans">
                            {new Date(purchase.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Matching Ingredient */}
                      <td className="py-4 px-4">
                        <strong className="text-neutral-800 dark:text-neutral-100">{item ? item.name : 'Unknown Ingredient'}</strong>
                        <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">ID: {purchase.itemId}</span>
                      </td>

                      {/* Matching Vendor Name */}
                      <td className="py-4 px-4 text-neutral-400">
                        {supplier ? supplier.name : 'Independent Merchant'}
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4 font-bold font-mono">
                        +{purchase.qty} <span className="text-[10px] font-sans font-normal text-neutral-400">{item ? item.unit : ''}</span>
                      </td>

                      {/* Unit Expense Price */}
                      <td className="py-4 px-4 font-mono">
                        ₹{purchase.unitPrice.toFixed(2)} <span className="text-[10px] text-neutral-500">/ u</span>
                      </td>

                      {/* Total Cost Outflow */}
                      <td className="py-4 px-4 font-bold font-mono text-orange-500 text-sm">
                        ₹{purchase.totalCost.toFixed(2)}
                      </td>

                      {/* Status and transition check */}
                      <td className="py-4 px-4">
                        {isPending ? (
                          canMutate ? (
                            <button
                              onClick={() => handleMarkAsReceived(purchase)}
                              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-neutral-900 border border-amber-500/20 cursor-pointer transition-colors"
                              title="Click to accept delivered items"
                            >
                              <Clock className="h-3.5 w-3.5 animate-spin-slow" /> Confirm Receipt
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                              <Clock className="h-3 w-3" /> In-Transit
                            </span>
                          )
                        ) : (
                          <span className="flex items-center gap-1.5 text-green-500 font-bold text-[11px]">
                            <span className="p-0.5 rounded-full bg-green-500/15">
                              <Check className="h-3 w-3" />
                            </span>
                            Stocked
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* MODAL WINDOW: RECORD A PURCHASE TICKET */}
      {showAddPurchaseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${
            darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">Create Purchase Receipt</h3>
            <p className="text-xs text-neutral-450 mb-4">Increments inventory counts and recalculates average costing scales automatically.</p>

            <form onSubmit={handleAddPurchase} className="space-y-4 text-xs font-sans">
              
              {/* Ingredient selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Target Ingredient</label>
                <select
                  required
                  value={selectedItemId}
                  onChange={(e) => handleItemSelectInModal(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 cursor-pointer ${
                    darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Current: {item.stockQty} {item.unit})
                    </option>
                  ))}
                </select>
                {activeItemInModal && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>Supplied By:</span>
                    <span className="font-bold">
                      {suppliers.find(s => s.id === activeItemInModal.supplierId)?.name || 'Default Merchant'}
                    </span>
                  </div>
                )}
              </div>

              {/* Purchase Quantity */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Purchase Volume / Quantity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    required
                    min="0.1"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    className={`flex-1 p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                  <span className={`px-2.5 py-2.5 rounded-lg border text-neutral-450 font-mono text-[10px] ${darkMode ? 'border-white/5 bg-black/20' : 'border-neutral-200 bg-neutral-50'}`}>
                    {activeItemInModal?.unit || 'Units'}
                  </span>
                </div>
              </div>

              {/* Invoice Unit Purchase Cost */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Wholesale Unit Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0.01"
                  value={purchaseUnitPrice}
                  onChange={(e) => setPurchaseUnitPrice(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                    darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              {/* Invoice Number */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Invoice Reference / Receipt ID (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500 font-bold"><Hash className="h-3 w-3" /></span>
                  <input
                    type="text"
                    placeholder="Generates dynamically if left blank"
                    value={purchaseInvoice}
                    onChange={(e) => setPurchaseInvoice(e.target.value)}
                    className={`w-full pl-8 pr-3 py-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Transit / Receipt Status</label>
                <select
                  value={purchaseStatus}
                  onChange={(e) => setPurchaseStatus(e.target.value as 'Received' | 'Pending')}
                  className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 cursor-pointer ${
                    darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                >
                  <option value="Received">Received (Sync immediately to on-hand stock)</option>
                  <option value="Pending">Pending (Log as in-transit with no stock update)</option>
                </select>
              </div>

              {/* Subtotal preview math */}
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between font-mono">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Projected Subtotal Cost:</span>
                <span className="text-sm font-bold text-emerald-400">
                  ₹{(Number(purchaseQty) * Number(purchaseUnitPrice)).toFixed(2)}
                </span>
              </div>

              {/* Submission actions */}
              <div className="flex gap-2.5 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPurchaseModal(false)}
                  className="px-3.5 py-2 rounded-lg text-neutral-450 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-saffron-600 font-bold text-white shadow-xl shadow-saffron-500/15 cursor-pointer hover:bg-saffron-700 transition-colors"
                >
                  Submit Order
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
