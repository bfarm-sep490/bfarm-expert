import { PropsWithChildren, useEffect, useState } from "react";
import { ProblemListTable } from "../../components/problem/list-table";
import { useTable } from "@refinedev/antd";
import { useGetIdentity, useList } from "@refinedev/core";
import { IIdentity, IProblem } from "@/interfaces";

export const ProblemListInProblems: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [dataProvider, setDataProvider] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
      onSuccess: (data) => {
        setDataProvider(
          problemData?.data?.filter((x: any) =>
            data?.data?.some((item) => item.id === x.plan_id)
          ) as IProblem[]
        );
        setLoading(false);
      },
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
      loading={problemLoading || planLoading || loading}
      data={dataProvider}
      children={children}
      planIds={data?.data?.map((x) => x.id as number) || []}
    ></ProblemListTable>
  );
};
