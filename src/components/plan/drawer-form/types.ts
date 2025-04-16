export type PlanType = "order" | "non-order";
export type TemplateType = "with-template" | "without-template";

export type SelectedOrder = {
  id: string;
  quantity: number;
};

export type SummaryRecord = {
  plan_name: string;
  plant_name: string;
  season_name: string;
  start_date: string;
  end_date: string;
  estimated_product: number;
  seed_quantity: number;
  land_name: string;
};

export type TaskSummaryRecord = {
  task_type: string;
  task_count: number;
};
