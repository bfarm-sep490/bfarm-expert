import type { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status: "waiting" | "ready" | "on the way" | "delivered" | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile[];
  addresses: IAddress[];
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: IEvent[];
  orderNumber: number;
  amount: number;
}
export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export interface IProductivityOverTimeEntry {
  key: number;
  timestamp: string;
  value: number;
}
export interface IQuickStatsEntry {
  key: number;
  stat_name: string;
  value: number;
  description: string;
}

export interface ISeasonProgressEntry {
  key: number;
  timestamp: string;
  progress: number;
}

export interface IPlant {
  id: any;
  plant_id: number;
  plant_name: string;
  quantity: number;
  unit: string;
  description: string;
  is_available: boolean;
  min_temp: number;
  max_temp: number;
  min_humid: number;
  max_humid: number;
  min_moisture: number;
  max_moisture: number;
  min_fertilizer_quantity: number;
  max_fertilizer_quantity: number;
  fertilizer_unit: string;
  min_pesticide_quantity: number;
  max_pesticide_quantity: number;
  pesticide_unit: string;
  min_brix_point: number;
  max_brix_point: number;
  gt_test_kit_color: string;
}

export interface IPlan {
  id: number;
  plant: IPlant;
  yield: IYield;
  plan_name: string;
  description: string;
  started_date: Dayjs | string;
  ended_date: Dayjs | string;
  completed_date?: Dayjs | string;
  status: "Pending" | "Ongoing" | "Completed" | "Cancelled";
  estimated_product: number;
  estimated_unit: string;
  data_environment_url?: string;
  created_by: string;
  created_at: Dayjs | string;
  updated_by?: string;
  updated_at?: Dayjs | string;
}

export interface IYield {
  yield_id: number;
  yield_name: string;
  area_unit: string;
  area: number;
  type: string;
  description: string;
  is_available: boolean;
  size: string;
}
