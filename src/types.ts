export type UserRole = 'Owner' | 'Manager' | 'Staff';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  leadTimeDays: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  supplierId: string;
  stockQty: number; // Current weight or units
  unit: string; // e.g., 'kg', 'liters', 'units', 'packs'
  averagePrice: number; // cost per unit
  reorderLevel: number; // reorder limit triggering warning
  lastUpdated: string;
}

export interface PurchaseLog {
  id: string;
  itemId: string;
  supplierId: string;
  qty: number;
  unitPrice: number;
  totalCost: number;
  purchaseDate: string;
  invoiceNumber: string;
  status: 'Received' | 'Pending' | 'Cancelled';
}

export interface RecipeIngredient {
  itemId: string;
  requiredQty: number; // how much unit utilized
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  salePrice: number; // Recommended target sale price
  prepTimeMinutes: number;
}

export interface ConsumptionLog {
  id: string;
  recipeId: string;
  multiplier: number; // how many portions cooked
  loggedBy: string;
  loggedAt: string;
  notes?: string;
  reducedItems: {
    itemId: string;
    itemName: string;
    qtyReduced: number;
    unit: string;
  }[];
}

export interface WastageLog {
  id: string;
  itemId: string;
  qty: number;
  unitPrice: number;
  totalLoss: number;
  reason: 'Spoilage' | 'Prep Error' | 'Customer Return' | 'Equipment Failure' | 'Other';
  loggedBy: string;
  loggedAt: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  type: 'Low Stock' | 'Wastage Warning' | 'Report' | 'System';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
