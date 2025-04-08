import { PropsWithChildren } from "react";
import { ProblemListTable } from "../../components/problem/list-table";
import { useTable } from "@refinedev/antd";

export const ProblemListInProblems: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { tableProps } = useTable({
    resource: "problems",
  });
  return <ProblemListTable tableProps={tableProps} children={children}></ProblemListTable>;
};
