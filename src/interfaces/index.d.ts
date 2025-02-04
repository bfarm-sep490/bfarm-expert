import type { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status:
    | "waiting"
    | "ready"
    | "on the way"
    | "delivered"
    | "could not be delivered";
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