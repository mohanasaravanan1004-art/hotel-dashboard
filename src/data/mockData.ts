import { Category, Supplier, InventoryItem, PurchaseLog, Recipe, WastageLog, AppNotification, ConsumptionLog } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Proteins', description: 'Fresh meats, poultry, and seafood' },
  { id: 'cat-2', name: 'Dairy', description: 'Milk, cream, cheeses, and butter' },
  { id: 'cat-3', name: 'Dry Goods', description: 'Flour, rice, grains, and spices' },
  { id: 'cat-4', name: 'Produce', description: 'Fresh vegetables, fruits, and herbs' },
  { id: 'cat-5', name: 'Oils & Fats', description: 'Cooking oils, sprays, and fats' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'Kovai Fresh Meats', contactName: 'Muthuvel Karunanidhi', phone: '+91 98450 67890', email: 'orders@kovaimeats.in', leadTimeDays: 2 },
  { id: 'sup-2', name: 'Madurai Aavin Dairy', contactName: 'Meenakshi Sundaram', phone: '+91 94435 98765', email: 'sales@maduraiaavin.in', leadTimeDays: 1 },
  { id: 'sup-3', name: 'Thanjavur Grains & Paddy', contactName: 'Ranganathan Pillai', phone: '+91 80560 76543', email: 'info@thanjavurgrains.in', leadTimeDays: 3 },
  { id: 'sup-4', name: 'Nilgiri Organic Harvest', contactName: 'Karthika Selvam', phone: '+91 70120 45678', email: 'fresh@nilgiriharvest.in', leadTimeDays: 1 },
  { id: 'sup-tn', name: 'Chennai Spice Bazaar', contactName: 'Karthik Rajan', phone: '+91 94440 12345', email: 'orders@chennaispice.in', leadTimeDays: 2 },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'item-1', name: 'Premium Bone-In Mutton', categoryId: 'cat-1', supplierId: 'sup-1', stockQty: 45.5, unit: 'kg', averagePrice: 11.50, reorderLevel: 15.0, lastUpdated: '2026-06-01T10:00:00Z' },
  { id: 'item-2', name: 'Vanjaram Fish (Seer Fish)', categoryId: 'cat-1', supplierId: 'sup-1', stockQty: 12.0, unit: 'kg', averagePrice: 9.50, reorderLevel: 18.0, lastUpdated: '2026-06-01T09:30:00Z' }, // Low stock
  { id: 'item-3', name: 'Nattu Kozhi (Country Chicken)', categoryId: 'cat-1', supplierId: 'sup-1', stockQty: 30.0, unit: 'kg', averagePrice: 6.00, reorderLevel: 20.0, lastUpdated: '2026-06-01T08:15:00Z' },
  { id: 'item-4', name: 'Buffalo Milk (Aavin Gold)', categoryId: 'cat-2', supplierId: 'sup-2', stockQty: 28.5, unit: 'liters', averagePrice: 1.20, reorderLevel: 10.0, lastUpdated: '2026-06-01T07:45:00Z' },
  { id: 'item-5', name: 'Pure Cow Ghee (A2 Quality)', categoryId: 'cat-2', supplierId: 'sup-2', stockQty: 15.2, unit: 'kg', averagePrice: 12.00, reorderLevel: 5.0, lastUpdated: '2026-06-01T08:00:00Z' },
  { id: 'item-6', name: 'Thick Premium Curd (Yogurt)', categoryId: 'cat-2', supplierId: 'sup-2', stockQty: 25.0, unit: 'kg', averagePrice: 1.85, reorderLevel: 12.0, lastUpdated: '2026-05-31T17:00:00Z' },
  { id: 'item-7', name: 'Seeraga Samba Rice', categoryId: 'cat-3', supplierId: 'sup-3', stockQty: 120.0, unit: 'kg', averagePrice: 2.20, reorderLevel: 40.0, lastUpdated: '2026-05-28T11:00:00Z' },
  { id: 'item-8', name: 'Gram Flour (Kadalai Maavu)', categoryId: 'cat-3', supplierId: 'sup-3', stockQty: 5.5, unit: 'kg', averagePrice: 1.15, reorderLevel: 25.0, lastUpdated: '2026-06-01T05:00:00Z' }, // Critically Low stock
  { id: 'item-9', name: 'Salem Country Tomatoes', categoryId: 'cat-4', supplierId: 'sup-4', stockQty: 48.0, unit: 'kg', averagePrice: 1.40, reorderLevel: 20.0, lastUpdated: '2026-06-01T06:00:00Z' },
  { id: 'item-10', name: 'Sambar Small Onions (Chinna Vengayam)', categoryId: 'cat-4', supplierId: 'sup-4', stockQty: 14.2, unit: 'kg', averagePrice: 1.80, reorderLevel: 5.0, lastUpdated: '2026-06-01T06:30:00Z' },
  { id: 'item-11', name: 'Wood Pressed Gingelly Oil', categoryId: 'cat-5', supplierId: 'sup-tn', stockQty: 32.0, unit: 'liters', averagePrice: 5.50, reorderLevel: 10.0, lastUpdated: '2026-05-30T14:30:00Z' },
  { id: 'item-tn-1', name: 'Sona Masuri Rice', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 150.0, unit: 'kg', averagePrice: 1.50, reorderLevel: 50.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-2', name: 'Urad Dal (Black Gram)', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 45.0, unit: 'kg', averagePrice: 3.20, reorderLevel: 10.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-3', name: 'Toor Dal (Pigeon Peas)', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 35.0, unit: 'kg', averagePrice: 2.80, reorderLevel: 10.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-4', name: 'Chettinad Masala Spice', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 15.0, unit: 'kg', averagePrice: 8.50, reorderLevel: 5.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-5', name: 'Tamarind Pulp Paste', categoryId: 'cat-3', supplierId: 'sup-tn', stockQty: 12.0, unit: 'kg', averagePrice: 4.50, reorderLevel: 4.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-6', name: 'Madras Curry Leaves', categoryId: 'cat-4', supplierId: 'sup-tn', stockQty: 8.0, unit: 'kg', averagePrice: 1.20, reorderLevel: 2.0, lastUpdated: '2026-06-01T12:00:00Z' },
  { id: 'item-tn-7', name: 'Cold Pressed Coconut Oil', categoryId: 'cat-5', supplierId: 'sup-tn', stockQty: 25.0, unit: 'liters', averagePrice: 5.00, reorderLevel: 5.0, lastUpdated: '2026-06-01T12:00:00Z' },
];

