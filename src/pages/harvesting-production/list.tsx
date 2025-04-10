import { HarvestingProductList } from "@/components/production/harvesting/list";
import { Typography } from "antd";
import { type PropsWithChildren } from "react";

export const HarvestingProductionListPage = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Danh sách sản lượng phụ trách
      </Typography.Title>
      <HarvestingProductList />
      {children}
    </>
  );
};
