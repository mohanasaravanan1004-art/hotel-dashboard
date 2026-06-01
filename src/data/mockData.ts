import { Category, Supplier, InventoryItem, PurchaseLog, Recipe, WastageLog, AppNotification, ConsumptionLog } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Proteins', description: 'Fresh meats, poultry, and seafood' },
  { id: 'cat-2', name: 'Dairy', description: 'Milk, cream, cheeses, and butter' },
  { id: 'cat-3', name: 'Dry Goods', description: 'Flour, rice, grains, and spices' },
  { id: 'cat-4', name: 'Produce', description: 'Fresh vegetables, fruits, and herbs' },
  { id: 'cat-5', name: 'Oils & Fats', description: 'Cooking oils, sprays, and fats' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Prime Cuts Co.', contactName: 'Robert Vance', phone: '+1 (555) 234-5678', email: 'orders@primecuts.com', leadTimeDays: 2 },
  { id: 'sup-2', name: 'Dairy Express', contactName: 'Helen Wilson', phone: '+1 (555) 987-6543', email: 'sales@dairyexpress.com', leadTimeDays: 1 },
  { id: 'sup-3', name: 'Metro Grains & Spices', contactName: 'Amit Patel', phone: '+1 (555) 765-4321', email: 'info@metrograins.com', leadTimeDays: 3 },
  { id: 'sup-4', name: 'Green Valley Produce', contactName: 'Chloe Bennett', phone: '+1 (555) 456-7890', email: 'fresh@greenvalley.com', leadTimeDays: 1 },
  { id: 'sup-tn', name: 'Chennai Spice Bazaar', contactName: 'Karthik Rajan', phone: '+91 94440 12345', email: 'orders@chennaispice.in', leadTimeDays: 2 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'item-1', name: 'Angus Beef Ribeye', categoryId: 'cat-1', supplierId: 'sup-1', stockQty: 45.5, unit: 'kg', averagePrice: 24.50, reorderLevel: 15.0, lastUpdated: '2026-06-01T10:00:00Z' },
  { id: 'item-2', name: 'Atlantic Salmon fillet', categoryId: 'cat-1', supplierId: 'sup-1', stockQty: 12.0, unit: 'kg', averagePrice: 18.00, reorderLevel: 18.0, lastUpdated: '2026-06-01T09:30:00Z' }, // Low stock
  { id: 'item-3', name: 'Whole Chicken', categoryId: 'cat-1', supplierId: 'sup-1', stockQty: 30.0, unit: 'kg', averagePrice: 7.20, reorderLevel: 20.0, lastUpdated: '2026-06-01T08:15:00Z' },
  { id: 'item-4', name: 'Heavy Whipping Cream', categoryId: 'cat-2', supplierId: 'sup-2', stockQty: 8.5, unit: 'liters', averagePrice: 4.80, reorderLevel: 10.0, lastUpdated: '2026-06-01T07:45:00Z' }, // Low stock
  { id: 'item-5', name: 'Parmigiano Reggiano', categoryId: 'cat-2', supplierId: 'sup-2', stockQty: 15.2, unit: 'kg', averagePrice: 16.50, reorderLevel: 5.0, lastUpdated: '2026-06-01T08:00:00Z' },
  { id: 'item-6', name: 'Unsalted Butter Rounds', categoryId: 'cat-2', supplierId: 'sup-2', stockQty: 25.0, unit: 'kg', averagePrice: 6.20, reorderLevel: 12.0, lastUpdated: '2026-05-31T17:00:00Z' },
  { id: 'item-7', name: 'Premium Jasmine Rice', categoryId: 'cat-3', supplierId: 'sup-3', stockQty: 120.0, unit: 'kg', averagePrice: 2.10, reorderLevel: 40.0, lastUpdated: '2026-05-28T11:00:00Z' },
  { id: 'item-8', name: 'All-Purpose Flour', categoryId: 'cat-3', supplierId: 'sup-3', stockQty: 5.5, unit: 'kg', averagePrice: 1.15, reorderLevel: 25.0, lastUpdated: '2026-06-01T05:00:00Z' }, // Critically Low stock
  { id: 'item-9', name: 'Roma Tomatoes Plump', categoryId: 'cat-4', supplierId: 'sup-4', stockQty: 48.0, unit: 'kg', averagePrice: 3.40, reorderLevel: 20.0, lastUpdated: '2026-06-01T06:00:00Z' },
  { id: 'item-10', name: 'Organic Fresh Garlic', categoryId: 'cat-4', supplierId: 'sup-4', stockQty: 14.2, unit: 'kg', averagePrice: 6.80, reorderLevel: 5.0, lastUpdated: '2026-06-01T06:30:00Z' },
  { id: 'item-11', name: 'Extra Virgin Olive Oil', categoryId: 'cat-5', supplierId: 'sup-3', stockQty: 32.0, unit: 'liters', averagePrice: 9.50, reorderLevel: 10.0, lastUpdated: '2026-05-30T14:30:00Z' },
  { id: 'item-tn-1', name: 'Sona Masuri Rice', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 150.0, unit: 'kg', averagePrice: 1.50, reorderLevel: 50.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-2', name: 'Urad Dal (Black Gram)', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 45.0, unit: 'kg', averagePrice: 3.20, reorderLevel: 10.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-3', name: 'Toor Dal (Pigeon Peas)', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 35.0, unit: 'kg', averagePrice: 2.80, reorderLevel: 10.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-4', name: 'Chettinad Masala Spice', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 15.0, unit: 'kg', averagePrice: 8.50, reorderLevel: 5.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-5', name: 'Tamarind Pulp Paste', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 12.0, unit: 'kg', averagePrice: 4.50, reorderLevel: 4.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-6', name: 'Madras Curry Leaves', categoryId: 'cat-4', supplierId: 'sup-tn', stockQty: 8.0, unit: 'kg', averagePrice: 1.20, reorderLevel: 2.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-7', name: 'Cold Pressed Coconut Oil', categoryId: 'cat-5', supplierId: 'sup-tn', stockQty: 25.0, unit: 'liters', averagePrice: 5.00, reorderLevel: 5.0, lastUpdated: '2026-06-01T12:00:00Z' },
];