export const INITIAL_PURCHASES: PurchaseLog[] = [
  { id: 'pur-1', itemId: 'item-1', supplierId: 'sup-1', qty: 30, unitPrice: 11.50, totalCost: 345.00, purchaseDate: '2026-05-28T09:00:00Z', invoiceNumber: 'INV-7629', status: 'Received' },
  { id: 'pur-2', itemId: 'item-7', supplierId: 'sup-3', qty: 100, unitPrice: 2.20, totalCost: 220.00, purchaseDate: '2026-05-27T14:00:00Z', invoiceNumber: 'INV-8831', status: 'Received' },
  { id: 'pur-3', itemId: 'item-5', supplierId: 'sup-2', qty: 10, unitPrice: 12.00, totalCost: 120.00, purchaseDate: '2026-05-29T10:30:00Z', invoiceNumber: 'INV-2041', status: 'Received' },
  { id: 'pur-4', itemId: 'item-4', supplierId: 'sup-2', qty: 15, unitPrice: 1.20, totalCost: 18.00, purchaseDate: '2026-06-01T08:00:00Z', invoiceNumber: 'INV-9901', status: 'Received' },
  { id: 'pur-5', itemId: 'item-2', supplierId: 'sup-1', qty: 15, unitPrice: 9.50, totalCost: 142.50, purchaseDate: '2026-06-02T11:00:00Z', invoiceNumber: 'INV-9902', status: 'Pending' },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-tn-1',
    name: 'Chettinad Chicken Curry',
    description: 'A aromatic chicken curry from Chettinad cooked with roasted country chicken, hand-ground spices, fresh coconut pulp, and sprigs of curry leaves',
    salePrice: 18.50,
    prepTimeMinutes: 35,
    ingredients: [
      { itemId: 'item-3', requiredQty: 0.30 }, // Country Chicken: 0.30 kg
      { itemId: 'item-tn-4', requiredQty: 0.03 }, // Chettinad Masala: 0.03 kg
      { itemId: 'item-10', requiredQty: 0.05 }, // Small Onions: 0.05 kg
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
    description: 'Crispy fermented rice and Urad dal crepe filled with potato masala, served with organic coconut chutney',
    salePrice: 10.50,
    prepTimeMinutes: 20,
    ingredients: [
      { itemId: 'item-tn-1', requiredQty: 0.15 }, // Sona Masuri Rice: 0.15 kg
      { itemId: 'item-tn-2', requiredQty: 0.05 }, // Urad Dal: 0.05 kg
      { itemId: 'item-10', requiredQty: 0.02 }, // Small Onions: 0.02 kg
      { itemId: 'item-tn-7', requiredQty: 0.015 }, // Coconut Oil: 0.015 liters
      { itemId: 'item-tn-6', requiredQty: 0.005 }, // Curry leaves: 0.005 kg
    ],
  },
  {
    id: 'rec-tn-4',
    name: 'Madras Fish Curry (Meen Kozhambu)',
    description: 'Traditional tangy fish curry made using fresh Vanjaram fish simmered in sour tamarind pulp, coconut oil, fresh curry leaves, and roasted coastal spices',
    salePrice: 19.50,
    prepTimeMinutes: 30,
    ingredients: [
      { itemId: 'item-2', requiredQty: 0.25 }, // Vanjaram Fish: 0.25 kg
      { itemId: 'item-tn-5', requiredQty: 0.03 }, // Tamarind Pulp: 0.03 kg
      { itemId: 'item-11', requiredQty: 0.02 }, // Gingelly Oil: 0.02 L
      { itemId: 'item-tn-6', requiredQty: 0.015 }, // Curry Leaves: 0.015 kg
      { itemId: 'item-9', requiredQty: 0.12 }, // Tomatoes: 0.12 kg
    ],
  },
  {
    id: 'rec-tn-5',
    name: 'Classic Ghee Pongal',
    description: 'Steaming savory porridge of Sona Masuri rice simmered with yellow lentils, tempered with black pepper, fresh ginger simmered in pure A2 cow ghee',
    salePrice: 9.90,
    prepTimeMinutes: 15,
    ingredients: [
      { itemId: 'item-tn-1', requiredQty: 0.18 }, // Sona Masuri Rice: 0.18 kg
      { itemId: 'item-5', requiredQty: 0.03 }, // Pure Ghee: 0.03 kg
      { itemId: 'item-tn-6', requiredQty: 0.008 }, // Curry Leaves: 0.008 kg
    ],
  },
  {
    id: 'rec-tn-6',
    name: 'Thanjavur Mutton Biryani',
    description: 'Festive spiced rice dish cooked with premium Seeraga Samba rice, rich tender bone-in mutton, cardamoms, and pure cow ghee',
    salePrice: 22.00,
    prepTimeMinutes: 45,
    ingredients: [
      { itemId: 'item-1', requiredQty: 0.35 }, // Premium Bone-In Mutton: 0.35 kg
      { itemId: 'item-7', requiredQty: 0.25 }, // Seeraga Samba Rice: 0.25 kg
      { itemId: 'item-5', requiredQty: 0.04 }, // Pure Ghee: 0.04 kg
      { itemId: 'item-10', requiredQty: 0.08 }, // Small Onions: 0.08 kg
      { itemId: 'item-tn-6', requiredQty: 0.01 }, // Curry Leaves: 0.01 kg
    ],
  },
  {
    id: 'rec-tn-7',
    name: 'Madurai Nattu Kozhi Chukka',
    description: 'Dry roasted pepper-fried country chicken cooked with hand-pounded spices, wood-pressed gingelly oil, and organic small onions',
    salePrice: 16.50,
    prepTimeMinutes: 25,
    ingredients: [
      { itemId: 'item-3', requiredQty: 0.30 }, // Nattu Kozhi: 0.30 kg
      { itemId: 'item-11', requiredQty: 0.025 }, // Wood Pressed Gingelly Oil: 0.025 L
      { itemId: 'item-tn-4', requiredQty: 0.04 }, // Chettinad Spice: 0.04 kg
      { itemId: 'item-10', requiredQty: 0.06 }, // Small Onions: 0.06 kg
      { itemId: 'item-tn-6', requiredQty: 0.01 }, // Curry Leaves: 0.01 kg
    ],
  },
];

