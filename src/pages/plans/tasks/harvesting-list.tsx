import { useTable } from "@refinedev/antd";
import { useParams } from "react-router";
import { CaringListTable } from "../../../components/caring-task/list-table";
import { PropsWithChildren } from "react";
import { Table, TableProps } from "antd";
import { HarvestedTaskList } from "../../../components/harvesting-task/list-table";

export const HarvestingTaskListInPlan = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "harvesting-tasks",
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
    <HarvestedTaskList
      tableProps={tableProps}
      children={children}
      showNavigation={`/plans/${id}/harvesting-tasks`}
    />
  );
};
