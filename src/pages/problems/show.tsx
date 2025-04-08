import { PropsWithChildren } from "react";
import { ProblemShowInProblem } from "../../components/problem/drawer-show";
import { Flex } from "antd";
import { CaringModal } from "./create-caring";

export const ProblemShowV2 = ({ children }: PropsWithChildren) => {
  return (
    <Flex>
      <ProblemShowInProblem />
      {children}
    </Flex>
  );
};
