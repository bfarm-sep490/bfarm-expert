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
  plant_name: string;
  yield_id: number;
  yield_name: string;
  expert_id: number;
  expert_name: string;
  plan_name: string;
  description: string;
  start_date: string;
  evaluated_result: string;
  end_date: string;
  complete_date?: string;
  status: "Draft" | "Pending" | "Ongoing" | "Completed" | "Cancelled";
  estimated_product: number;
  estimated_unit: string;
  qr_code: string;
  order_ids: number[];
  seed_quantity: number;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  plant_information?: {
    plant_id: number;
  };
  yield_information?: {
    yield_id: number;
  };
  is_approved: boolean;
}

export interface IHarvestingTask {
  id: number;
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
  id: number;
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
  retailer_id: number;
  retailer_name: string;
  plant_id: number;
  plant_name: string;
  plan_information: Array<{
    id: number;
    name: string;
  }>;
  packaging_type_id: number;
  packaging_type_name: string;
  deposit_price: number;
  total_price: number | null;
  status: "Deposit" | "Pending" | "Ongoing" | "Complete" | "Cancel";
  address: string;
  phone: string;
  preorder_quantity: number;
  estimate_pick_up_date: string;
  created_at: string;
  transactions: Array<{
    id: number;
    order_id: number;
    transaction_type: string;
    amount: number;
    created_at: string;
  }>;
}

export interface IYield {
  id: number;
  yield_name: string;
  area_unit: string;
  area: number;
  type: string;
  description: string;
  size: string;
  status: string;
  maximum_quantity: number;
  plan_id_in_use?: number;
  estimated_end_date?: string;
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
  description: string;
  base_price: number;
  type: string;
  image_url: string;
  delta_one: number;
  delta_two: number;
  delta_three: number;
  preservation_day: number;
  estimated_per_one: number;
  average_estimated_per_one: number;
  status: string;
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
  priority?: number;
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
  created_date: string;
  type_problem: string;
  status: "Pending" | "Approve" | "Cancel";
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

export interface ITemplatePlanRequest {
  orders: Array<{
    id: number;
    quantity: number;
  }>;
  plant_id: number;
  yield_id: number;
  start_date: string;
  estimated_product: number;
  seed_quantity: number;
  expert_id: number;
  created_by: string;
}

export interface ITemplatePlanResponse {
  status: number;
  message: string;
  data: Array<{
    id: number;
    name: string;
    description: string;
    plant_id: number;
    yield_id: number;
    season_name: string;
    start_date: string;
    end_date: string;
    estimated_product: number;
    seed_quantity: number;
    orders: Array<{
      order_id: number;
      quantity: number;
    }>;
    expert_id: number;
    plan_name: string | null;
    created_by: string;
    caring_tasks: Array<{
      task_name: string;
      description: string;
      task_type: string;
      start_date: string;
      end_date: string;
      created_by: string;
      fertilizers: Array<{
        fertilizer_id: number;
        quantity: number;
        unit: string;
      }>;
      pesticides: Array<{
        pesticide_id: number;
        quantity: number;
        unit: string;
      }>;
      items: Array<{
        item_id: number;
        quantity: number;
        unit: string;
      }>;
    }>;
    harvesting_tasks: Array<{
      task_name: string;
      description: string;
      start_date: string;
      end_date: string;
      created_by: string;
      items: Array<{
        item_id: number;
        quantity: number;
        unit: string;
      }>;
    }>;
    inspecting_forms: Array<{
      task_name: string;
      description: string;
      start_date: string;
      end_date: string;
      created_by: string;
    }>;
    packaging_tasks: Array<{
      task_name: string;
      packaging_type_id: number;
      description: string;
      start_date: string;
      end_date: string;
      created_by: string;
      total_package_weight: number;
      items: Array<any>;
    }>;
  }>;
}

export type Template = ITemplatePlanResponse["data"][0];

export interface IPackagingType {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

export interface ITemplate {
  id: number;
  plant_id: number;
  description: string;
  season_type: string;
  start_date: string;
  end_date: string;
  estimated_per_one: number;
  duration_days: number;
  plant_template: {
    season_type: string;
    sample_quantity: number;
    caring_tasks: Array<{
      task_name: string;
      description: string;
      task_type: string;
      start_in: number;
      end_in: number;
      fertilizers: Array<{
        fertilizer_id: number;
        quantity: number;
        unit: string;
      }>;
      pesticides: Array<{
        pesticide_id: number;
        quantity: number;
        unit: string;
      }>;
      items: Array<{
        item_id: number;
        quantity: number;
        unit: string;
      }>;
    }>;
    inspecting_tasks: Array<{
      form_name: string;
      description: string;
      start_in: number;
      end_in: number;
    }>;
    harvesting_task_templates: Array<{
      task_name: string;
      description: string;
      start_in: number;
      end_in: number;
      items: Array<{
        item_id: number;
        quantity: number;
        unit: string;
      }>;
    }>;
  };
}

export interface IPackagingProduct {
  id: number;
  order_id: number | null;
  plan_id: number;
  packaging_type_id: number | null;
  plan_name: string;
  plant_id: number;
  plant_name: string;
  packaging_date: string;
  expired_date: string | null;
  quantity_per_pack: number;
  total_packs: number;
  available_packs: number;
  status: string;
  evaluated_result: "Grade 1" | "Grade 2" | "Grade 3" | string;
  retailer_id: number;
  retailer_name: string | null;
  received_pack_quantity: number;
}