export const INITIAL_CONSUMPTION: ConsumptionLog[] = [
  {
    id: 'con-1',
    recipeId: 'rec-tn-1',
    multiplier: 12, // 12 Chettinad Chicken dishes served
    loggedBy: 'Chef Muthu',
    loggedAt: '2026-06-01T12:00:00Z',
    notes: 'Busy Sunday lunch rush',
    reducedItems: [
      { itemId: 'item-3', itemName: 'Nattu Kozhi (Country Chicken)', qtyReduced: 3.6, unit: 'kg' },
      { itemId: 'item-tn-4', itemName: 'Chettinad Masala Spice', qtyReduced: 0.36, unit: 'kg' },
      { itemId: 'item-tn-7', itemName: 'Cold Pressed Coconut Oil', qtyReduced: 0.24, unit: 'liters' },
      { itemId: 'item-tn-6', itemName: 'Madras Curry Leaves', qtyReduced: 0.12, unit: 'kg' },
    ],
  },
  {
    id: 'con-2',
    recipeId: 'rec-tn-3',
    multiplier: 15, // 15 Masala Dosa servings
    loggedBy: 'Chef Muthu',
    loggedAt: '2026-06-01T13:15:00Z',
    notes: 'Breakfast peak hours',
    reducedItems: [
      { itemId: 'item-tn-1', itemName: 'Sona Masuri Rice', qtyReduced: 2.25, unit: 'kg' },
      { itemId: 'item-tn-2', itemName: 'Urad Dal (Black Gram)', qtyReduced: 0.75, unit: 'kg' },
      { itemId: 'item-tn-7', itemName: 'Cold Pressed Coconut Oil', qtyReduced: 0.225, unit: 'liters' },
    ],
  },
];