export const INITIAL_PURCHASES: PurchaseLog[] = [
  { id: 'pur-1', itemId: 'item-1', supplierId: 'sup-1', qty: 30, unitPrice: 24.50, totalCost: 735.00, purchaseDate: '2026-05-28T09:00:00Z', invoiceNumber: 'INV-7629', status: 'Received' },
  { id: 'pur-2', itemId: 'item-7', supplierId: 'sup-3', qty: 100, unitPrice: 2.10, totalCost: 210.00, purchaseDate: '2026-05-27T14:00:00Z', invoiceNumber: 'INV-8831', status: 'Received' },
  { id: 'pur-3', itemId: 'item-5', supplierId: 'sup-2', qty: 10, unitPrice: 16.50, totalCost: 165.00, purchaseDate: '2026-05-29T10:30:00Z', invoiceNumber: 'INV-2041', status: 'Received' },
  { id: 'pur-4', itemId: 'item-4', supplierId: 'sup-2', qty: 15, unitPrice: 4.80, totalCost: 72.00, purchaseDate: '2026-06-01T08:00:00Z', invoiceNumber: 'INV-9901', status: 'Received' },
  { id: 'pur-5', itemId: 'item-2', supplierId: 'sup-1', qty: 15, unitPrice: 18.00, totalCost: 270.00, purchaseDate: '2026-06-02T11:00:00Z', invoiceNumber: 'INV-9902', status: 'Pending' },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    name: 'Pan-Seared Ribeye Steak',
    description: 'Juicy 350g Prime Ribeye steak with creamy herbed butter and roasted roma garlic tomatoes',
    salePrice: 42.00,
    prepTimeMinutes: 20,
    ingredients: [
      { itemId: 'item-1', requiredQty: 0.35 }, // Beef Ribeye: 0.35 kg
      { itemId: 'item-6', requiredQty: 0.04 }, // Butter: 0.04 kg
      { itemId: 'item-9', requiredQty: 0.15 }, // Roma Tomatoes: 0.15 kg
      { itemId: 'item-10', requiredQty: 0.02 }, // Garlic: 0.02 kg
    ],
  },
  {
    id: 'rec-2',
    name: 'Truffled Garlic Jasmine Rice',
    description: 'A rich and aromatic garlic jasmine rice skillet cooked with olive oil and seasoned parmesan',
    salePrice: 16.50,
    prepTimeMinutes: 15,
    ingredients: [
      { itemId: 'item-7', requiredQty: 0.18 }, // Jasmine Rice: 0.18 kg
      { itemId: 'item-5', requiredQty: 0.025 }, // Parmigiano: 0.025 kg
      { itemId: 'item-10', requiredQty: 0.015 }, // Garlic: 0.015 kg
      { itemId: 'item-11', requiredQty: 0.015 }, // Olive Oil: 0.015 L
    ],
  },
  {
    id: 'rec-3',
    name: 'Creamy Garlic Tuscan Salmon',
    description: 'Seared Atlantic salmon simmered in heavy cream, garlic, fresh tomatoes, and parmesan reduction',
    salePrice: 34.00,
    prepTimeMinutes: 25,
    ingredients: [
      { itemId: 'item-2', requiredQty: 0.22 }, // Salmon: 0.22 kg
      { itemId: 'item-4', requiredQty: 0.12 }, // Cream: 0.12 L
      { itemId: 'item-9', requiredQty: 0.10 }, // Tomatoes: 0.10 kg
      { itemId: 'item-5', requiredQty: 0.015 }, // Parmesan: 0.015 kg
      { itemId: 'item-10', requiredQty: 0.01 }, // Garlic: 0.01 kg
    ],
  },
  {
    id: 'rec-tn-1',
    name: 'Chettinad Chicken Curry',
    description: 'A aromatic chicken curry from Chettinad cooked with roasted spices, fresh coconut pulp, and sprigs of curry leaves',
    salePrice: 18.50,
    prepTimeMinutes: 35,
    ingredients: [
      { itemId: 'item-3', requiredQty: 0.30 }, // Chicken: 0.30 kg
      { itemId: 'item-tn-4', requiredQty: 0.03 }, // Chettinad Masala: 0.03 kg
      { itemId: 'item-10', requiredQty: 0.015 }, // Garlic: 0.015 kg
      { itemId: 'item-tn-7', requiredQty: 0.02 }, // Coconut Oil: 0.02 liters
      { itemId: 'item-tn-6', requiredQty: 0.01 }, // Curry Leaves: 0.01 kg
    ],
  },
  {
    id: 'rec-tn-2',
    name: 'Traditional Sambar & Rice',
    description: 'Fragrant Toor Dal soup simmered with Madras curry leaves, tamarind paste, tomatoes, served over hot Sona Masuri rice',
    salePrice: 12.00,
    prepTimeMinutes: 25,
    ingredients: [
      { itemId: 'item-tn-1', requiredQty: 0.20 }, // Sona Masuri Rice: 0.20 kg
      { itemId: 'item-tn-3', requiredQty: 0.08 }, // Toor Dal: 0.08 kg
      { itemId: 'item-tn-5', requiredQty: 0.02 }, // Tamarind Paste: 0.02 kg
      { itemId: 'item-tn-6', requiredQty: 0.01 }, // Curry Leaves: 0.01 kg
      { itemId: 'item-9', requiredQty: 0.10 }, // Tomatoes: 0.10 kg
    ],
  },
  {
    id: 'rec-tn-3',
    name: 'Crispy Masala Dosa',
    description: 'Crispy fermented rice and Urad dal crepe filled with spud potato masala, served with fresh coconut chutney',
    salePrice: 10.50,
    prepTimeMinutes: 20,
    ingredients: [
      { itemId: 'item-tn-1', requiredQty: 0.15 }, // Sona Masuri Rice: 0.15 kg
      { itemId: 'item-tn-2', requiredQty: 0.05 }, // Urad Dal: 0.05 kg
      { itemId: 'item-10', requiredQty: 0.01 }, // Garlic: 0.01 kg
      { itemId: 'item-tn-7', requiredQty: 0.015 }, // Coconut Oil: 0.015 liters
      { itemId: 'item-tn-6', requiredQty: 0.005 }, // Curry leaves: 0.005 kg
    ],
  },
];

