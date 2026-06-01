import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Truck, 
  Bookmark, 
  AlertTriangle, 
  Layers, 
  UserPlus, 
  ArrowUpDown,
  CheckCircle,
  HelpCircle,
  Undo2
} from 'lucide-react';
import { Category, Supplier, InventoryItem, UserRole } from '../types';

interface InventoryProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  userRole: UserRole;
  darkMode: boolean;
}

export default function Inventory({
  categories,
  setCategories,
  suppliers,
  setSuppliers,
  inventory,
  setInventory,
  userRole,
  darkMode
}: InventoryProps) {

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All'); // 'All', 'Good', 'Low', 'Out'

  // Sub-tab toggling: 'items' | 'categories' | 'suppliers'
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'categories' | 'suppliers'>('items');

  // Modal forms states
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Field states for CRUD Inventory Item
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemSupplier, setItemSupplier] = useState('');
  const [itemQty, setItemQty] = useState(0);
  const [itemUnit, setItemUnit] = useState('kg');
  const [itemPrice, setItemPrice] = useState(0);
  const [itemReorder, setItemReorder] = useState(10);

  // Field states for CRUD Category
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Field states for CRUD Supplier
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supLeadTime, setSupLeadTime] = useState(2);

  // Permission guards
  const canMutate = userRole === 'Owner' || userRole === 'Manager';

  // Computed Values - Stock alert percentages
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || item.categoryId === selectedCategory;
      
      let matchStatus = true;
      if (stockStatusFilter === 'Low') {
        matchStatus = item.stockQty > 0 && item.stockQty <= item.reorderLevel;
      } else if (stockStatusFilter === 'Out') {
        matchStatus = item.stockQty <= 0;
      } else if (stockStatusFilter === 'Good') {
        matchStatus = item.stockQty > item.reorderLevel;
      }

      return matchSearch && matchCategory && matchStatus;
    });
  }, [inventory, searchTerm, selectedCategory, stockStatusFilter]);

  // Handle open item modal for Add New
  const handleOpenAddModal = () => {
    if (!canMutate) return;
    setEditingItem(null);
    setItemName('');
    setItemCategory(categories[0]?.id || '');
    setItemSupplier(suppliers[0]?.id || '');
    setItemQty(10);
    setItemUnit('kg');
    setItemPrice(5.5);
    setItemReorder(10);
    setShowItemModal(true);
  };

  // Handle open item modal for Edit
  const handleOpenEditModal = (item: InventoryItem) => {
    if (!canMutate) return;
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.categoryId);
    setItemSupplier(item.supplierId);
    setItemQty(item.stockQty);
    setItemUnit(item.unit);
    setItemPrice(item.averagePrice);
    setItemReorder(item.reorderLevel);
    setShowItemModal(true);
  };

  // Submit item CRUD Save
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;

    if (!itemName.trim() || !itemCategory || !itemSupplier) {
      alert('Kindly check and fill all standard fields.');
      return;
    }

    if (editingItem) {
      // Edit existing
      setInventory(prev => prev.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            name: itemName,
            categoryId: itemCategory,
            supplierId: itemSupplier,
            stockQty: Number(itemQty),
            unit: itemUnit,
            averagePrice: Number(itemPrice),
            reorderLevel: Number(itemReorder),
            lastUpdated: new Date().toISOString()
          };
        }
        return item;
      }));
    } else {
      // Create new
      const newItem: InventoryItem = {
        id: 'item-' + Date.now(),
        name: itemName,
        categoryId: itemCategory,
        supplierId: itemSupplier,
        stockQty: Number(itemQty),
        unit: itemUnit,
        averagePrice: Number(itemPrice),
        reorderLevel: Number(itemReorder),
        lastUpdated: new Date().toISOString()
      };
      setInventory(prev => [...prev, newItem]);
    }

    setShowItemModal(false);
  };

  // Delete inventory item
  const handleDeleteItem = (id: string, name: string) => {
    if (!canMutate) return;
    if (confirm(`Are you sure you want to permanently delete raw item: "${name}"?`)) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  // Submit category Creation
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;
    if (!catName.trim()) return;

    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: catName,
      description: catDesc
    };

    setCategories(prev => [...prev, newCat]);
    setCatName('');
    setCatDesc('');
    setShowCategoryModal(false);
  };

  // Submit Supplier Creation
  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;
    if (!supName.trim()) return;

    const newSup: Supplier = {
      id: 'sup-' + Date.now(),
      name: supName,
      contactName: supContact,
      phone: supPhone,
      email: supEmail,
      leadTimeDays: Number(supLeadTime)
    };

    setSuppliers(prev => [...prev, newSup]);
    setSupName('');
    setSupContact('');
    setSupPhone('');
    setSupEmail('');
    setSupLeadTime(2);
    setShowSupplierModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Header Selection: Tabs for Items vs Categories vs Suppliers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('items')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              activeSubTab === 'items'
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                : darkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Raw Stock Items ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-orange-500 text-white border-orange-500 shadow-md` shadow-orange-500/10'
                : darkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <span className="flex items-center gap-1.5"><Bookmark className="h-3.5 w-3.5" /> Food Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('suppliers')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              activeSubTab === 'suppliers'
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : darkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Wholesalers & Suppliers ({suppliers.length})</span>
          </button>
        </div>

        {/* Dynamic creation button depending on selection */}
        {canMutate ? (
          <div>
            {activeSubTab === 'items' && (
              <button 
                onClick={handleOpenAddModal}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer shadow-md shadow-orange-500/10"
              >
                <Plus className="h-4 w-4" /> Add Inventory Item
              </button>
            )}
            {activeSubTab === 'categories' && (
              <button 
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer shadow-md shadow-orange-500/10"
              >
                <Plus className="h-4 w-4" /> Define New Category
              </button>
            )}
            {activeSubTab === 'suppliers' && (
              <button 
                onClick={() => setShowSupplierModal(true)}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors cursor-pointer shadow-md shadow-orange-500/10"
              >
                <Plus className="h-4 w-4" /> Onboard Supplier
              </button>
            )}
          </div>
        ) : (
          <div className="text-xs text-rose-500 py-1.5 px-3 rounded-md bg-rose-500/5 border border-rose-500/20 font-sans font-medium">
            🔒 View-only permission tier active
          </div>
        )}
      </div>

      {/* TIER 1: ACTIVE RAW STOCK ITEMS TAB */}
      {activeSubTab === 'items' && (
        <div className="space-y-4">
          
          {/* Filtering Tools Bar */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
          }`}>
            
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search raw catalog..."
                className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border outline-none font-sans focus:border-orange-500 transition-colors ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-850'
                }`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0"><Filter className="h-3 w-3" /> Cat:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`text-xs py-1.5 px-3 rounded-lg border outline-none font-sans focus:border-orange-500 cursor-pointer ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0"><AlertTriangle className="h-3 w-3" /> Level:</span>
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
                className={`text-xs py-1.5 px-3 rounded-lg border outline-none font-sans focus:border-orange-500 cursor-pointer ${
                  darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <option value="All">All Stock Levels</option>
                <option value="Good">In Stock (Healthy)</option>
                <option value="Low">Low Stock Level</option>
                <option value="Out">Out of stock (Deficit)</option>
              </select>
            </div>

            {/* Clear Filters helper */}
            {(searchTerm || selectedCategory !== 'All' || stockStatusFilter !== 'All') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setStockStatusFilter('All');
                }}
                className="text-[11px] text-orange-500 hover:underline flex items-center gap-1 md:ml-auto cursor-pointer"
              >
                <Undo2 className="h-3.5 w-3.5" /> Clear Filters
              </button>
            )}

          </div>

          {/* Table Element for stock listing */}
          <div className={`border rounded-xl overflow-hidden ${
            darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[11px] uppercase font-bold tracking-wider font-mono border-b ${
                    darkMode ? 'bg-neutral-950/50 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                  }`}>
                    <th className="py-3.5 px-4 font-semibold">Ingredient Details</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Preferred Supplier</th>
                    <th className="py-3.5 px-4 font-semibold">Avg Cost Price</th>
                    <th className="py-3.5 px-4 font-semibold text-center">Safety Target</th>
                    <th className="py-3.5 px-4 font-semibold">Current Balance</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${darkMode ? 'divide-neutral-850' : 'divide-neutral-100'}`}>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500 font-sans">
                        No ingredients found matching the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const matchedCat = categories.find(c => c.id === item.categoryId);
                      const matchedSup = suppliers.find(s => s.id === item.supplierId);
                      
                      // Calculate stock percentage for styling
                      const isOutOfStock = item.stockQty <= 0;
                      const isLowStock = item.stockQty > 0 && item.stockQty <= item.reorderLevel;
                      const isHealthy = item.stockQty > item.reorderLevel;

                      return (
                        <tr key={item.id} className={`transition-colors ${
                          darkMode ? 'hover:bg-neutral-850' : 'hover:bg-neutral-50'
                        }`}>
                          
                          {/* Name & ID */}
                          <td className="py-4 px-4">
                            <p className="font-bold font-sans text-neutral-900 dark:text-neutral-100">{item.name}</p>
                            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{item.id}</p>
                          </td>

                          {/* Category Badge */}
                          <td className="py-4 px-4 text-neutral-400">
                            <span className="px-2 py-0.5 rounded bg-neutral-500/10 text-neutral-300 font-semibold text-[10px]">
                              {matchedCat ? matchedCat.name : 'Unassigned'}
                            </span>
                          </td>

                          {/* Preferred Supplier */}
                          <td className="py-4 px-4 text-neutral-400 text-xs">
                            {matchedSup ? matchedSup.name : 'Unknown'}
                          </td>

                          {/* Unit average cost */}
                          <td className="py-4 px-4 font-bold font-mono">
                            ${item.averagePrice.toFixed(2)} <span className="text-[10px] text-neutral-400 font-sans font-normal">/ {item.unit}</span>
                          </td>

                          {/* Reorder Threshold alert info */}
                          <td className="py-4 px-4 text-center font-mono">
                            {item.reorderLevel} {item.unit}
                          </td>

                          {/* Live Balance indicator */}
                          <td className="py-4 px-4">
                            <div className="flex flex-col gap-1 w-32">
                              <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                                <span className={isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-green-500'}>
                                  {item.stockQty} {item.unit}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-normal">
                                  {isOutOfStock ? 'Critical deficit' : isLowStock ? 'Reorder Alert' : 'Healthy'}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    isOutOfStock 
                                      ? 'bg-red-500 w-[5%]' 
                                      : isLowStock 
                                        ? 'bg-amber-500 w-[35%]' 
                                        : 'bg-green-500 w-[100%]'
                                  }`}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Mutation Trigger Operations */}
                          <td className="py-4 px-4 text-right">
                            {canMutate ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => handleOpenEditModal(item)}
                                  className="p-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors cursor-pointer"
                                  title="Edit Ingredient Settings"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                  className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                                  title="Remove Ingredient"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-neutral-500 font-serif">-</span>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Card footer */}
            <div className={`p-3.5 border-t text-xs flex justify-between items-center ${
              darkMode ? 'bg-neutral-950/30 border-neutral-800 text-neutral-400' : 'bg-neutral-50 border-neutral-200 text-neutral-500'
            }`}>
              <p>Showing <strong>{filteredInventory.length}</strong> of <strong>{inventory.length}</strong> recorded raw materials.</p>
              <p className="font-mono">Global Precision tracking indexes: Active</p>
            </div>
          </div>

        </div>
      )}

      {/* TIER 2: ACTIVE CATEGORIES TAB */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const itemCount = inventory.filter(i => i.categoryId === cat.id).length;
            const assetValue = inventory.filter(i => i.categoryId === cat.id).reduce((sum, item) => sum + (item.stockQty * item.averagePrice), 0);
            
            return (
              <div 
                key={cat.id} 
                className={`p-5 rounded-xl border flex flex-col justify-between hover:shadow-lg transition-all ${
                  darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-850'
                }`}
              >
                <div>
                  <div className="flex gap-2 items-center justify-between mb-3">
                    <span className="p-2 rounded bg-orange-500/10 text-orange-500">
                      <Bookmark className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-500/10 text-neutral-400">
                      ID: {cat.id}
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-sm tracking-tight">{cat.name}</h4>
                  <p className="text-xs text-neutral-400 font-sans mt-1.5 leading-relaxed">{cat.description || 'No description assigned.'}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-dashed border-neutral-700/30 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Linked Items: <strong>{itemCount}</strong></span>
                  <span className="text-green-500 font-bold">Value: ${assetValue.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TIER 3: ACTIVE SUPPLIERS TAB */}
      {activeSubTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(sup => {
            const suppliesItemsCount = inventory.filter(i => i.supplierId === sup.id).length;
            
            return (
              <div 
                key={sup.id}
                className={`p-5 rounded-xl border flex flex-col justify-between hover:shadow-lg transition-all ${
                  darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200'
                }`}
              >
                <div>
                  <div className="flex gap-2 items-center justify-between mb-3">
                    <span className="p-2 rounded bg-blue-500/10 text-blue-500">
                      <Truck className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-500/10 text-neutral-400">
                      Lead Time: {sup.leadTimeDays}d
                    </span>
                  </div>
                  <h4 className="font-sans font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">{sup.name}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">Primary Rep: <strong className="text-neutral-300">{sup.contactName}</strong></p>

                  <div className="mt-4 space-y-1 font-mono text-[10px] text-neutral-400">
                    <p>📧 {sup.email}</p>
                    <p>📞 {sup.phone}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-dashed border-neutral-700/30 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Products Catalogued:</span>
                  <span className="font-bold underline text-blue-500 text-xs font-semibold">{suppliesItemsCount} ingredients</span>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* MODAL WINDOW 1: ADD OR EDIT INVENTORY ITEM */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl p-6 border transition-all ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-800'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">
              {editingItem ? 'Edit Raw Stock Material' : 'Register New Raw Material'}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">Complete metrics below to trigger automatic costing index calculations.</p>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Ingredient Title / Name</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Atlantic Salmon fillet"
                    className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Food Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-orange-500 cursor-pointer ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Supplier Selection */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Merchant Wholesale source</label>
                  <select
                    value={itemSupplier}
                    onChange={(e) => setItemSupplier(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-orange-500 cursor-pointer ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Starting Quantity */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Primary Quantity On-Hand</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={itemQty}
                    onChange={(e) => setItemQty(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

                {/* Unit type selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Standard Measure Unit</label>
                  <select
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-orange-500 cursor-pointer ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <option value="kg">kilograms (kg)</option>
                    <option value="liters">liters (L)</option>
                    <option value="units">units (qty)</option>
                    <option value="packs">packs (pks)</option>
                  </select>
                </div>

                {/* Cost per Unit */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Average Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

                {/* Reorder Safety Alert limit */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Safety Threshold Level (Reorder)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={itemReorder}
                    onChange={(e) => setItemReorder(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

              </div>

              {/* Action operations buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-700/30">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                    darkMode ? 'border-neutral-800 text-neutral-450 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-md cursor-pointer"
                >
                  Confirm & Save Asset
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      {/* MODAL WINDOW 2: DEFINE NEW CATEGORY */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-850'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">Define Menu Food Category</h3>
            <p className="text-xs text-neutral-400 mb-4">Groups related recipe elements together in reports.</p>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood, Spirits, Legumes"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summarize storage instructions or items in group..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-3 py-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-orange-500 text-white font-bold cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL WINDOW 3: ONBOARD INGREDIENT SUPPLIER */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 border shadow-2xl ${
            darkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-850'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">Onboard Wholesale Supplier</h3>
            <p className="text-xs text-neutral-400 mb-4">Store primary vendor credentials securely for restocks.</p>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Wholesale Agency Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Ocean Imports"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Contact Representative</label>
                <input
                  type="text"
                  placeholder="Full name of salesperson"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Phone Number</label>
                  <input
                    type="phone"
                    placeholder="+91..."
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Average Lead Time (Days)</label>
                  <input
                    type="number"
                    value={supLeadTime}
                    onChange={(e) => setSupLeadTime(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                      darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Wholesale email address</label>
                <input
                  type="email"
                  placeholder="orders@..."
                  value={supEmail}
                  onChange={(e) => setSupEmail(e.target.value)}
                  className={`w-full p-2 rounded-lg border outline-none font-sans focus:border-orange-500 ${
                    darkMode ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200'
                  }`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-3 py-1.5 rounded-lg text-neutral-400 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-orange-500 text-white font-bold cursor-pointer"
                >
                  Submit Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
