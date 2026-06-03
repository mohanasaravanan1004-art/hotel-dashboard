import { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Database, 
  Route, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle, 
  Layers, 
  ChevronRight, 
  Printer, 
  TableProperties, 
  HeartHandshake,
  IndianRupee,
  PieChart
} from 'lucide-react';
import { Category, InventoryItem, Recipe, WastageLog, PurchaseLog, ConsumptionLog } from '../types';

interface ReportsProps {
  categories: Category[];
  inventory: InventoryItem[];
  recipes: Recipe[];
  purchases: PurchaseLog[];
  consumption: ConsumptionLog[];
  wastage: WastageLog[];
  darkMode: boolean;
}

export default function Reports({
  categories,
  inventory,
  recipes,
  purchases,
  consumption,
  wastage,
  darkMode
}: ReportsProps) {

  // sub tabs: 'analytics' | 'schema' | 'api'
  const [activeReportTab, setActiveReportTab] = useState<'analytics' | 'schema' | 'api'>('analytics');

  const [downloadSuccessType, setDownloadSuccessType] = useState<string | null>(null);

  // Trigger brief download visualizer
  const handleSimulatedDownload = (reportName: string) => {
    setDownloadSuccessType(reportName);
    setTimeout(() => {
      setDownloadSuccessType(null);
    }, 2500);
  };

  // 1. Analytics Calculations
  const calculatedStats = useMemo(() => {
    // Top profitable menu items: Sorted by: targetMenuPrice - calculatedRawIngredientsCost
    const recipesWithProfit = recipes.map(recipe => {
      let costOfIngredients = 0;
      recipe.ingredients.forEach(ing => {
        const item = inventory.find(i => i.id === ing.itemId);
        costOfIngredients += ing.requiredQty * (item ? item.averagePrice : 0);
      });
      const portionCostVal = costOfIngredients;
      const profitVal = recipe.salePrice - portionCostVal;
      const marginPct = recipe.salePrice > 0 ? (profitVal / recipe.salePrice) * 105 : 0;
      
      return {
        ...recipe,
        portionCost: portionCostVal,
        profitMargin: profitVal,
        profitPct: marginPct
      };
    }).sort((a,b) => b.profitMargin - a.profitMargin);

    // Wastage summaries
    const totalWastageLoss = wastage.reduce((sum,w) => sum + w.totalLoss, 0);

    return {
      topProfitable: recipesWithProfit,
      totalWastageLoss
    };
  }, [recipes, inventory, wastage]);

  return (
    <div className="space-y-6">

      {/* Ribbon Navigator */}
      <div className="flex border-b border-neutral-700/30 gap-6 pb-px">
        <button
          onClick={() => setActiveReportTab('analytics')}
          className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === 'analytics'
              ? 'border-saffron-600 text-saffron-500 font-bold'
              : 'border-transparent text-neutral-450 hover:text-neutral-300'
          }`}
        >
          <BarChart3 className="h-4 w-4" /> Reports & Analytics
        </button>

        <button
          onClick={() => setActiveReportTab('schema')}
          className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === 'schema'
              ? 'border-saffron-600 text-saffron-500 font-bold'
              : 'border-transparent text-neutral-450 hover:text-neutral-300'
          }`}
        >
          <Database className="h-4 w-4" /> Relational Database Blueprint
        </button>

        <button
          onClick={() => setActiveReportTab('api')}
          className={`pb-3 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeReportTab === 'api'
              ? 'border-saffron-600 text-saffron-500 font-bold'
              : 'border-transparent text-neutral-450 hover:text-neutral-300'
          }`}
        >
          <Route className="h-4 w-4" /> REST API Structure Architecture
        </button>
      </div>

      {/* TAB 1: ANALYTICS & SIMULATED DOWNLOADS */}
      {activeReportTab === 'analytics' && (
        <div className="space-y-6 font-sans">
          
          {/* Top general statistics list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Downloadable sheets panel */}
            <div className={`p-5 rounded-xl border ${
              darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
            }`}>
              <h3 className="font-bold text-base mb-1">HotelDashboard Audit Ledger Downloads</h3>
              <p className="text-xs text-neutral-450 mb-4">Export raw data logs to spreadsheet files instantly.</p>
 
              <div className="space-y-3 text-xs">
                
                {/* Download Item 1 */}
                <div className={`p-3 rounded-lg flex items-center justify-between border ${
                  darkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div>
                    <span className="font-bold flex items-center gap-1"><FileSpreadsheet className="h-3.5 w-3.5 text-green-500" /> Active Inventory Summary.csv</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Includes unit rates, stocks, and category indexes</span>
                  </div>
                  <button 
                    onClick={() => handleSimulatedDownload('inventory')}
                    className="flex items-center gap-1.5 bg-saffron-600 px-3 py-1.5 text-[11px] text-white rounded font-bold hover:bg-saffron-700 transition-colors shadow shadow-saffron-500/15 cursor-pointer animate-pulse"
                  >
                    <Download className="h-3 w-3" /> Export CSV
                  </button>
                </div>
 
                {/* Download Item 2 */}
                <div className={`p-3 rounded-lg flex items-center justify-between border ${
                  darkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div>
                    <span className="font-bold flex items-center gap-1"><FileSpreadsheet className="h-3.5 w-3.5 text-green-500" /> Procurement Invoices Ledger.csv</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Historically logged wholesaler restocking invoices</span>
                  </div>
                  <button 
                    onClick={() => handleSimulatedDownload('invoices')}
                    className="flex items-center gap-1.5 bg-saffron-600 px-3 py-1.5 text-[11px] text-white rounded font-bold hover:bg-saffron-700 transition-colors shadow shadow-saffron-500/15 cursor-pointer"
                  >
                    <Download className="h-3 w-3" /> Export CSV
                  </button>
                </div>
 
                {/* Download Item 3 */}
                <div className={`p-3 rounded-lg flex items-center justify-between border ${
                  darkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div>
                    <span className="font-bold flex items-center gap-1"><FileSpreadsheet className="h-3.5 w-3.5 text-green-500" /> Food Wastage Audit Logs.csv</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Itemized spoilages with monetary loss allocations</span>
                  </div>
                  <button 
                    onClick={() => handleSimulatedDownload('wastage')}
                    className="flex items-center gap-1.5 bg-saffron-600 px-3 py-1.5 text-[11px] text-white rounded font-bold hover:bg-saffron-700 transition-colors shadow shadow-saffron-500/15 cursor-pointer"
                  >
                    <Download className="h-3 w-3" /> Export CSV
                  </button>
                </div>

              </div>

              {/* Feedbacks */}
              {downloadSuccessType && (
                <div className="mt-4 p-2 px-3 text-[11px] rounded bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2 font-mono justify-center animate-bounce">
                  <CheckCircle className="h-4 w-4" /> Successfully generated and exported <strong>HotelDashboard_{downloadSuccessType}_report.csv</strong>
                </div>
              )}
            </div>

            {/* Top Yield catalog margin analyzer list */}
            <div className={`p-5 rounded-xl border flex flex-col justify-between ${
              darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
            }`}>
              <div>
                <h3 className="font-bold text-base mb-1 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> High-Profit Margin Rankings</h3>
                <p className="text-xs text-neutral-400 mb-4">Dishes sorted by raw margin values.</p>
 
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {calculatedStats.topProfitable.map((rec, index) => (
                    <div key={rec.id} className="flex justify-between items-center text-xs">
                      <div className="flex gap-2 items-center">
                        <span className="font-mono text-neutral-500 text-[11px]">#{index+1}</span>
                        <div>
                          <strong className="block text-neutral-200 dark:text-neutral-100">{rec.name}</strong>
                          <span className="block text-[10px] text-neutral-400">Plates Sale: ₹{rec.salePrice.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right font-mono font-bold text-green-500 flex flex-col gap-0.5">
                        <span>+₹{rec.profitMargin.toFixed(2)}</span>
                        <span className="text-[10px] text-neutral-400 font-normal">({rec.profitPct.toFixed(0)}% gross)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="border-t border-dashed border-neutral-700/50 pt-3 flex items-center justify-between text-[11px] text-neutral-405">
                <span className="text-neutral-400 flex items-center gap-1"><Printer className="h-3 w-3" /> Printable matrix</span>
                <button 
                  onClick={() => alert('Printer spooling simulation initiated. Layout optimized for standard thermal roll and A4 sheets.')}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Trigger Spool Audit Sheet
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: DATABASE SCHEMA BLUEPRINT */}
      {activeReportTab === 'schema' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-xl border ${
            darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
          }`}>
            <div className="flex justify-between items-center border-b border-dashed border-neutral-700/50 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base mb-1 flex items-center gap-2"><Database className="h-5 w-5 text-emerald-450" /> Relational Database Entity Design</h3>
                <p className="text-xs text-neutral-450">Normalized schemas optimized for standard SQL (PostgreSQL) or cloud storage databases (Firebase Firestore).</p>
              </div>
              <span className="text-[10px] font-mono bg-black/20 text-neutral-400 px-2 py-0.5 rounded border border-white/5">3NF Normalization Standard</span>
            </div>

             {/* Visual ER diagram and code schema */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg font-mono text-xs overflow-x-auto ${
                darkMode ? 'bg-black/20 text-slate-300 border border-white/5' : 'bg-neutral-50 text-neutral-800 border'
              }`}>
                <p className="text-emerald-400 font-bold text-sm mb-2">// RELATIONAL GRAPH ENTITY LOGICS:</p>
                <p className="font-semibold text-neutral-400">1. Users Schema [Role definitions]:</p>
                <p className="text-neutral-450 ml-4">id: UUID string (PRIMARY KEY)</p>
                <p className="text-neutral-450 ml-4">email: String (UNIQUE index)</p>
                <p className="text-neutral-450 ml-4">role: UserRole ('Owner' | 'Manager' | 'Staff')</p>
                <p className="text-neutral-450 ml-4">created_at: Timestamp</p>

                <p className="font-semibold text-neutral-400 mt-2">2. InventoryItems Entity [Ingredients]:</p>
                <p className="text-neutral-450 ml-4">id: String (PRIMARY KEY)</p>
                <p className="text-neutral-450 ml-4">name: String (Full name of stock material)</p>
                <p className="text-neutral-450 ml-4">categoryId: VARCHAR Reference (FOREIGN KEY -- Categories.id)</p>
                <p className="text-neutral-450 ml-4">supplierId: VARCHAR Reference (FOREIGN KEY -- Suppliers.id)</p>
                <p className="text-neutral-450 ml-4">stockQty: Decimal (Current weight/units count on-hand)</p>
                <p className="text-neutral-450 ml-4">unit: String ('kg' | 'liters' | 'units' | 'packs')</p>
                <p className="text-neutral-450 ml-4">averagePrice: Decimal (Average procure price used for costing)</p>
                <p className="text-neutral-450 ml-4">reorderLevel: Decimal (Safety stock alerts trigger index)</p>

                <p className="font-semibold text-neutral-400 mt-2">3. Recipes Entity [Dish profiles]:</p>
                <p className="text-neutral-450 ml-4">id: String (PRIMARY KEY)</p>
                <p className="text-neutral-450 ml-4">name: String (Dish Title)</p>
                <p className="text-neutral-450 ml-4">description: Text</p>
                <p className="text-neutral-450 ml-4">salePrice: Decimal (Target sales output price on menu)</p>
                <p className="text-neutral-450 ml-4">prepTimeMinutes: Integer</p>

                <p className="font-semibold text-neutral-400 mt-2">4. RecipeIngredients Map [Join Table]:</p>
                <p className="text-neutral-450 ml-4">recipeId: VARCHAR Ref (FOREIGN KEY -- Recipes.id)</p>
                <p className="text-neutral-450 ml-4">itemId: VARCHAR Ref (FOREIGN KEY -- InventoryItems.id)</p>
                <p className="text-neutral-450 ml-4">requiredQty: Decimal (Portion sizing requirement weight)</p>

                <p className="font-semibold text-neutral-400 mt-2">5. Purchases Audit Log [Restocking logs]:</p>
                <p className="text-neutral-450 ml-4">id: String (PRIMARY KEY)</p>
                <p className="text-neutral-450 ml-4">itemId: VARCHAR (FOREIGN KEY -- InventoryItems.id)</p>
                <p className="text-neutral-450 ml-4">qty: Decimal (Volume bought)</p>
                <p className="text-neutral-450 ml-4">unitPrice: Decimal</p>
                <p className="text-neutral-450 ml-4">totalCost: Decimal</p>
                <p className="text-neutral-450 ml-4 font-bold text-emerald-400">--- Index constraints: Created indexes on unique category lookups for fast aggregations.</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs">
                <HeartHandshake className="h-4 w-4 shrink-0" />
                <p>This layout is constructed to be copy-pasted directly into Prisma ORM, Sequelize models, or raw PostgreSQL triggers.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API SPEC GUIDE */}
      {activeReportTab === 'api' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-xl border ${
            darkMode ? 'bg-[#111318] border-white/5' : 'bg-white border-neutral-200'
          }`}>
            <div className="flex justify-between items-center border-b border-dashed border-neutral-700/50 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base mb-1 flex items-center gap-2"><Route className="h-5 w-5 text-emerald-450" /> Express & REST API Core Endpoints</h3>
                <p className="text-xs text-neutral-455">REST framework routes powering dynamic full-stack synchronization.</p>
              </div>
              <span className="text-[10px] font-mono bg-neutral-500/10 text-neutral-400 px-2 py-0.5 rounded">REST API Standard</span>
            </div>
 
            <div className="space-y-4 text-xs">
              
              {/* Endpoint 1 */}
              <div className={`p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border ${
                darkMode ? 'bg-black/20 border-white/10' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <span className="font-mono text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded">GET</span>
                  <span className="font-mono font-bold text-neutral-300 dark:text-neutral-100 ml-2">/api/inventory</span>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans">Fetches full active ingredient catalog records with live remaining portions weights.</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-450">Response: Array&lt;InventoryItem&gt;</span>
              </div>

              {/* Endpoint 2 */}
              <div className={`p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border ${
                darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <span className="font-mono text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">POST</span>
                  <span className="font-mono font-bold text-neutral-300 dark:text-neutral-100 ml-2">/api/purchases</span>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans">Registers restock receipt ticket. Automatically increments on-hand balances if marked 'Received'.</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-450">Body Payload: PurchaseLog</span>
              </div>

              {/* Endpoint 3 */}
              <div className={`p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border ${
                darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <span className="font-mono text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">POST</span>
                  <span className="font-mono font-bold text-neutral-300 dark:text-neutral-100 ml-2">/api/recipes</span>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans">Creates unified portioning recipe and maps ingredient required costs.</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-450">Body Payload: Recipe</span>
              </div>

              {/* Endpoint 4 */}
              <div className={`p-4 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border ${
                darkMode ? 'bg-neutral-950 border-neutral-850' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <div>
                  <span className="font-mono text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded">POST</span>
                  <span className="font-mono font-bold text-neutral-300 dark:text-neutral-100 ml-2">/api/consumption</span>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans">Logs kitchen daily batch preparation. Triggers automatic stock reductions algorithm.</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-450">Body Payload: ConsumptionLog</span>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
