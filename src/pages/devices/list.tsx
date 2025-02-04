import { AntdInferencer } from "@refinedev/inferencer/antd";
import { PropsWithChildren } from "react";

export const DeviceList = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AntdInferencer />
      {children}
    </>
  );
};
