import { IPlant, IYield } from "@/interfaces";
import { useCreate, useSelect } from "@refinedev/core";

export type TemplatePlanRequest = {
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
};

export type TemplatePlanResponse = {
  status: number;
  message: string;
  data: Array<{
    orders: Array<{
      order_id: number;
      quantity: number;
    }>;
    plant_id: number;
    yield_id: number;
    expert_id: number;
    plan_name: string | null;
    description: string | null;
    season_name: string;
    start_date: string;
    end_date: string;
    estimated_product: number;
    seed_quantity: number;
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
};

export const useTemplatePlan = () => {
  const { mutate, isLoading, isError, data } = useCreate<TemplatePlanResponse>();

  const getTemplatePlan = (values: TemplatePlanRequest) => {
    mutate(
      {
        resource: "plans/template-plan",
        values,
      },
      {
        onSuccess: (data) => {
          console.log("Template plan fetched successfully:", data);
        },
        onError: (error) => {
          console.error("Error fetching template plan:", error);
        },
      },
    );
  };

  const { options: plantsOptions } = useSelect<IPlant>({
    resource: "plants",
    optionLabel: "plant_name",
    optionValue: "id",
  });

  const { options: yieldsOptions } = useSelect<IYield>({
    resource: "yields",
    optionLabel: "yield_name",
    optionValue: "id",
  });

  return {
    plantsOptions,
    yieldsOptions,
    getTemplatePlan,
    isLoading,
    isError,
    data: data?.data,
  };
};
