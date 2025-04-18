import { PropsWithChildren } from "react";
import { ProblemListTable } from "../../components/problem/list-table";
import { useTable } from "@refinedev/antd";
import { useGetIdentity, useList } from "@refinedev/core";
import { IIdentity, IProblem } from "@/interfaces";

export const ProblemListInProblems: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { data: problemData, isLoading: problemLoading } = useList({
    resource: "problems",
  });
  const { data: user } = useGetIdentity<IIdentity>();
  const {
    data,
    isLoading: planLoading,
    refetch,
  } = useList({
    resource: "plans",
    queryOptions: {
      enabled: true,
    },
    filters: [
      {
        field: "expert_id",
        value: user?.id,
        operator: "eq",
      },
    ],
  });
  return (
    <ProblemListTable
      loading={problemLoading || planLoading}
      data={
        problemData?.data?.filter(
          (x) => x?.id && data?.data?.some((item) => item.id === x.id),
        ) as IProblem[]
      }
      children={children}
      planIds={data?.data?.map((x) => x.id as number) || []}
    ></ProblemListTable>
  );
};