export const INITIAL_WASTAGE: WastageLog[] = [
  { id: 'was-1', itemId: 'item-4', qty: 3.5, unitPrice: 1.20, totalLoss: 4.20, reason: 'Spoilage', loggedBy: 'Sous Chef Velu', loggedAt: '2026-06-01T07:30:00Z', notes: 'Milk packet left un-refrigerated' },
  { id: 'was-2', itemId: 'item-9', qty: 2.2, unitPrice: 1.40, totalLoss: 3.08, reason: 'Spoilage', loggedBy: 'Kitchen Assistant Mani', loggedAt: '2026-06-01T08:00:00Z', notes: 'Bruised country tomatoes discarded' },
  { id: 'was-3', itemId: 'item-1', qty: 0.4, unitPrice: 11.50, totalLoss: 4.60, reason: 'Prep Error', loggedBy: 'Sous Chef Velu', loggedAt: '2026-05-31T19:30:00Z', notes: 'Over-trimmed prime mutton portions' },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'not-1', type: 'Low Stock', title: 'Critical Stock Alert', message: 'Kadalai Maavu (Gram Flour) is critically low (5.5 kg / Reorder level: 25 kg)', timestamp: '2026-06-01T05:00:00Z', isRead: false },
  { id: 'not-2', type: 'Low Stock', title: 'Low Stock Level', message: 'Vanjaram Fish (Seer Fish) dropped below safety reorder level (12 kg)', timestamp: '2026-06-01T09:30:00Z', isRead: false },
  { id: 'not-3', type: 'Wastage Warning', title: 'High Spoilage Alert', message: '$7.28 wastage logged today (Milk & Tomatoes)', timestamp: '2026-06-01T08:00:00Z', isRead: true },
];