export const INITIAL_CONSUMPTION: ConsumptionLog[] = [
  {
    id: 'con-1',
    recipeId: 'rec-1',
    multiplier: 8, // 8 ribeye dishes served
    loggedBy: 'Chef Marcus',
    loggedAt: '2026-06-01T12:00:00Z',
    notes: 'Busy lunch rush',
    reducedItems: [
      { itemId: 'item-1', itemName: 'Angus Beef Ribeye', qtyReduced: 2.8, unit: 'kg' },
      { itemId: 'item-6', itemName: 'Unsalted Butter Rounds', qtyReduced: 0.32, unit: 'kg' },
      { itemId: 'item-9', itemName: 'Roma Tomatoes Plump', qtyReduced: 1.2, unit: 'kg' },
      { itemId: 'item-10', itemName: 'Organic Fresh Garlic', qtyReduced: 0.16, unit: 'kg' },
    ],
  },
  {
    id: 'con-2',
    recipeId: 'rec-3',
    multiplier: 4, // 4 Tuscan Salmon servings
    loggedBy: 'Chef Marcus',
    loggedAt: '2026-06-01T13:15:00Z',
    notes: 'Table 4 and Table 12',
    reducedItems: [
      { itemId: 'item-2', itemName: 'Atlantic Salmon fillet', qtyReduced: 0.88, unit: 'kg' },
      { itemId: 'item-4', itemName: 'Heavy Whipping Cream', qtyReduced: 0.48, unit: 'liters' },
      { itemId: 'item-9', itemName: 'Roma Tomatoes Plump', qtyReduced: 0.40, unit: 'kg' },
      { itemId: 'item-5', itemName: 'Parmigiano Reggiano', qtyReduced: 0.06, unit: 'kg' },
    ],
  },
];

