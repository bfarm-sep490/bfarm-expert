import { useTable } from "@refinedev/antd";
import { useParams } from "react-router";
import { PropsWithChildren } from "react";
import { CaringListTable } from "@/components/caring-task/list-table";

export const CaringTaskListInPlan = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "caring-tasks",
    filters: {
      initial: [
        {
          field: "plan_id",
          operator: "eq",
          value: id,
        },
      ],
    },
  });
  return (
    <CaringListTable
      tableProps={tableProps}
      children={children}
      showNavigation={`/plans/${id}/caring-tasks`}
    />
  );
};
