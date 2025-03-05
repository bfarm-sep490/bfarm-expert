import type { Dayjs } from "dayjs";

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
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
export interface IFarmerPermission {
  id: number;
  farmer_id: number;
  plan_id: number;
  is_active: boolean;
}

export interface IPlan {
  id: number;
  plant_id: number;
  yield_id: number;
  expert_id: number;
  plan_name: string;
  description: string;
  started_date: string;
  ended_date: string;
  completed_date?: string;
  status: "Draft" | "Pending" | "Ongoing" | "Completed" | "Cancelled";
  estimated_product: number;
  estimated_unit: string;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
}

export interface IHarvestingTask {
  task_id: number;
  plan_id: number;
  task_name: string;
  description: string;
  start_date: string;
  end_date: string;
  result_content?: string;
  complete_date?: string;
  quantity_harvested?: number;
  unit_harvested?: string;
  status: "Draft" | "Pending" | "Ongoing" | "Completed";
  farmer_id: number;
  created_at: string;
  updated_at: string;
  priority?: number;
}

export interface IIssue {
  id: number;
  name_issue: string;
  description: string;
  is_actived: boolean;
}

export interface ICaringTask {
  task_id: number;
  plan_id: number;
  problem_id?: number;
  task_name: string;
  result_content?: string;
  task_type: "Planting" | "Nurturing" | "Watering" | "Fertilizing" | "PestControl";
  start_date: string;
  end_date: string;
  complete_date?: string;
  farmer_id: number;
  status: "Draft" | "Pending" | "Ongoing" | "Completed";
  created_at: string;
  updated_at: string;
  priority?: number;
}

export interface IItem {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  status: "UnActived" | "InStock" | "OutStock";
  type: "Uncountable" | "Countable";
}

export interface IAccount {
  id: number;
  email: string;
  role: "Owner" | "Farmer" | "Expert" | "Driver" | "Retailer";
  created_at: string;
  password: string;
  is_active: boolean;
}

export interface IInspector {
  id: number;
  account_id: number;
  address: string;
  name: string;
  image_url: string;
  description: string;
  status: string;
}

export interface IOrder {
  id: number;
  order_id: number;
  price: number;
  status: "paid" | "cancelled" | "pending" | "failed";
  address: string;
  created_at: string;
  is_payed: boolean;
}

export interface IYield {
  id: number;
  yield_name: string;
  area_unit: string;
  area: number;
  type: string;
  description: string;
  size: string;
  is_available: boolean;
}

export interface IDevice {
  id: number;
  yield_id: number;
  device_name: string;
  device_type: string;
  location: string;
  status: "Active" | "InActive" | "Error";
  device_code: string;
  installation_date: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}

export interface IPlant {
  id: number;
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
  min_fertilizer: number;
  max_fertilizer: number;
  fertilizer_unit: string;
  min_pesticide: number;
  max_pesticide: number;
  pesticide_unit: string;
  min_brix_point: number;
  max_brix_point: number;
  gt_test_kit_color: string;
  image_url: string;
}

export interface IOrderPlan {
  url: string;
  quantity: number;
  order_id: number;
  plan_id: number;
  unit: string;
}

export interface IProductionImage {
  image_id: number;
  task_id: number;
  url: string;
}

export interface IInspectingForm {
  id: number;
  plan_id: number;
  task_name: string;
  task_type: string;
  description: string;
  start_date: string;
  end_date: string;
  result_content?: string;
  brix_point?: number;
  temperature?: number;
  humidity?: number;
  moisture?: number;
  shell_color?: string;
  test_gt_kit_color?: string;
  inspecting_quantity: number;
  unit: string;
  issue_percent?: number;
  can_harvest: boolean;
  completed_date?: string;
  inspector_id: number;
  status: "Draft" | "Pending" | "Ongoing" | "Completed" | "Cancelled";
  created_at: string;
  updated_at: string;
}

export interface IPackagingTask {
  id: number;
  plan_id: number;
  task_name: string;
  complete_date?: string;
  packed_unit: string;
  packed_quantity: number;
  description: string;
  result_content: string;
  farmer_id: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  priority?: number;
}

export interface IPackagingItem {
  id: number;
  task_id: number;
  item_id: number;
  quantity: number;
  unit: string;
}

export interface IProblem {
  id: number;
  issue_id?: number;
  name: string;
  description: string;
  date: string;
  type_problem: string;
  status: "Pending" | "Approved" | "Cancelled";
  result: string;
}

export interface IPesticide {
  id: number;
  name: string;
  description: string;
  image: string;
  unit: string;
  available_quantity: number;
  total_quantity: number;
  status: "UnActived" | "InStock" | "OutStock";
  type: "Insecticide" | "Fungicide" | "Herbicide" | "Other";
}

export interface IFertilizer {
  id: number;
  name: string;
  description: string;
  image: string;
  unit: string;
  available_quantity: number;
  total_quantity: number;
  status: "UnActived" | "InStock" | "OutStock";
  type: "Organic" | "Chemical" | "Mixed";
}