export const INITIAL_WASTAGE: WastageLog[] = [
  { id: 'was-1', itemId: 'item-4', qty: 1.5, unitPrice: 4.80, totalLoss: 7.20, reason: 'Spoilage', loggedBy: 'Sous Chef Sarah', loggedAt: '2026-06-01T07:30:00Z', notes: 'Cream carton left unsealed overnight' },
  { id: 'was-2', itemId: 'item-9', qty: 2.2, unitPrice: 3.40, totalLoss: 7.48, reason: 'Spoilage', loggedBy: 'Kitchen Assitant Tom', loggedAt: '2026-06-01T08:00:00Z', notes: 'Bruised tomatoes discarded' },
  { id: 'was-3', itemId: 'item-1', qty: 0.4, unitPrice: 24.50, totalLoss: 9.80, reason: 'Prep Error', loggedBy: 'Sous Chef Sarah', loggedAt: '2026-05-31T19:30:00Z', notes: 'Over-trimmed prime ribeye steak portion' },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'not-1', type: 'Low Stock', title: 'Critical Stock Alert', message: 'All-Purpose Flour is critically low (5.5 kg / Reorder level: 25 kg)', timestamp: '2026-06-01T05:00:00Z', isRead: false },
  { id: 'not-2', type: 'Low Stock', title: 'Low Stock Level', message: 'Atlantic Salmon fillet dropped below safety reorder level (12 kg)', timestamp: '2026-06-01T09:30:00Z', isRead: false },
  { id: 'not-3', type: 'Wastage Warning', title: 'High Spoilage Alert', message: '$14.68 wastage logged today (Cream & Tomatoes)', timestamp: '2026-06-01T08:00:00Z', isRead: true },
];
