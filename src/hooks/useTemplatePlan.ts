import { IPlant, IYield, ITemplatePlanResponse, ITemplatePlanRequest } from "@/interfaces";
import { useCreate, useSelect, useList, useOne } from "@refinedev/core";

export const useTemplatePlan = () => {
  const { mutate, isLoading, isError, data } = useCreate<ITemplatePlanResponse>();

  const getTemplatePlan = (values: ITemplatePlanRequest) => {
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

  const { data: plantsData } = useList<IPlant>({
    resource: "plants",
  });

  const { data: yieldsData } = useList<IYield>({
    resource: "yields",
  });

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
    plantsData: plantsData?.data || [],
    yieldsData: yieldsData?.data || [],
    getTemplatePlan,
    isLoading,
    isError,
    data: data?.data,
  };
};

export const useSuggestYield = (plantId?: number) => {
  const { data, isLoading, isError } = useOne<{ data: IYield[] }>({
    resource: "plants",
    id: `${plantId}/suggest-yields`,
    queryOptions: {
      enabled: !!plantId,
    },
  });

  return {
    suggestYields: data?.data || [],
    isLoading,
    isError,
  };
};
