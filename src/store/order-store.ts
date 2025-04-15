import { create } from "zustand";

interface Order {
  id: number;
  name: string;
  quantity: number;
  estimate_pick_up_date: string;
  plant_id: number;
  selected: boolean;
}

interface SelectedOrder {
  id: string;
  quantity: number;
  estimate_pick_up_date: string;
  plant_id: number;
}

interface OrderStore {
  orders: Order[];
  selectedOrders: SelectedOrder[];
  totalQuantity: number;
  selectedPlantId: number | null;
  setOrders: (orders: Order[]) => void;
  setSelectedOrders: (orders: SelectedOrder[]) => void;
  setSelectedPlantId: (plantId: number | null) => void;
  addSelectedOrder: (order: SelectedOrder) => void;
  removeSelectedOrder: (orderId: string) => void;
  clearOrders: () => void;
  calculateTotalQuantity: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  selectedOrders: [],
  totalQuantity: 0,
  selectedPlantId: null,
  setOrders: (orders) => set({ orders }),
  setSelectedOrders: (orders) => {
    set({ selectedOrders: orders });
    get().calculateTotalQuantity();
  },
  setSelectedPlantId: (plantId) => set({ selectedPlantId: plantId }),
  addSelectedOrder: (order) => {
    set((state) => {
      const newSelectedOrders = [...state.selectedOrders, order];
      return { selectedOrders: newSelectedOrders };
    });
    get().calculateTotalQuantity();
  },
  removeSelectedOrder: (orderId) => {
    set((state) => {
      const newSelectedOrders = state.selectedOrders.filter((order) => order.id !== orderId);
      return { selectedOrders: newSelectedOrders };
    });
    get().calculateTotalQuantity();
  },
  clearOrders: () =>
    set({ orders: [], selectedOrders: [], totalQuantity: 0, selectedPlantId: null }),
  calculateTotalQuantity: () => {
    const total = get().selectedOrders.reduce((sum, order) => sum + order.quantity, 0);
    set({ totalQuantity: total });
  },
}));
