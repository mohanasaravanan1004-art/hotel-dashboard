import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  IndianRupee, 
  Coins, 
  Users, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Activity,
  AlertOctagon,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { Recipe, InventoryItem, UserRole } from '../types';

interface RecipesProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  inventory: InventoryItem[];
  userRole: UserRole;
  darkMode: boolean;
}

export default function Recipes({
  recipes,
  setRecipes,
  inventory,
  userRole,
  darkMode
}: RecipesProps) {

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

  // States for creating a recipe
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [recipeTargetPrice, setRecipeTargetPrice] = useState(15);
  const [recipePrepTime, setRecipePrepTime] = useState(20);
  
  // Mapping list (Array of { itemId, requiredQty })
  const [mappedIngredients, setMappedIngredients] = useState<{ itemId: string; requiredQty: number }[]>([
    { itemId: '', requiredQty: 0.1 }
  ]);

  const canMutate = userRole !== 'Staff';

  // Search filtered recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [recipes, searchTerm]);

  // Expand helper
  const toggleExpand = (id: string) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  // Live Cost calculation for a single recipe
  const calculateRecipeCost = (recipe: Recipe) => {
    let totalCost = 0;
    recipe.ingredients.forEach(ing => {
      const item = inventory.find(i => i.id === ing.itemId);
      const price = item ? item.averagePrice : 0;
      totalCost += ing.requiredQty * price;
    });
    return parseFloat(totalCost.toFixed(2));
  };

  // Helper row managers for ingredient creator modal
  const addIngredientRow = () => {
    setMappedIngredients(prev => [...prev, { itemId: inventory[0]?.id || '', requiredQty: 0.1 }]);
  };

  const removeIngredientRow = (index: number) => {
    setMappedIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredientRow = (index: number, field: 'itemId' | 'requiredQty', value: any) => {
    setMappedIngredients(prev => prev.map((row, i) => {
      if (i === index) {
        return {
          ...row,
          [field]: field === 'requiredQty' ? Number(value) : value
        };
      }
      return row;
    }));
  };

  // Handle Create Recipe Form submission
  const handleCreateRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canMutate) return;

    // Prune invalid mappings
    const finalIngredients = mappedIngredients.filter(ing => ing.itemId !== '' && ing.requiredQty > 0);
    if (!recipeName.trim() || finalIngredients.length === 0) {
      alert('Kindly supply a recipe title and map at least one valid ingredient with its size requirement.');
      return;
    }

    const newRecipe: Recipe = {
      id: 'rec-' + Date.now(),
      name: recipeName,
      description: recipeDesc,
      salePrice: Number(recipeTargetPrice),
      prepTimeMinutes: Number(recipePrepTime),
      ingredients: finalIngredients
    };

    setRecipes(prev => [...prev, newRecipe]);

    // reset Form
    setRecipeName('');
    setRecipeDesc('');
    setRecipeTargetPrice(15);
    setRecipePrepTime(20);
    setMappedIngredients([{ itemId: inventory[0]?.id || '', requiredQty: 0.1 }]);
    setShowAddRecipeModal(false);
  };

  // Delete structured recipe
  const handleDeleteRecipe = (id: string, name: string) => {
    if (!canMutate) return;
    if (confirm(`Remove custom menu recipe: "${name}"?`)) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  // Update target pricing directly of any recipe (quick margin adjustment!)
  const handleUpdatePrice = (recipeId: string, newPrice: number) => {
    if (!canMutate) return;
    setRecipes(prev => prev.map(rec => {
      if (rec.id === recipeId) {
        return { ...rec, salePrice: Math.max(0.1, parseFloat(newPrice.toFixed(2))) };
      }
      return rec;
    }));
  };

  return (
    <div className="space-y-6">

      {/* Control row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-450">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search catalogged recipes..."
            className={`w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border outline-none font-sans focus:border-emerald-500 transition-colors ${
              darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-white border-neutral-200'
            }`}
          />
        </div>

        {/* Modal trigger */}
        {canMutate ? (
          <button
            onClick={() => setShowAddRecipeModal(true)}
            className="flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-saffron-500/15"
          >
            <Plus className="h-4 w-4" /> Formulate Menu Recipe
          </button>
        ) : (
          <div className="text-xs text-rose-500 py-1.5 px-3 rounded-md border border-rose-500/10 bg-rose-500/5 font-sans font-medium">
            🔒 View-only permission tier active
          </div>
        )}

      </div>

      {/* Central Recipes List */}
      <div className="space-y-4">
        {filteredRecipes.length === 0 ? (
          <div className={`p-12 text-center text-neutral-500 border border-dashed rounded-xl ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
            <BookOpen className="h-10 w-10 mx-auto opacity-20 mb-2" />
            <p className="font-sans text-xs">No active menu recipes matched inside this restaurant inventory.</p>
          </div>
        ) : (
          filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipeId === recipe.id;
            const ingredientCosts = calculateRecipeCost(recipe);
            const menuPrice = recipe.salePrice;
            const profitValue = parseFloat((menuPrice - ingredientCosts).toFixed(2));
            
            // Standard target metric calculations
            const foodCostMarginRatio = menuPrice > 0 ? (ingredientCosts / menuPrice) * 100 : 0;
            const isCriticalLeak = foodCostMarginRatio > 40; // Food costs exceeding 40% are bad!
            const isHealthyMargin = foodCostMarginRatio <= 30; // 30% or below is excellent!

            return (
              <div 
                key={recipe.id}
                className={`border rounded-xl  overflow-hidden transition-all ${
                  darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
                }`}
              >
                
                {/* Header overview row */}
                <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer" onClick={() => toggleExpand(recipe.id)}>
                  
                  <div className="flex gap-3 items-start flex-1">
                    <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-450 mt-1 shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-sans font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        {recipe.name} 
                        {isHealthyMargin && (
                          <span className="text-[9px] font-bold font-sans uppercase px-1.5 py-0.5 rounded bg-green-500/15 text-green-500 tracking-wide">High Yield Tier</span>
                        )}
                        {isCriticalLeak && (
                          <span className="text-[9px] font-bold font-sans uppercase px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 tracking-wide">Cost Leak Deficit</span>
                        )}
                      </h3>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5 line-clamp-1">{recipe.description || 'No description assigned.'}</p>
                    </div>
                  </div>

                  {/* Financial Stats strip */}
                  <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
                    
                    {/* Raw Ingredients Cost */}
                    <div className="text-left w-24">
                      <span className="block text-[10px] text-neutral-400 font-sans">Raw Food Cost</span>
                      <span className="font-bold text-neutral-300">₹{ingredientCosts.toFixed(2)}</span>
                    </div>

                    {/* Mapped dynamic profit margin */}
                    <div className="text-left w-24">
                      <span className="block text-[10px] text-neutral-400 font-sans">Gross Profit margin</span>
                      <span className={`font-bold ${isCriticalLeak ? 'text-red-500' : isHealthyMargin ? 'text-green-500' : 'text-amber-500'}`}>
                        ₹{profitValue.toFixed(2)}
                      </span>
                    </div>

                    {/* Cost Percentage ratio */}
                    <div className="text-left w-20">
                      <span className="block text-[10px] text-neutral-400 font-sans">Food Cost Ratio</span>
                      <span className={`font-bold ${isCriticalLeak ? 'text-red-500' : isHealthyMargin ? 'text-green-500' : 'text-amber-500'}`}>
                        {foodCostMarginRatio.toFixed(1)}%
                      </span>
                    </div>

                    {/* Targeted Menu price and adjustment drawer */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <span className="block text-[10px] text-neutral-400 font-sans">Target Menu Price</span>
                        {canMutate ? (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-neutral-500">₹</span>
                            <input 
                              type="number"
                              step="0.5"
                              value={recipe.salePrice}
                              onChange={(e) => handleUpdatePrice(recipe.id, Number(e.target.value))}
                              className={`w-14 p-1 text-[11px] font-bold rounded border outline-none font-mono ${
                                darkMode ? 'bg-black/20 border-white/10 text-white focus:border-emerald-500' : 'bg-neutral-50 border-neutral-200'
                              }`}
                            />
                          </div>
                        ) : (
                          <span className="font-bold text-emerald-400 font-mono">₹{recipe.salePrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {canMutate && (
                        <button 
                          onClick={() => handleDeleteRecipe(recipe.id, recipe.name)}
                          className="p-1 px-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                          title="Remove Recipe specification"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button className="p-1 text-neutral-400">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>

                  </div>

                </div>

                {/* Sub-mapped ingredient breakdown list */}
                {isExpanded && (
                  <div className={`p-4 border-t border-dashed ${
                    darkMode ? 'bg-neutral-950/40 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-2.5 font-bold">Portion Requirements Matrix mapping:</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {recipe.ingredients.map((ing) => {
                        const matchedItem = inventory.find(i => i.id === ing.itemId);
                        const unitPrice = matchedItem ? matchedItem.averagePrice : 0;
                        const subcost = ing.requiredQty * unitPrice;
                        
                        return (
                          <div 
                            key={ing.itemId}
                            className={`p-3 rounded-lg border text-xs flex justify-between items-center ${
                              darkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-250' : 'bg-white border-neutral-200'
                            }`}
                          >
                            <div>
                              <p className="font-bold font-sans text-neutral-950 dark:text-neutral-100">{matchedItem ? matchedItem.name : 'Unknown Ingredient'}</p>
                              <p className="text-[10px] text-neutral-400 mt-1 font-mono">
                                Uses: <strong className="text-emerald-400">{ing.requiredQty} {matchedItem?.unit || 'u'}</strong> at ₹{unitPrice.toFixed(2)}/{matchedItem?.unit || 'u'}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-neutral-300 dark:text-neutral-100">
                              +₹{subcost.toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3 border-t border-dotted border-neutral-700/50 flex flex-col md:flex-row justify-between text-[11px] text-neutral-400 font-sans gap-2">
                      <p>⏱️ Prep Time Index: <strong>{recipe.prepTimeMinutes} mins</strong> | Recipe specification complete.</p>
                      <p className="font-mono">Total Ingredient Elements Linked: <strong>{recipe.ingredients.length}</strong></p>
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>


      {/* MODAL WINDOW: FORMULATE/CREATE A MENU RECIPE */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl p-6 border shadow-2xl overflow-y-auto max-h-[90vh] ${
            darkMode ? 'bg-[#111318] border-white/5 text-white' : 'bg-white border-neutral-200 text-neutral-850'
          }`}>
            <h3 className="font-sans font-bold text-base mb-1">Formulate New Kitchen Recipe</h3>
            <p className="text-xs text-neutral-450 mb-4">Combines inventory catalog items and automatically calculates standard raw portion costs.</p>

            <form onSubmit={handleCreateRecipeSubmit} className="space-y-4 text-xs font-sans">
              
              {/* Core Details */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Recipe / Menu Item Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Lobster Thermidor"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Menu Card Description</label>
                  <textarea
                    rows={2}
                    placeholder="Provide description for menu selection or plating notes..."
                    value={recipeDesc}
                    onChange={(e) => setRecipeDesc(e.target.value)}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Target Sale Menu Price (₹)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={recipeTargetPrice}
                    onChange={(e) => setRecipeTargetPrice(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">Plating/Prep Time (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={recipePrepTime}
                    onChange={(e) => setRecipePrepTime(Number(e.target.value))}
                    className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 ${
                      darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                    }`}
                  />
                </div>

              </div>

              {/* Dynamic Mapped rows listing */}
              <div className="border-t border-dashed border-neutral-700/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-mono text-[10px] uppercase text-neutral-400 font-bold">Link Ingredient Requirements:</h4>
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    className="flex items-center gap-1 text-[11px] text-emerald-450 hover:underline cursor-pointer"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> Add ingredient line
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {mappedIngredients.map((row, index) => {
                    const matchedItem = inventory.find(i => i.id === row.itemId);
                    const costOfRow = matchedItem ? matchedItem.averagePrice * row.requiredQty : 0;

                    return (
                      <div key={index} className="flex gap-2 items-center">
                        {/* Selector */}
                        <select
                          required
                          value={row.itemId}
                          onChange={(e) => updateIngredientRow(index, 'itemId', e.target.value)}
                          className={`flex-1 p-2 rounded-lg border outline-none focus:border-emerald-500 cursor-pointer text-xs ${
                            darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                          }`}
                        >
                          <option value="">-- Choose Raw Material --</option>
                          {inventory.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>

                        {/* quantity input */}
                        <div className="w-32 flex gap-1">
                          <input
                            type="number"
                            step="any"
                            placeholder="Qty"
                            value={row.requiredQty}
                            onChange={(e) => updateIngredientRow(index, 'requiredQty', e.target.value)}
                            className={`w-full p-2 rounded-lg border outline-none focus:border-emerald-500 text-xs ${
                              darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-neutral-50 border-neutral-200'
                            }`}
                          />
                          <span className={`p-2.5 rounded-lg border font-mono text-[10px] uppercase text-neutral-450 shrink-0 ${darkMode ? 'border-white/5 bg-black/20' : 'border-neutral-200 bg-neutral-50'}`}>
                            {matchedItem?.unit || 'u'}
                          </span>
                        </div>

                        {/* Cost preview indicator */}
                        <span className="w-16 text-right font-mono font-bold text-emerald-400 text-[11px] shrink-0">
                          +₹{costOfRow.toFixed(2)}
                        </span>

                        {/* Delete row */}
                        <button
                          type="button"
                          disabled={mappedIngredients.length <= 1}
                          onClick={() => removeIngredientRow(index)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-rose-500 disabled:opacity-20 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic summary card for ideal margins */}
              <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 mt-4 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-neutral-450 uppercase font-semibold block">Approx Cook Portion Cost:</span>
                  <span className="text-sm font-bold text-neutral-300">
                    ₹{mappedIngredients.reduce((sum, r) => {
                      const mat = inventory.find(i => i.id === r.itemId);
                      return sum + (r.requiredQty * (mat ? mat.averagePrice : 0));
                    }, 0).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Optimized Target Sale Margin:</span>
                  <span className="text-sm font-bold text-green-500">
                    {((recipeTargetPrice - mappedIngredients.reduce((sum, r) => {
                      const mat = inventory.find(i => i.id === r.itemId);
                      return sum + (r.requiredQty * (mat ? mat.averagePrice : 0));
                    }, 0)) / (recipeTargetPrice || 1) * 100).toFixed(0)}% Profit Index
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="flex gap-2 justify-end pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddRecipeModal(false)}
                  className="px-4 py-2 rounded-lg text-neutral-450 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white font-bold cursor-pointer shadow-xl shadow-saffron-500/15 transition-colors"
                >
                  Verify & Formulate Dish
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
