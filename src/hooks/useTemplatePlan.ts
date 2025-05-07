import { IPlant, IYield, ITemplatePlanResponse, ITemplatePlanRequest } from "@/interfaces";
import { useCreate, useSelect, useList, useOne } from "@refinedev/core";

export const useTemplatePlan = () => {
  const { mutate, isLoading, isError, data } = useCreate<ITemplatePlanResponse>();

  const getTemplatePlan = (values: ITemplatePlanRequest) => {
    mutate({
      resource: "plans/template-plan",
      values,
      successNotification: () => {
        return {
          message: `Thông tin mẫu kế hoạch đã được tìm kiếm`,
          description: "Tìm kiếm thành công",
          type: "success",
        };
      },
      errorNotification: () => {
        return {
          message: `Tìm kiếm thất bại`,
          description: "Thông tin mẫu kế hoạch không được tìm kiếm",
          type: "error",
        };
      },
    });
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
